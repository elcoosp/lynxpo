package lynxpo.ktts
import com.google.devtools.ksp.getVisibility
import com.google.devtools.ksp.processing.Dependencies
import com.google.devtools.ksp.processing.KSPLogger
import com.google.devtools.ksp.processing.*
import com.google.devtools.ksp.symbol.*
import com.google.devtools.ksp.validate
import com.squareup.wire.ProtoAdapter
import modtyinfo.*
import modtyinfo.Visibility as ProtoVisibility
import java.io.OutputStream
import java.util.EnumSet

class TypeInfoFileProcessor(environment: SymbolProcessorEnvironment) : SymbolProcessor {
    private val visitedClassDeclarations = mutableSetOf<String>()
    private val visitedTypeAliases = mutableSetOf<String>()
    private val visitedFiles = mutableSetOf<String>()
    private val codeGenerator = environment.codeGenerator
    private val options = environment.options
    override fun process(resolver: Resolver): List<KSAnnotated> {
        val allFiles = resolver.getAllFiles()
        val typeInfoFiles = mutableListOf<TypeInfoFile>()
        
        allFiles.forEach { file ->
            val filePath = file.filePath
            if (visitedFiles.contains(filePath)) return@forEach
            visitedFiles.add(filePath)
            val packageName = file.packageName.asString()
            val moduleAnnotations = mutableMapOf<String, String>()    // Extract imports from file content
            val fileContent = file.toString()
            val lines = fileContent.lines()
            val packageLineIndex = lines.indexOfFirst { it.startsWith("package ") }

            // Extract documentation comments before the package declaration
            val docString = buildString {
                if (packageLineIndex != -1) {
                    val docLines = mutableListOf<String>()
                    var currentLineIndex = packageLineIndex - 1
                    while (currentLineIndex >= 0) {
                        val line = lines[currentLineIndex]
                        val trimmedLine = line.trim()
                        when {
                            trimmedLine.isEmpty() -> {
                                docLines.add(line)
                                currentLineIndex--
                            }
                            trimmedLine.startsWith("//") -> {
                                docLines.add(line) // Line comment
                                currentLineIndex--
                            }
                            trimmedLine.startsWith("/*") ||
                                    trimmedLine.startsWith("*") ||
                                    trimmedLine.endsWith("*/") -> {
                                docLines.add(line) // Block comment
                                currentLineIndex--
                            }
                            else -> break // Stop at non-comment line
                        }
                    }
                    docLines.reverse()
                    append(docLines.joinToString("\n").trim())
                }
            }
            val imports = fileContent.lineSequence()
                .map { line ->
                    // Remove comments and trim whitespace
                    line.split("//").first() // Line comments
                        .split("/*").first() // Block comments start
                        .trim()
                }
                .filter { it.startsWith("import ") }
                .map { line ->
                    line.substringAfter("import ")
                        .trim()
                        .split(Regex("\\s+as\\s+"), limit = 2)
                        .first() // Extract the qualified name before any alias
                }
                .toList()
            
            // Get file-level annotations
            file.annotations.forEach { annotation ->
                moduleAnnotations[annotation.shortName.asString()] = annotation.arguments
                    .joinToString(", ") { "${it.name?.asString() ?: ""}: ${it.value}" }
            }
            
            val packageInfo = PackageInfo(
                name = packageName,
                doc = docString,
                annotations = moduleAnnotations
            )
            
            val classes = mutableListOf<ClassInfo>()
            val typeAliases = mutableListOf<TypeAliasInfo>()
            
            val collector = SymbolCollector(classes, typeAliases)
            file.declarations.forEach { it.accept(collector, Unit) }
            
            val typeInfoFile = TypeInfoFile(
                file_path = filePath,
                package_info = packageInfo,
                classes = classes,
                type_aliases = typeAliases,
                imports = imports,
                module_annotations = moduleAnnotations,
                language = "kotlin",
                language_version = resolver.getKotlinVersion(),
                compiler_flags = resolver.getCompilerFlags()
            )
            
            typeInfoFiles.add(typeInfoFile)
            
            // Write the TypeInfoFile to a file
            writeTypeInfoFile(typeInfoFile, file)
        }
        
        return emptyList() 
    }
    
