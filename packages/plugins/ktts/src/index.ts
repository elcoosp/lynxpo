import fs from 'node:fs/promises';
import path from 'node:path';
import { logger } from '@lynx-js/rspeedy';
import type { RsbuildPlugin } from '@rsbuild/core';

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
  if (!kotlinType) return 'any';

  // Basic types
  const typeMap: Record<string, string> = {
    // Primitive types
    String: 'string',
    Boolean: 'boolean',
    Int: 'number',
    Double: 'number',
    Float: 'number',
    Long: 'number',
    Any: 'any',
    Unit: 'void',
    'Array<String>': 'string[]',
    'Array<Int>': 'number[]',
    'Array<Boolean>': 'boolean[]',
    // Binary types
    ByteArray: 'ArrayBuffer',

    // Lynx bridge types
    ReadableMap: 'Record<string, any>',
    ReadableArray: 'Array<any>',
    Callback: '<T>() => T',
    Promise: 'Promise<any>', // This is handled specially in parameter parsing
  };

  // Handle nullable types not explicitly defined
  if (kotlinType.endsWith('?') && !typeMap[kotlinType]) {
    const baseType = kotlinType.slice(0, -1);
    return `${kotlinTypeToTS(baseType)} | null`;
  }

  // Handle Array types explicitly (often used in Kotlin)
  if (kotlinType.startsWith('Array<') && kotlinType.endsWith('>')) {
    const genericPart = kotlinType.substring(
      'Array<'.length,
      kotlinType.length - 1,
    );
    return `${kotlinTypeToTS(genericPart)}[]`;
  }

  // Handle TypedReadableMap types
  if (kotlinType.startsWith('TypedReadableMap<') && kotlinType.endsWith('>')) {
    const genericPart = kotlinType.substring(
      'TypedReadableMap<'.length,
      kotlinType.length - 1,
    );
    return extractTypedReadableMapType(genericPart);
  }

  // Handle TypedReadableArray types
  if (
    kotlinType.startsWith('TypedReadableArray<') &&
    kotlinType.endsWith('>')
  ) {
    const genericPart = kotlinType.substring(
      'TypedReadableArray<'.length,
      kotlinType.length - 1,
    );
    return `Array<${kotlinTypeToTS(genericPart)}>`;
  }

  // Handle Promise types for return values
  if (kotlinType.startsWith('Promise<') && kotlinType.endsWith('>')) {
    const genericPart = kotlinType.substring(
      'Promise<'.length,
      kotlinType.length - 1,
    );
    return `Promise<${kotlinTypeToTS(genericPart)}>`;
  }

  // Handle generic types
  if (kotlinType.includes('<') && kotlinType.includes('>')) {
    const baseType = kotlinType.substring(0, kotlinType.indexOf('<'));
    const genericPart = kotlinType.substring(
      kotlinType.indexOf('<') + 1,
      kotlinType.lastIndexOf('>'),
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
      const keyValuePairs = genericPart.split(',').map((s) => s.trim());
      if (keyValuePairs.length === 2) {
        const [keyType, valueType] = keyValuePairs;
        if (keyType === '*' && valueType === '*') {
          return 'Record<string, any>';
        }
        // For maps, most commonly the key will be String in Kotlin
        const tsKeyType =
          keyType === 'String' ? 'string' : kotlinTypeToTS(keyType);
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
  const propertyPairs = typeDefinition.split(',').map((pair) => pair.trim());
  const properties = propertyPairs.map((pair) => {
    const [key, valueType] = pair.split(':').map((p) => p.trim());
    return `${key}: ${kotlinTypeToTS(valueType)}`;
  });

  return `{ ${properties.join('; ')} }`;
};

/**
 * Parses function parameters from Kotlin syntax to TypeScript
 * Handles special case for Promise parameters
 */
const parseFunctionParams = (
  paramString: string,
): {
  params: Array<{ name: string; type: string; kotlinType: string }>;
  hasPromiseParam: boolean;
  promiseType: string;
} => {
  if (!paramString.trim()) {
    return { params: [], hasPromiseParam: false, promiseType: 'any' };
  }

  const params = paramString.split(',').map((param) => {
    const parts = param
      .trim()
      .split(':')
      .map((p) => p.trim());
    const name = parts[0];
    const kotlinType = parts.length > 1 ? parts[1] : 'Any';
    return {
      name,
      type: kotlinTypeToTS(kotlinType),
      kotlinType,
    };
  });

  // Check if the last parameter is a Promise
  const hasPromiseParam =
    (params.length > 0 && params[params.length - 1].kotlinType === 'Promise') ||
    params[params.length - 1].kotlinType.startsWith('Promise<');

  let promiseType = 'any';

  // If the last parameter is a Promise, extract its type information
  if (hasPromiseParam) {
    const lastParam = params[params.length - 1];
    if (
      lastParam.kotlinType.startsWith('Promise<') &&
      lastParam.kotlinType.endsWith('>')
    ) {
      const genericPart = lastParam.kotlinType.substring(
        'Promise<'.length,
        lastParam.kotlinType.length - 1,
      );
      promiseType = kotlinTypeToTS(genericPart);
    }
    // Remove the Promise parameter from the array
    params.pop();
  }

  return { params, hasPromiseParam, promiseType };
};

/**
 * Generates hook code based on the specified strategy
 */
const codeGenerateHooks = (
  nativeModuleName: string,
  methodName: string,
  returnType: string,
  params: Array<{ name: string; type: string }>,
  strategy: HookGenerationStrategy,
  isPromise: boolean,
): string => {
  const pascalCaseName = methodName[0].toUpperCase() + methodName.slice(1);
  const paramsSignature = params.map((p) => `${p.name}: ${p.type}`).join(', ');
  const paramsCall = params.map((p) => p.name).join(', ');

  // Function implementation for getting data
  const getterFunction = `export const get${pascalCaseName} = (${paramsSignature}): ${returnType} =>
  NativeModules.${nativeModuleName}?.${methodName}?.(${paramsCall});`;

  // Different hook implementations based on strategy
  if (strategy === 'direct') {
    // Direct strategy: hook calls the function and returns value
    if (isPromise) {
      return `
${getterFunction}

export const use${pascalCaseName} = (${paramsSignature}) => {
  const [value, setValue] = useState<${returnType}>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await get${pascalCaseName}(${paramsCall});
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [${params.map((p) => p.name).join(', ')}]);

  return { value, loading, error };
};`.trim();
    } else {
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
  }, [${params.map((p) => p.name).join(', ')}]);

  return value;
};`.trim();
    }
  } else {
    // Function-wrapper strategy: hook returns a function that takes params
    if (isPromise) {
      return `
${getterFunction}

export const use${pascalCaseName} = () => {
  const [value, setValue] = useState<${returnType}>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch${pascalCaseName} = useCallback(async (${paramsSignature}) => {
    setLoading(true);
    try {
      const result = await get${pascalCaseName}(${paramsCall});
      setValue(result);
      setError(null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { value, loading, error, fetch: fetch${pascalCaseName} };
};`.trim();
    } else {
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
  }
};

/**
 * Extracts TypedReadableMap and TypedReadableArray declarations from Kotlin code
 */
const extractTypedDeclarations = (
  kotlinCode: string,
): Record<string, string> => {
  const typeDeclarations: Record<string, string> = {};

  // Look for TypedReadableMap declarations
  const typedMapRegex = /typealias\s+(\w+)\s*=\s*TypedReadableMap<([^>]+)>/g;
  let match: RegExpExecArray | null;

  while ((match = typedMapRegex.exec(kotlinCode)) !== null) {
    const [_, typeName, typeDefinition] = match;
    typeDeclarations[typeName] = extractTypedReadableMapType(
      typeDefinition.trim(),
    );
  }

  // Look for TypedReadableArray declarations
  const typedArrayRegex =
    /typealias\s+(\w+)\s*=\s*TypedReadableArray<([^>]+)>/g;

  while ((match = typedArrayRegex.exec(kotlinCode)) !== null) {
    const [_, typeName, typeDefinition] = match;
    typeDeclarations[typeName] =
      `Array<${kotlinTypeToTS(typeDefinition.trim())}>`;
  }

  return typeDeclarations;
};

/**
 * Extract Kotlin enum declarations and their TypeScript equivalents
 */
const extractEnumDeclarations = (
  kotlinCode: string,
): Record<string, string> => {
  const enumDeclarations: Record<string, string> = {};

  // Match enum class declarations
  const enumRegex = /enum\s+class\s+(\w+)(?:\([^)]*\))?\s*\{([^}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = enumRegex.exec(kotlinCode)) !== null) {
    const [_, enumName, enumValues] = match;

    // Extract individual enum values
    const valuesRegex = /(\w+)(?:\(([^)]*)\))?/g;
    let valueMatch: RegExpExecArray | null;
    const valuesList: string[] = [];

    while ((valueMatch = valuesRegex.exec(enumValues)) !== null) {
      valuesList.push(valueMatch[1]);
    }

    // Generate TypeScript union type or enum
    if (valuesList.length > 0) {
      enumDeclarations[enumName] = `export enum ${enumName} {
  ${valuesList.join(',\n  ')}
}`;
    }
  }

  return enumDeclarations;
};

/**
 * Infer the return type of a single-expression Kotlin function
 */
const inferReturnType = (expression: string): string => {
  // Common patterns to infer return types from expressions
  if (
    expression.includes('getString') ||
    expression.includes('.BRAND') ||
    expression.includes('.MODEL') ||
    expression.includes('.DEVICE') ||
    expression.includes('.MANUFACTURER')
  ) {
    return 'String';
  }

  if (expression.includes('.isRunningOnEmulator')) {
    return 'Boolean';
  }

  if (expression.includes('memoryInfo.totalMem')) {
    return 'Long';
  }

  if (expression.includes('.JSValue')) {
    return 'Int';
  }

  if (expression.includes('YearClass')) {
    return 'Int';
  }

  if (expression.includes('Build.VERSION')) {
    return 'String';
  }

  if (expression.includes('Settings.Secure')) {
    return 'String';
  }

  if (expression.includes('Build.SUPPORTED_ABIS')) {
    return 'Array<String>';
  }

  // Default to Any if we can't infer
  return 'Any';
};

/**
 * Create a plugin that converts Kotlin methods to TypeScript definitions
 */
export const pluginKotlinToTS = (
  options: KotlinToTSPluginOptions,
): RsbuildPlugin => {
  // Set default options
  const { modules, generateHooks = true, hookStrategy = 'direct' } = options;

  return {
    name: 'lynxpo:kotlin-to-ts',
    setup(api) {
      api.onBeforeBuild(async (_) => {
        await Promise.all(
          modules.map(async ({ kotlinPath, tsPath }) => {
            try {
              const basename = path.basename(kotlinPath);
              const nativeModuleName = basename.replace('.kt', '');
              const kotlinCode = await fs.readFile(kotlinPath, 'utf-8');

              // Extract type aliases and enums
              const typedDeclarations = extractTypedDeclarations(kotlinCode);
              const enumDeclarations = extractEnumDeclarations(kotlinCode);

              // Updated regex that detects @LynxMethod annotation on a separate line
              // This regex looks for @LynxMethod annotation followed by a function declaration on the next line
              // It also captures the expression part for single-expression functions
              const methodRegex =
                /@LynxMethod\s*(?:\([^)]*\))?\s*\n\s*fun\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)(?:\s*=\s*([^:\n]+)|\s*)(?::\s*([\w<>., ?*:]+))?/gm;

              const methods: string[] = [];
              const hooks: string[] = [];
              const typeInterfaces: string[] = [];
              const processedTypes = new Set<string>();
              let match: RegExpExecArray | null;

              // Add TypedReadableMap and TypedReadableArray interfaces
              Object.entries(typedDeclarations).forEach(
                ([typeName, typeDefinition]) => {
                  typeInterfaces.push(
                    `export type ${typeName} = ${typeDefinition};`,
                  );
                  processedTypes.add(typeName);
                },
              );

              // Add enum declarations
              Object.values(enumDeclarations).forEach((enumDeclaration) => {
                typeInterfaces.push(enumDeclaration);
              });

              while ((match = methodRegex.exec(kotlinCode)) !== null) {
                const lineStart = kotlinCode.lastIndexOf('\n', match.index) + 1;
                const lineEnd = kotlinCode.indexOf('\n', match.index);
                const line = kotlinCode.slice(lineStart, lineEnd);

                // Skip commented lines
                if (!line.trim().startsWith('//')) {
                  const [_, methodName, paramString, expression, returnType] =
                    match;

                  // Determine return type: explicit, inferred from expression, or default
                  let finalReturnType: string;
                  if (returnType) {
                    finalReturnType = returnType.trim();
                  } else if (expression) {
                    finalReturnType = inferReturnType(expression.trim());
                  } else {
                    finalReturnType = 'Any';
                  }

                  // Parse parameters, handling Promise specially
                  const { params, hasPromiseParam, promiseType } =
                    parseFunctionParams(paramString);

                  // If the last parameter is a Promise, adjust the return type
                  let tsReturnType: string;
                  if (hasPromiseParam) {
                    tsReturnType = `Promise<${promiseType}>`;
                  } else {
                    // Check if return type is a defined type alias
                    if (processedTypes.has(finalReturnType)) {
                      tsReturnType = finalReturnType;
                    } else {
                      tsReturnType = kotlinTypeToTS(finalReturnType);
                    }
                  }

                  // Generate parameter interfaces for complex types
                  params.forEach((param) => {
                    if (
                      param.kotlinType?.startsWith('TypedReadableMap<') &&
                      !param.kotlinType.includes(',')
                    ) {
                      const paramTypeName = `${pascalCase(methodName)}${pascalCase(param.name)}Type`;
                      const genericPart = param.kotlinType.substring(
                        'TypedReadableMap<'.length,
                        param.kotlinType.length - 1,
                      );

                      if (!processedTypes.has(paramTypeName)) {
                        typeInterfaces.push(
                          `export type ${paramTypeName} = Record<string, ${kotlinTypeToTS(genericPart)}>;`,
                        );
                        processedTypes.add(paramTypeName);

                        // Update the parameter type
                        param.type = paramTypeName;
                      }
                    }
                  });

                  // Generate method signature with parameters
                  const paramsSignature = params
                    .map((p) => `${p.name}: ${p.type}`)
                    .join(', ');
                  methods.push(
                    `${methodName}(${paramsSignature}): ${tsReturnType};`,
                  );

                  // Generate hooks if enabled
                  if (generateHooks) {
                    hooks.push(
                      codeGenerateHooks(
                        nativeModuleName,
                        methodName,
                        tsReturnType,
                        params,
                        hookStrategy,
                        hasPromiseParam,
                      ),
                    );
                  }
                }
              }

              // Generate TypeScript content
              const imports = [
                'useEffect',
                'useState',
                ...(hookStrategy === 'function-wrapper' ? ['useCallback'] : []),
              ].join(', ');

              const tsContent = `// Auto-generated from ${basename}
import { ${imports} } from "@lynx-js/react";
import { NativeModules as INativeModules } from "@lynx-js/types";

${typeInterfaces.join('\n\n')}

export interface ${nativeModuleName} extends INativeModules {
  ${methods.join('\n  ')}
};

${hooks.join('\n\n')}
`;

              await fs.mkdir(path.dirname(tsPath), { recursive: true });
              await fs.writeFile(tsPath, tsContent);
              logger.info(
                `Generated TypeScript module for ${kotlinPath} → ${tsPath}`,
              );
            } catch (error) {
              logger.error(`Error processing ${kotlinPath}:`, error);
            }
          }),
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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};
