import type { RsbuildPlugin } from '@rsbuild/core';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '@lynx-js/rspeedy';

/**
 * Configuration for a Kotlin module to be processed
 */
type KotlinModuleConfig = {
    /** Path to the Kotlin module file */
    kotlinPath: string;
    /** Output path for the generated typing file */
    tsPath: string;
};

/**
 * Hook generation strategy options
 */
type HookGenerationStrategy = 'direct' | 'function-wrapper';

/**
 * Plugin configuration options
 */
export interface KotlinToTSPluginOptions {
    /** Array of Kotlin module configurations */
    modules: KotlinModuleConfig[];
    /** Whether to generate hooks (default: true) */
    generateHooks?: boolean;
    /** Strategy for hook generation (default: 'direct') */
    hookStrategy?: HookGenerationStrategy;
}

/**
 * Maps Kotlin types to TypeScript types
 */
const kotlinTypeToTS = (kotlinType: string): string => {
    // Basic types
    const typeMap: Record<string, string> = {
        // Primitive types
        'String': 'string',
        'Boolean': 'boolean',
        'Int': 'number',
        'Double': 'number',
        'Float': 'number',
        'Long': 'number',
        'Any': 'any',
        'Unit': 'void',
        // Binary types
        'ByteArray': 'ArrayBuffer',

        // Lynx bridge types
        'ReadableMap': 'Record<string, any>',
        'ReadableArray': 'Array<any>',
        'Callback': '<T>() => T',
    };

    // Handle nullable types not explicitly defined
    if (kotlinType.endsWith('?') && !typeMap[kotlinType]) {
        const baseType = kotlinType.slice(0, -1);
        return `${kotlinTypeToTS(baseType)} | null`;
    }

    // Handle TypedReadableMap types
    if (kotlinType.startsWith('TypedReadableMap<') && kotlinType.endsWith('>')) {
        const genericPart = kotlinType.substring(
            'TypedReadableMap<'.length,
            kotlinType.length - 1
        );
        return extractTypedReadableMapType(genericPart);
    }

    // Handle TypedReadableArray types
    if (kotlinType.startsWith('TypedReadableArray<') && kotlinType.endsWith('>')) {
        const genericPart = kotlinType.substring(
            'TypedReadableArray<'.length,
            kotlinType.length - 1
        );
        return `Array<${kotlinTypeToTS(genericPart)}>`;
    }

    // Handle generic types
    if (kotlinType.includes('<') && kotlinType.includes('>')) {
        const baseType = kotlinType.substring(0, kotlinType.indexOf('<'));
        const genericPart = kotlinType.substring(
            kotlinType.indexOf('<') + 1,
            kotlinType.lastIndexOf('>')
        );

        // Handle List types
        if (baseType === 'List') {
            if (genericPart === '*') {
                return 'any[]';
            }
            return `${kotlinTypeToTS(genericPart)}[]`;
        }

        // Handle Map types
        if (baseType === 'Map') {
            const keyValuePairs = genericPart.split(',').map(s => s.trim());
            if (keyValuePairs.length === 2) {
                const [keyType, valueType] = keyValuePairs;
                if (keyType === '*' && valueType === '*') {
                    return 'Record<string, any>';
                }
                // For maps, most commonly the key will be String in Kotlin
                const tsKeyType = keyType === 'String' ? 'string' : kotlinTypeToTS(keyType);
                return `Record<${tsKeyType}, ${kotlinTypeToTS(valueType)}>`;
            }
        }
    }

    return typeMap[kotlinType] || 'any';
};

/**
 * Extracts a TypeScript interface from a TypedReadableMap generic parameter
 */
const extractTypedReadableMapType = (typeDefinition: string): string => {
    // If the type definition is simple, just return a Record with that type
    if (!typeDefinition.includes(',')) {
        return `Record<string, ${kotlinTypeToTS(typeDefinition)}>`;
    }

    // For complex typed maps, generate an interface-like object
    const propertyPairs = typeDefinition.split(',').map(pair => pair.trim());
    const properties = propertyPairs.map(pair => {
        const [key, valueType] = pair.split(':').map(p => p.trim());
        return `${key}: ${kotlinTypeToTS(valueType)}`;
    });

    return `{ ${properties.join('; ')} }`;
};