    private fun writeTypeInfoFile(typeInfoFile: TypeInfoFile, file: KSFile) {
        val outputFileName = file.filePath.substringAfterLast('/').replace(".kt", ".typeinfo")
        
        val dependencies = Dependencies(false,file)
        codeGenerator.createNewFile(
            dependencies = dependencies,
            packageName = typeInfoFile.package_info?.name ?: "",
            fileName = outputFileName
        ).use { output ->
            output.write(TypeInfoFile.ADAPTER.encode(typeInfoFile))
        }
    }
    
    private inner class SymbolCollector(
        private val classes: MutableList<ClassInfo>,
        private val typeAliases: MutableList<TypeAliasInfo>
    ) : KSVisitorVoid() {
        
        override fun visitClassDeclaration(classDeclaration: KSClassDeclaration, data: Unit) {
            val qualifiedName = classDeclaration.qualifiedName?.asString() ?: return
            if (visitedClassDeclarations.contains(qualifiedName)) return
            visitedClassDeclarations.add(qualifiedName)
            
            val classInfo = processClassDeclaration(classDeclaration)
            classes.add(classInfo)
            
            classDeclaration.declarations.forEach { it.accept(this, Unit) }
        }
        
        override fun visitTypeAlias(typeAlias: KSTypeAlias, data: Unit) {
            val qualifiedName = typeAlias.qualifiedName?.asString() ?: return
            if (visitedTypeAliases.contains(qualifiedName)) return
            visitedTypeAliases.add(qualifiedName)
            
            typeAliases.add(processTypeAlias(typeAlias))
        }
    }
    
    private fun processClassDeclaration(classDeclaration: KSClassDeclaration): ClassInfo {
        val methods = mutableListOf<MethodInfo>()
        val properties = mutableListOf<PropertyDefinition>()
        val nestedTypes = mutableListOf<TypeInfo>()
        val serializableTypes = mutableListOf<SerializableTypeInfo>()
        val constructors = mutableListOf<ConstructorInfo>()
        val classAnnotations = mutableMapOf<String, String>()
        
        // Process annotations
        classDeclaration.annotations.forEach { annotation ->
            classAnnotations[annotation.shortName.asString()] = annotation.arguments
                .joinToString(", ") { "${it.name?.asString() ?: ""}: ${it.value}" }
        }
        
        // Process implemented types
        val implementedTypes = classDeclaration.superTypes
            .filter { it.resolve().declaration.qualifiedName?.asString() != "kotlin.Any" }
            .map { createTypeInfo(it) }
            .toList()
        
        // Process superclass
        val superclass = classDeclaration.superTypes
            .firstOrNull { 
                val declaration = it.resolve().declaration
                declaration is KSClassDeclaration && declaration.classKind == ClassKind.CLASS
                    && declaration.qualifiedName?.asString() != "kotlin.Any"
            }
            ?.let { createTypeInfo(it) }
        
        // Process functions (methods)
        classDeclaration.declarations
            .filterIsInstance<KSFunctionDeclaration>()
            .forEach { function ->
                if (function.isConstructor()) {
                    constructors.add(processConstructor(function))
                } else {
                    methods.add(processFunction(function))
                }
            }
        
        // Process properties
        classDeclaration.declarations
            .filterIsInstance<KSPropertyDeclaration>()
            .forEach { property ->
                properties.add(processProperty(property))
            }
        // TODO: add to schema
        val nestedClasses = mutableListOf<ClassInfo>()
        val nestedTypeAliases = mutableListOf<TypeAliasInfo>()

        classDeclaration.declarations
            .filterIsInstance<KSClassDeclaration>()
            .forEach { nestedClass ->
                // Create proper type information for the nested class
                val nestedTypeInfo = createTypeInfo(nestedClass.asStarProjectedType() as KSTypeReference?)

                // Add to the list of nested types
                nestedTypes.add(nestedTypeInfo)

                // Create a collector for this nested class to collect its details
                val nestedCollector = SymbolCollector(nestedClasses, nestedTypeAliases)

                // Visit the nested class to collect its details recursively
                nestedClass.accept(nestedCollector, Unit)

                // Mark the nested class as visited
                val nestedQualifiedName = nestedClass.qualifiedName?.asString()
                if (nestedQualifiedName != null) {
                    visitedClassDeclarations.add(nestedQualifiedName)
                }
            }
        // Process type parameters
        val typeParameters = classDeclaration.typeParameters.map { processTypeParameter(it) }.toList()
        
        // Handle serializable types if necessary
        if (classDeclaration.isSerializable()) {
            serializableTypes.add(processSerializableType(classDeclaration))
        }
        
        val location = createSourceLocation(classDeclaration)
        
        return ClassInfo(
            full_name = classDeclaration.qualifiedName?.asString() ?: "",
            name = classDeclaration.simpleName.asString(),
            methods = methods,
            generic_metadata = classDeclaration.typeParameters.joinToString(", ") { it.name.asString() },
            serializable_types = serializableTypes,
            doc = classDeclaration.docString ?: "",
            location = location,
            package_info = PackageInfo(
                name = classDeclaration.packageName.asString(),
                doc = "",
                annotations = emptyMap()
            ),
            type_aliases = emptyList(),
            annotations = classAnnotations,
            type_parameters = typeParameters,
            properties = properties,
            implemented_types = implementedTypes,
            superclass = superclass,
            kind = mapClassKind(classDeclaration),
            visibility = mapVisibility(classDeclaration.getVisibility()),
            is_final = classDeclaration.modifiers.contains(Modifier.FINAL),
            is_abstract = classDeclaration.modifiers.contains(Modifier.ABSTRACT),
            is_open = classDeclaration.modifiers.contains(Modifier.OPEN),
            is_sealed = classDeclaration.modifiers.contains(Modifier.SEALED),
            constructors = constructors,
            nested_types = nestedTypes,
            companion_object = classDeclaration.declarations
                .filterIsInstance<KSClassDeclaration>()
                .find { it.isCompanionObject }
                ?.simpleName?.asString()
        )
    }
    
    private fun processTypeAlias(typeAlias: KSTypeAlias): TypeAliasInfo {
        val typeParameters = typeAlias.typeParameters.map { processTypeParameter(it) }.toList()
        
        return TypeAliasInfo(
            name = typeAlias.simpleName.asString(),
            full_name = typeAlias.qualifiedName?.asString() ?: "",
            underlying_type = createTypeInfo(typeAlias.type),
            doc = typeAlias.docString ?: "",
            location = createSourceLocation(typeAlias),
            type_parameters = typeParameters,
            visibility = mapVisibility(typeAlias.getVisibility())
        )
    }
    
    private fun processFunction(function: KSFunctionDeclaration): MethodInfo {
        val parameters = function.parameters.map { processParameter(it) }.toList()
        val typeParameters = function.typeParameters.map { processTypeParameter(it) }.toList()
        val annotations = mutableMapOf<String, String>()
        
        function.annotations.forEach { annotation ->
            annotations[annotation.shortName.asString()] = annotation.arguments
                .joinToString(", ") { "${it.name?.asString() ?: ""}: ${it.value}" }
        }
        
        val throws = function.annotations
            .filter { it.shortName.asString() == "Throws" }
            .flatMap { annotation ->
                annotation.arguments
                    .filter { it.name?.asString() == "exceptionClasses" }
                    .flatMap { arg ->
                        (arg.value as? List<*>)?.map { 
                            ((it as? KSType)?.declaration as? KSClassDeclaration)?.qualifiedName?.asString() ?: ""
                        } ?: listOf()
                    }
            }
            .filter { it.isNotEmpty() }
            .toList()
        
        return MethodInfo(
            name = function.simpleName.asString(),
            return_type = createTypeInfo(function.returnType),
            parameters = parameters,
            receiver_type = function.extensionReceiver?.let { createTypeInfo(it) },
            visibility = mapVisibility(function.getVisibility()),
            is_extension = function.extensionReceiver != null,
            is_inline = function.modifiers.contains(Modifier.INLINE),
            is_async = function.annotations.any { it.shortName.asString() == "Async" },
            doc = function.docString ?: "",
            location = createSourceLocation(function),
            is_static =function.parent is KSFile,
                // || function.modifiers.contains(Modifier.COMPANION_OBJECT) ||
            is_abstract = function.modifiers.contains(Modifier.ABSTRACT),
            is_final = function.modifiers.contains(Modifier.FINAL),
            is_open = function.modifiers.contains(Modifier.OPEN),
            is_constructor = false,
            type_parameters = typeParameters,
            throws = throws,
            annotations = annotations,
            is_operator = function.modifiers.contains(Modifier.OPERATOR),
            is_infix = function.modifiers.contains(Modifier.INFIX),
            language_specific_flags = function.modifiers.joinToString(", ") { it.name }
        )
    }
    