/**
 * Parses function parameters from Kotlin syntax to TypeScript
 */
const parseFunctionParams = (paramString: string): Array<{ name: string, type: string, kotlinType: string }> => {
    if (!paramString.trim()) {
        return [];
    }

    return paramString.split(',').map(param => {
        const parts = param.trim().split(':').map(p => p.trim());
        const name = parts[0];
        const kotlinType = parts[1];
        return {
            name,
            type: kotlinTypeToTS(kotlinType),
            kotlinType
        };
    });
};

/**
 * Generates hook code based on the specified strategy
 */
const codeGenerateHooks = (
    nativeModuleName: string,
    methodName: string,
    returnType: string,
    params: Array<{ name: string, type: string }>,
    strategy: HookGenerationStrategy,
): string => {
    const pascalCaseName = methodName[0].toUpperCase() + methodName.slice(1);
    const paramsSignature = params.map(p => `${p.name}: ${p.type}`).join(', ');
    const paramsCall = params.map(p => p.name).join(', ');

    // Function implementation for getting data
    const getterFunction = `export const get${pascalCaseName} = (${paramsSignature}) => 
  NativeModules.${nativeModuleName}.${methodName}(${paramsCall});`;

    // Different hook implementations based on strategy
    if (strategy === 'direct') {
        // Direct strategy: hook calls the function and returns value
        return `
${getterFunction}

export const use${pascalCaseName} = (${paramsSignature}) => {
  const [value, setValue] = useState<${returnType}>();
  
  useEffect(() => {
    const fetchData = () => {
      const result = get${pascalCaseName}(${paramsCall});
      setValue(result);
    };
    
    fetchData();
  }, [${params.map(p => p.name).join(', ')}]);
  
  return value;
};`.trim();
    } else {
        // Function-wrapper strategy: hook returns a function that takes params
        return `
${getterFunction}

export const use${pascalCaseName} = () => {
  const [value, setValue] = useState<${returnType}>();
  
  const fetch${pascalCaseName} = useCallback((${paramsSignature}) => {
    const result = get${pascalCaseName}(${paramsCall});
    setValue(result);
    return result;
  }, []);
  
  return [value, fetch${pascalCaseName}];
};`.trim();
    }
};

/**
 * Extracts TypedReadableMap and TypedReadableArray declarations from Kotlin code
 */
const extractTypedDeclarations = (kotlinCode: string): Record<string, string> => {
    const typeDeclarations: Record<string, string> = {};

    // Look for TypedReadableMap declarations
    const typedMapRegex = /typealias\s+(\w+)\s*=\s*TypedReadableMap<([^>]+)>/g;
    let match;

    while ((match = typedMapRegex.exec(kotlinCode)) !== null) {
        const [_, typeName, typeDefinition] = match;
        typeDeclarations[typeName] = extractTypedReadableMapType(typeDefinition.trim());
    }

    // Look for TypedReadableArray declarations
    const typedArrayRegex = /typealias\s+(\w+)\s*=\s*TypedReadableArray<([^>]+)>/g;

    while ((match = typedArrayRegex.exec(kotlinCode)) !== null) {
        const [_, typeName, typeDefinition] = match;
        typeDeclarations[typeName] = `Array<${kotlinTypeToTS(typeDefinition.trim())}>`;
    }

    return typeDeclarations;
};

/**
 * Create a plugin that converts Kotlin methods to TypeScript definitions
 */