    private fun processConstructor(constructor: KSFunctionDeclaration): ConstructorInfo {
        val parameters = constructor.parameters.map { processParameter(it) }.toList()
        val annotations = mutableMapOf<String, String>()
        
        constructor.annotations.forEach { annotation ->
            annotations[annotation.shortName.asString()] = annotation.arguments
                .joinToString(", ") { "${it.name?.asString() ?: ""}: ${it.value}" }
        }
        
        return ConstructorInfo(
            visibility = mapVisibility(constructor.getVisibility()),
            parameters = parameters,
            is_primary =true,
            //is_primary = constructor.modifiers.contains(Modifier.PRIMARY),
            doc = constructor.docString ?: "",
            location = createSourceLocation(constructor),
            annotations = annotations
        )
    }
    
    private fun processParameter(parameter: KSValueParameter): ParameterInfo {
        val annotations = mutableMapOf<String, String>()
        
        parameter.annotations.forEach { annotation ->
            annotations[annotation.shortName.asString()] = annotation.arguments
                .joinToString(", ") { "${it.name?.asString() ?: ""}: ${it.value}" }
        }
        
        val modifiers = mutableListOf<String>()
        if (parameter.isCrossInline) modifiers.add("crossinline")
        if (parameter.isNoInline) modifiers.add("noinline")
        if (parameter.isVararg) modifiers.add("vararg")
        
        return ParameterInfo(
            name = parameter.name?.asString() ?: "",
            type = createTypeInfo(parameter.type),
            has_default_value = parameter.hasDefault,
            default_value_literal = if (parameter.hasDefault) "_hasDefault_" else null,
            doc = "",
            location = createSourceLocation(parameter),
            is_vararg = parameter.isVararg,
            is_crossinline = parameter.isCrossInline,
            is_noinline = parameter.isNoInline,
            annotations = annotations,
            parameter_modifiers = modifiers
        )
    }
    
    private fun processProperty(property: KSPropertyDeclaration): PropertyDefinition {
        val annotations = mutableMapOf<String, String>()
        
        property.annotations.forEach { annotation ->
            annotations[annotation.shortName.asString()] = annotation.arguments
                .joinToString(", ") { "${it.name?.asString() ?: ""}: ${it.value}" }
        }
        
        return PropertyDefinition(
            name = property.simpleName.asString(),
            type = createTypeInfo(property.type),
            location = createSourceLocation(property),
            is_mutable = property.isMutable,
            initial_value_literal = null,
            has_custom_getter = property.getter != null,
            has_custom_setter = property.setter != null,
            visibility = mapVisibility(property.getVisibility()),
            // property.setter?.let { mapVisibility(it.modifiers.contains(Modifier.PUBLIC)) } ?:
            setter_visibility =  mapVisibility(property.getVisibility()),
            doc = property.docString ?: "",
            is_late_init = property.modifiers.contains(Modifier.LATEINIT),
            is_const = property.modifiers.contains(Modifier.CONST),
            // property.modifiers.contains(Modifier.COMPANION_OBJECT) ||
            is_static =  property.parent is KSFile,
            is_lazy = property.annotations.any { it.shortName.asString() == "Lazy" },
            annotations = annotations,
            is_computed = property.getter != null,
            is_abstract = property.modifiers.contains(Modifier.ABSTRACT),
            is_open = property.modifiers.contains(Modifier.OPEN),
            is_final = property.modifiers.contains(Modifier.FINAL)
        )
    }
    
    private fun processTypeParameter(typeParameter: KSTypeParameter): TypeParameterInfo {
        val upperBound = typeParameter.bounds
            .firstOrNull()
            ?.let { createTypeInfo(it) }
        
        val constraints = typeParameter.bounds
            .drop(1)
            .map { createTypeInfo(it) }
            .toList()
        
        return TypeParameterInfo(
            name = typeParameter.name.asString(),
            upper_bound = upperBound,
            lower_bound = null,
            type_constraints = constraints,
            is_reified = typeParameter.modifiers.contains(Modifier.REIFIED),
            is_variant = typeParameter.variance != Variance.INVARIANT,
            variance = when (typeParameter.variance) {
                Variance.COVARIANT -> VarianceKind.COVARIANT
                Variance.CONTRAVARIANT -> VarianceKind.CONTRAVARIANT
                else -> VarianceKind.INVARIANT
            },
            doc = typeParameter.docString ?: "",
            location = createSourceLocation(typeParameter)
        )
    }
    
    private fun processSerializableType(classDeclaration: KSClassDeclaration): SerializableTypeInfo {
        val properties = classDeclaration.declarations
            .filterIsInstance<KSPropertyDeclaration>()
            .map { processProperty(it) }
            .toList()
        
        val enumValues = if (classDeclaration.classKind == ClassKind.ENUM_CLASS) {
            classDeclaration.declarations
                .filterIsInstance<KSClassDeclaration>()
                .filter { it.classKind == ClassKind.ENUM_ENTRY }
                .mapIndexed { index, enumEntry -> 
                    EnumValue(
                        name = enumEntry.simpleName.asString(),
                        property_values = emptyList(),
                        doc = enumEntry.docString ?: "",
                        location = createSourceLocation(enumEntry),
                        ordinal = index,
                        annotations = enumEntry.annotations.associate { 
                            it.shortName.asString() to it.arguments
                                .joinToString(", ") { arg -> "${arg.name?.asString() ?: ""}: ${arg.value}" }
                        },
                        associated_values = emptyMap()
                    )
                }
                .toList()
        } else {
            emptyList()
        }
        
        val constructors = classDeclaration.declarations
            .filterIsInstance<KSFunctionDeclaration>()
            .filter { it.isConstructor() }
            .map { processConstructor(it) }
            .toList()
        
        val typeParameters = classDeclaration.typeParameters
            .map { processTypeParameter(it) }
            .toList()
        
        val nestedTypes = classDeclaration.declarations
            .filterIsInstance<KSClassDeclaration>()
            .map { createTypeInfo(it.asStarProjectedType() as KSTypeReference?) }
            .toList()
        
        val implementedTypes = classDeclaration.superTypes
            .filter { it.resolve().declaration.qualifiedName?.asString() != "kotlin.Any" }
            .map { createTypeInfo(it) }
            .toList()
        
        val superclass = classDeclaration.superTypes
            .firstOrNull { 
                val declaration = it.resolve().declaration
                declaration is KSClassDeclaration && declaration.classKind == ClassKind.CLASS
                    && declaration.qualifiedName?.asString() != "kotlin.Any"
            }
            ?.let { createTypeInfo(it) }
        
        return SerializableTypeInfo(
            full_name = classDeclaration.qualifiedName?.asString() ?: "",
            name = classDeclaration.simpleName.asString(),
            kind = mapClassKind(classDeclaration),
            property_definitions = properties,
            enum_values = enumValues,
            doc = classDeclaration.docString ?: "",
            location = createSourceLocation(classDeclaration),
            type_parameters = typeParameters,
            implemented_types = implementedTypes,
            superclass = superclass,
            is_serializable = classDeclaration.annotations.any { 
                it.shortName.asString() == "Serializable" 
            },
            serialization_strategy = classDeclaration.annotations
                .find { it.shortName.asString() == "SerialName" }
                ?.arguments
                ?.find { it.name?.asString() == "value" }
                ?.value as? String ?: "",
            annotations = classDeclaration.annotations.associate { 
                it.shortName.asString() to it.arguments
                    .joinToString(", ") { arg -> "${arg.name?.asString() ?: ""}: ${arg.value}" }
            },
            constructors = constructors,
            is_sealed = classDeclaration.modifiers.contains(Modifier.SEALED),
            nested_types = nestedTypes,
            companion_object = classDeclaration.declarations
                .filterIsInstance<KSClassDeclaration>()
                .find { it.isCompanionObject }
                ?.simpleName?.asString()
        )
    }
    