export const pluginKotlinToTS = (
    options: KotlinToTSPluginOptions,
): RsbuildPlugin => {
    // Set default options
    const {
        modules,
        generateHooks = true,
        hookStrategy = 'direct'
    } = options;

    return {
        name: 'lynxpo:kotlin-to-ts',
        setup(api) {
            api.onBeforeBuild(async (_) => {
                await Promise.all(
                    modules.map(async ({ kotlinPath, tsPath }) => {
                        try {
                            const basename = path.basename(kotlinPath);
                            const nativeModuleName = basename.replace(".kt", "");
                            const kotlinCode = await fs.readFile(kotlinPath, 'utf-8');

                            // Extract type aliases for TypedReadableMap and TypedReadableArray
                            const typedDeclarations = extractTypedDeclarations(kotlinCode);

                            // Improved regex that captures method name, parameters, and return type
                            const methodRegex =
                                /^\s*(?!\/\/)\s*@LynxMethod\s+fun\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:\s*([\w<>., ?*:]+)/gm;

                            const methods: string[] = [];
                            const hooks: string[] = [];
                            const typeInterfaces: string[] = [];
                            const processedTypes = new Set<string>();
                            let match;

                            // Add TypedReadableMap and TypedReadableArray interfaces
                            Object.entries(typedDeclarations).forEach(([typeName, typeDefinition]) => {
                                typeInterfaces.push(`export type ${typeName} = ${typeDefinition};`);
                                processedTypes.add(typeName);
                            });

                            while ((match = methodRegex.exec(kotlinCode)) !== null) {
                                const line = kotlinCode.slice(
                                    kotlinCode.lastIndexOf('\n', match.index) + 1,
                                    kotlinCode.indexOf('\n', match.index)
                                );

                                // Skip commented lines
                                if (!line.includes('//')) {
                                    const [_, methodName, paramString, returnType] = match;

                                    // Process return type
                                    const trimmedReturnType = returnType.trim();
                                    let tsReturnType: string;

                                    // Check if return type is a defined type alias
                                    if (processedTypes.has(trimmedReturnType)) {
                                        tsReturnType = trimmedReturnType;
                                    } else {
                                        tsReturnType = kotlinTypeToTS(trimmedReturnType);
                                    }

                                    // Process parameters
                                    const params = parseFunctionParams(paramString);

                                    // Generate parameter interfaces for complex types
                                    params.forEach(param => {
                                        if (param.kotlinType.startsWith('TypedReadableMap<') && !param.kotlinType.includes(',')) {
                                            const paramTypeName = `${pascalCase(methodName)}${pascalCase(param.name)}Type`;
                                            const genericPart = param.kotlinType.substring(
                                                'TypedReadableMap<'.length,
                                                param.kotlinType.length - 1
                                            );

                                            if (!processedTypes.has(paramTypeName)) {
                                                typeInterfaces.push(
                                                    `export type ${paramTypeName} = Record<string, ${kotlinTypeToTS(genericPart)}>;`
                                                );
                                                processedTypes.add(paramTypeName);

                                                // Update the parameter type
                                                param.type = paramTypeName;
                                            }
                                        }
                                    });

                                    // Generate method signature with parameters
                                    const paramsSignature = params.map(p => `${p.name}: ${p.type}`).join(', ');
                                    methods.push(`${methodName}(${paramsSignature}): ${tsReturnType};`);

                                    // Generate hooks if enabled
                                    if (generateHooks) {
                                        hooks.push(codeGenerateHooks(
                                            nativeModuleName,
                                            methodName,
                                            tsReturnType,
                                            params,
                                            hookStrategy
                                        ));
                                    }
                                }
                            }

                            // Generate TypeScript content
                            const imports = [
                                'useEffect',
                                'useState',
                                ...(hookStrategy === 'function-wrapper' ? ['useCallback'] : [])
                            ].join(', ');

                            const tsContent = `// Auto-generated from ${basename}
import { ${imports} } from "@lynx-js/react";

${typeInterfaces.join('\n\n')}

export type ${nativeModuleName} = {
  ${methods.join('\n  ')}
};

${hooks.join('\n\n')}
`;

                            await fs.mkdir(path.dirname(tsPath), { recursive: true });
                            await fs.writeFile(tsPath, tsContent);
                            logger.info(`Generated TypeScript module for ${kotlinPath} → ${tsPath}`);
                        } catch (error) {
                            logger.error(`Error processing ${kotlinPath}:`, error);
                        }
                    })
                );
            });
        },
    };
};

/**
 * Converts a string to PascalCase
 */
const pascalCase = (str: string): string => {
    return str
        .split(/[^a-zA-Z0-9]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};