    private fun createTypeInfo(typeRef: KSTypeReference?): TypeInfo {
        if (typeRef == null) {
            return TypeInfo(
                full_name = "kotlin.Unit",
                name = "Unit",
                is_nullable = false,
                type_arguments = emptyList(),
                custom_return_hint = null,
                doc = "",
                location = null,
                is_array = false,
                is_collection = false,
                is_map = false,
                language_specific_type = "",
                category = TypeCategory.UNKNOWN,
                type_parameters = emptyList()
            )
        }
        
        val resolvedType = typeRef.resolve()
        val declaration = resolvedType.declaration
        val isNullable = resolvedType.isMarkedNullable
        
        val fullName = when (declaration) {
            is KSClassDeclaration -> declaration.qualifiedName?.asString() ?: "unknown"
            is KSTypeParameter -> declaration.name.asString()
            is KSTypeAlias -> declaration.qualifiedName?.asString() ?: "unknown"
            else -> "unknown"
        }
        
        val name = declaration.simpleName.asString()
        
        val typeArguments = resolvedType.arguments.map { arg ->
            arg.type?.let { createTypeInfo(it) } ?: TypeInfo(
                full_name = "kotlin.Any",
                name = "Any",
                is_nullable = false,
                type_arguments = emptyList(),
                custom_return_hint = null,
                doc = "",
                location = null,
                is_array = false,
                is_collection = false,
                is_map = false,
                language_specific_type = "",
                category = TypeCategory.UNKNOWN,
                type_parameters = emptyList()
            )
        }
        
        val isArray = fullName == "kotlin.Array" || 
                      fullName == "kotlin.ByteArray" || 
                      fullName == "kotlin.ShortArray" || 
                      fullName == "kotlin.IntArray" || 
                      fullName == "kotlin.LongArray" || 
                      fullName == "kotlin.FloatArray" || 
                      fullName == "kotlin.DoubleArray" || 
                      fullName == "kotlin.BooleanArray" || 
                      fullName == "kotlin.CharArray"
        
        val isCollection = fullName.startsWith("kotlin.collections.") && 
                          (fullName.contains("List") || 
                           fullName.contains("Set") || 
                           fullName.contains("Collection"))
        
        val isMap = fullName.startsWith("kotlin.collections.") && fullName.contains("Map")
        
        val category = when {
            declaration is KSClassDeclaration && declaration.classKind == ClassKind.CLASS -> TypeCategory.CLASS
            declaration is KSClassDeclaration && declaration.classKind == ClassKind.INTERFACE -> TypeCategory.INTERFACE
            declaration is KSClassDeclaration && declaration.classKind == ClassKind.ENUM_CLASS -> TypeCategory.ENUM
            declaration is KSTypeAlias -> TypeCategory.TYPE_ALIAS
            declaration is KSTypeParameter -> TypeCategory.GENERIC_PARAMETER
            fullName == "kotlin.Int" || 
            fullName == "kotlin.Long" || 
            fullName == "kotlin.Short" || 
            fullName == "kotlin.Byte" || 
            fullName == "kotlin.Float" || 
            fullName == "kotlin.Double" || 
            fullName == "kotlin.Boolean" || 
            fullName == "kotlin.Char" -> TypeCategory.PRIMITIVE
            else -> TypeCategory.UNKNOWN
        }
        
        return TypeInfo(
            full_name = fullName,
            name = name,
            is_nullable = isNullable,
            type_arguments = typeArguments,
            custom_return_hint = null,
            doc = declaration.docString ?: "",
            location = createSourceLocation(declaration),
            is_array = isArray,
            is_collection = isCollection,
            is_map = isMap,
            language_specific_type = "kotlin:$fullName",
            category = category,
            type_parameters = if (declaration is KSClassDeclaration) {
                declaration.typeParameters.map { processTypeParameter(it) }.toList()
            } else {
                emptyList()
            }
        )
    }
    
    private fun createSourceLocation(node: KSNode): SourceLocation {
            val location = node.location
            val fileLocation = location as? FileLocation ?: return SourceLocation()
            // FIXME find a way to retrieve it, not in fileLocation
            val columnNumber = 0
            return SourceLocation(
                    // file_path = fileLocation.filePath,
                    start_line = fileLocation.lineNumber,
                    start_column = columnNumber,
                    end_line = fileLocation.lineNumber, // KSP doesn't provide end line/column
                    end_column = columnNumber + (node.toString().length) // Approximate end column
            )
        }
    
    private fun mapVisibility(visibility: Visibility?): ProtoVisibility {
        return when (visibility) {
            Visibility.PUBLIC -> ProtoVisibility.PUBLIC
            Visibility.PRIVATE -> ProtoVisibility.PRIVATE
            Visibility.PROTECTED -> ProtoVisibility.PROTECTED
            Visibility.INTERNAL -> ProtoVisibility.INTERNAL
            Visibility.LOCAL -> ProtoVisibility.PRIVATE
            else -> ProtoVisibility.PUBLIC
        }
    }
    
    private fun mapClassKind(classDeclaration: KSClassDeclaration): TypeKind {
        return when (classDeclaration.classKind) {
            ClassKind.CLASS -> {
                when {
                    classDeclaration.modifiers.contains(Modifier.SEALED) -> TypeKind.SEALED_CLASS
                    classDeclaration.modifiers.contains(Modifier.VALUE) -> TypeKind.VALUE_CLASS
                    classDeclaration.annotations.any { it.shortName.asString() == "JvmRecord" } -> TypeKind.DATA_CLASS
                    classDeclaration.modifiers.contains(Modifier.DATA) -> TypeKind.DATA_CLASS
                    else -> TypeKind.CLAZZ
                }
            }
            ClassKind.INTERFACE -> TypeKind.INTERF
            ClassKind.ENUM_CLASS -> TypeKind.ENUMERATION
            ClassKind.ENUM_ENTRY -> TypeKind.ENUMERATION
            ClassKind.OBJECT -> TypeKind.OBJ
            ClassKind.ANNOTATION_CLASS -> TypeKind.ANNOTATION_CLASS
            else -> TypeKind.CLAZZ
        }
    }
    
    private fun KSClassDeclaration.isSerializable(): Boolean {
        return this.annotations.any { 
            it.shortName.asString() == "Serializable" 
        }
    }
}
class TypeInfoFileProcessorProvider : SymbolProcessorProvider {
    override fun create(environment: SymbolProcessorEnvironment): SymbolProcessor {
        return TypeInfoFileProcessor(environment)
    }
}


// Extension functions for various utilities
private fun KSFunctionDeclaration.isConstructor(): Boolean = this.simpleName.asString() == "<init>"
// TODO
private fun Resolver.getKotlinVersion(): String = "2"

private fun Resolver.getCompilerFlags(): List<String> {
    val modes = mutableListOf<String>()
    //if (this.getJvmDefaultMode() != null) modes.add("jvmDefault:${this.getJvmDefaultMode()}")
    //if (this.effectiveJavaSourceVersion() != null) modes.add("javaSourceVersion:${this.effectiveJavaSourceVersion()}")
    return modes
}