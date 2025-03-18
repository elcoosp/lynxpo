import Foundation
import SwiftDiagnostics
import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros

/// A peer macro that analyzes a declaration and collects type information into a
/// serialized representation following the proto schema.
public struct NewTypedMacro: PeerMacro {
    public static func expansion(
        of node: AttributeSyntax,
        providingPeersOf declaration: some DeclSyntaxProtocol,
        in context: some MacroExpansionContext
    ) throws -> [DeclSyntax] {
        // Extract type information from the declaration
        let typeInfo = try extractTypeInfo(from: declaration, in: context)

        // Serialize the type info to protobuf binary data
        let serializedData = try typeInfo.serializedData()
        let base64String = serializedData.base64EncodedString()

        // Generate a class that contains the serialized type information
        let typeInfoClass = """
            class TypeInfo {
                static let typeInfo = \"\(base64String)\"
            }
            """

        return [DeclSyntax(stringLiteral: typeInfoClass)]
    }

    // MARK: - Type Information Extraction

    /// Extract type information from a declaration
    private static func extractTypeInfo(
        from declaration: some DeclSyntaxProtocol,
        in context: some MacroExpansionContext
    ) throws -> SerializableTypeInfo {
        // Create a default type info structure
        var typeInfo = SerializableTypeInfo()

        // Determine what kind of declaration we're working with
        if let classDecl = declaration.as(ClassDeclSyntax.self) {
            try processClassDeclaration(classDecl, typeInfo: &typeInfo, context: context)
        } else if let structDecl = declaration.as(StructDeclSyntax.self) {
            try processStructDeclaration(structDecl, typeInfo: &typeInfo, context: context)
        } else if let enumDecl = declaration.as(EnumDeclSyntax.self) {
            try processEnumDeclaration(enumDecl, typeInfo: &typeInfo, context: context)
        } else if let protocolDecl = declaration.as(ProtocolDeclSyntax.self) {
            try processProtocolDeclaration(protocolDecl, typeInfo: &typeInfo, context: context)
        } else if let actorDecl = declaration.as(ActorDeclSyntax.self) {
            try processActorDeclaration(actorDecl, typeInfo: &typeInfo, context: context)
        } else if let extensionDecl = declaration.as(ExtensionDeclSyntax.self) {
            try processExtensionDeclaration(extensionDecl, typeInfo: &typeInfo, context: context)
        } else if let typealiasDecl = declaration.as(TypeAliasDeclSyntax.self) {
            // Type aliases are handled differently, we might want to return a TypeAliasInfo instead
            // For now, create a minimal SerializableTypeInfo
            try processTypeAliasDeclaration(typealiasDecl, typeInfo: &typeInfo, context: context)
        } else {
            // The macro is attached to an unsupported declaration type
            throw TypedMacroError.unsupportedDeclarationType(declaration.description)
        }

        return typeInfo
    }

    // MARK: - Declaration Processing

    /// Process a class declaration
    private static func processClassDeclaration(
        _ declaration: ClassDeclSyntax,
        typeInfo: inout SerializableTypeInfo,
        context: some MacroExpansionContext
    ) throws {
        // Set basic type information
        typeInfo.name = declaration.name.text
        typeInfo.fullName = try getFullTypeName(declaration, context: context)
        typeInfo.kind = .clazz
        typeInfo.doc = extractDocComment(for: declaration)
        typeInfo.location = extractSourceLocation(for: declaration, context: context)

        // Process modifiers (final, open, etc.)
        processModifiers(declaration.modifiers, typeInfo: &typeInfo)

        // Process generic parameters if any
        if let genericParams = declaration.genericParameterClause {
            typeInfo.typeParameters = try extractTypeParameters(from: genericParams)
        }

        // Process inheritance clause (superclass and protocols)
        if let inheritanceClause = declaration.inheritanceClause {
            try processInheritanceClause(inheritanceClause, typeInfo: &typeInfo, context: context)
        }

        // Process members (properties, methods, nested types)
        try processMembers(declaration.memberBlock, typeInfo: &typeInfo, context: context)
    }

    /// Process a struct declaration
    private static func processStructDeclaration(
        _ declaration: StructDeclSyntax,
        typeInfo: inout SerializableTypeInfo,
        context: some MacroExpansionContext
    ) throws {
        // Set basic type information
        typeInfo.name = declaration.name.text
        typeInfo.fullName = try getFullTypeName(declaration, context: context)
        typeInfo.kind = .structure
        typeInfo.doc = extractDocComment(for: declaration)
        typeInfo.location = extractSourceLocation(for: declaration, context: context)

        // Process modifiers
        processModifiers(declaration.modifiers, typeInfo: &typeInfo)

        // Process generic parameters if any
        if let genericParams = declaration.genericParameterClause {
            typeInfo.typeParameters = try extractTypeParameters(from: genericParams)
        }

        // Process inheritance clause (protocols)
        if let inheritanceClause = declaration.inheritanceClause {
            try processInheritanceClause(inheritanceClause, typeInfo: &typeInfo, context: context)
        }

        // Process members (properties, methods, nested types)
        try processMembers(declaration.memberBlock, typeInfo: &typeInfo, context: context)
    }

    /// Process an enum declaration
    private static func processEnumDeclaration(
        _ declaration: EnumDeclSyntax,
        typeInfo: inout SerializableTypeInfo,
        context: some MacroExpansionContext
    ) throws {
        // Set basic type information
        typeInfo.name = declaration.name.text
        typeInfo.fullName = try getFullTypeName(declaration, context: context)
        typeInfo.kind = .enumeration
        typeInfo.doc = extractDocComment(for: declaration)
        typeInfo.location = extractSourceLocation(for: declaration, context: context)

        // Check if enum is frozen/non-frozen (sealed)
        let isFrozen = declaration.attributes.contains { attr in
            if let attr = attr.as(AttributeSyntax.self) {
                return attr.attributeName.trimmedDescription == "frozen"
            }
            return false
        }
        typeInfo.isSealed = isFrozen

        // Process generic parameters if any
        if let genericParams = declaration.genericParameterClause {
            typeInfo.typeParameters = try extractTypeParameters(from: genericParams)
        }

        // Process inheritance clause (protocols and raw value type)
        if let inheritanceClause = declaration.inheritanceClause {
            try processInheritanceClause(inheritanceClause, typeInfo: &typeInfo, context: context)
        }

        // Process enum cases
        var enumValues: [EnumValue] = []

        for member in declaration.memberBlock.members {
            if let caseDecl = member.decl.as(EnumCaseDeclSyntax.self) {
                for element in caseDecl.elements {
                    var enumValue = EnumValue()
                    enumValue.name = element.name.text
                    enumValue.doc = extractDocComment(for: caseDecl)
                    enumValue.location = extractSourceLocation(for: element, context: context)
                    enumValue.ordinal = Int32(enumValues.count)

                    // Process associated values if present
                    if let parameterClause = element.parameterClause {
                        var associatedValues: [String: String] = [:]

                        for parameter in parameterClause.parameters {
                            let name = parameter.firstName?.text ?? "_"
                            let type = parameter.type.trimmedDescription
                            associatedValues[name] = type
                        }

                        enumValue.associatedValues = associatedValues
                    }

                    enumValues.append(enumValue)
                }
            }
        }

        typeInfo.enumValues = enumValues

        // Process members (properties, methods, nested types)
        try processMembers(declaration.memberBlock, typeInfo: &typeInfo, context: context)
    }

    /// Process a protocol declaration
    private static func processProtocolDeclaration(
        _ declaration: ProtocolDeclSyntax,
        typeInfo: inout SerializableTypeInfo,
        context: some MacroExpansionContext
    ) throws {
        // Set basic type information
        typeInfo.name = declaration.name.text
        typeInfo.fullName = try getFullTypeName(declaration, context: context)
        typeInfo.kind = .protocol
        typeInfo.doc = extractDocComment(for: declaration)
        typeInfo.location = extractSourceLocation(for: declaration, context: context)

        // Process inheritance clause (other protocols)
        if let inheritanceClause = declaration.inheritanceClause {
            try processInheritanceClause(inheritanceClause, typeInfo: &typeInfo, context: context)
        }

        // Process members (property requirements, method requirements, associated types)
        try processMembers(declaration.memberBlock, typeInfo: &typeInfo, context: context)
    }

    /// Process an actor declaration
    private static func processActorDeclaration(
        _ declaration: ActorDeclSyntax,
        typeInfo: inout SerializableTypeInfo,
        context: some MacroExpansionContext
    ) throws {
        // Set basic type information
        typeInfo.name = declaration.name.text
        typeInfo.fullName = try getFullTypeName(declaration, context: context)
        typeInfo.kind = .actor
        typeInfo.doc = extractDocComment(for: declaration)
        typeInfo.location = extractSourceLocation(for: declaration, context: context)

        // Process modifiers
        processModifiers(declaration.modifiers, typeInfo: &typeInfo)

        // Process generic parameters if any
        if let genericParams = declaration.genericParameterClause {
            typeInfo.typeParameters = try extractTypeParameters(from: genericParams)
        }

        // Process inheritance clause (protocols)
        if let inheritanceClause = declaration.inheritanceClause {
            try processInheritanceClause(inheritanceClause, typeInfo: &typeInfo, context: context)
        }

        // Process members (properties, methods, nested types)
        try processMembers(declaration.memberBlock, typeInfo: &typeInfo, context: context)
    }

    /// Process an extension declaration
    private static func processExtensionDeclaration(
        _ declaration: ExtensionDeclSyntax,
        typeInfo: inout SerializableTypeInfo,
        context: some MacroExpansionContext
    ) throws {
        // For extensions, we need to get info about the extended type
        let extendedType = declaration.extendedType
        typeInfo.name = extendedType.trimmedDescription
        typeInfo.fullName = try getFullTypeName(declaration, context: context)

        // Infer the kind based on the extended type, which might require semantic analysis
        // For now, we'll set it to UNKNOWN and let the caller refine it if needed
        typeInfo.kind = .clazz  // This is a simplification

        typeInfo.doc = extractDocComment(for: declaration)
        typeInfo.location = extractSourceLocation(for: declaration, context: context)

        // Process inheritance clause (protocols)
        if let inheritanceClause = declaration.inheritanceClause {
            try processInheritanceClause(inheritanceClause, typeInfo: &typeInfo, context: context)
        }

        // Process members (properties, methods, nested types)
        try processMembers(declaration.memberBlock, typeInfo: &typeInfo, context: context)
    }

    /// Process a typealias declaration
    private static func processTypeAliasDeclaration(
        _ declaration: TypeAliasDeclSyntax,
        typeInfo: inout SerializableTypeInfo,
        context: some MacroExpansionContext
    ) throws {
        // For typealiases, we create a placeholder SerializableTypeInfo
        // A more complete implementation would return a TypeAliasInfo instead
        typeInfo.name = declaration.name.text
        typeInfo.fullName = try getFullTypeName(declaration, context: context)
        typeInfo.kind = .clazz  // Not ideal, but we don't have a TYPE_ALIAS in TypeKind
        typeInfo.doc = extractDocComment(for: declaration)
        typeInfo.location = extractSourceLocation(for: declaration, context: context)
    }

    // MARK: - Helper Methods

    /// Process member declarations in a type
    private static func processMembers(
        _ memberBlock: MemberBlockSyntax,
        typeInfo: inout SerializableTypeInfo,
        context: some MacroExpansionContext
    ) throws {
        var properties: [PropertyDefinition] = []
        var methods: [MethodInfo] = []
        var constructors: [ConstructorInfo] = []
        var nestedTypes: [TypeInfo] = []

        for member in memberBlock.members {
            if let varDecl = member.decl.as(VariableDeclSyntax.self) {
                // Process property
                let newProperties = try extractProperties(from: varDecl, context: context)
                properties.append(contentsOf: newProperties)
            } else if let funcDecl = member.decl.as(FunctionDeclSyntax.self) {
                // Process method
                let method = try extractMethod(from: funcDecl, context: context)
                methods.append(method)
            } else if let initDecl = member.decl.as(InitializerDeclSyntax.self) {
                // Process initializer
                let constructor = try extractConstructor(from: initDecl, context: context)
                constructors.append(constructor)
            } else if let classDecl = member.decl.as(ClassDeclSyntax.self) {
                // Process nested class
                var nestedTypeInfo = try extractTypeInfo(for: classDecl, context: context)
                nestedTypes.append(nestedTypeInfo)
            } else if let structDecl = member.decl.as(StructDeclSyntax.self) {
                // Process nested struct
                var nestedTypeInfo = try extractTypeInfo(for: structDecl, context: context)
                nestedTypes.append(nestedTypeInfo)
            } else if let enumDecl = member.decl.as(EnumDeclSyntax.self) {
                // Process nested enum
                var nestedTypeInfo = try extractTypeInfo(for: enumDecl, context: context)
                nestedTypes.append(nestedTypeInfo)
            }
            // Other member types can be added as needed
        }

        typeInfo.propertyDefinitions = properties
        // Convert methods to a format suitable for SerializableTypeInfo if needed
        typeInfo.constructors = constructors
        typeInfo.nestedTypes = nestedTypes
    }

    /// Extract properties from a variable declaration
    private static func extractProperties(
        from varDecl: VariableDeclSyntax,
        context: some MacroExpansionContext
    ) throws -> [PropertyDefinition] {
        var properties: [PropertyDefinition] = []

        for binding in varDecl.bindings {
            var property = PropertyDefinition()

            // Extract property name
            if let pattern = binding.pattern.as(IdentifierPatternSyntax.self) {
                property.name = pattern.identifier.text
            } else {
                // Skip properties with complex patterns
                continue
            }

            // Extract property type
            if let typeAnnotation = binding.typeAnnotation {
                property.type = try extractTypeInfo(from: typeAnnotation.type, context: context)
            } else if let initializer = binding.initializer {
                // If there's no explicit type but there is an initializer, we could try to infer the type
                // This would require semantic information, which is not available in this context
                // For now, we'll create a placeholder type
                var inferred = TypeInfo()
                inferred.name = "Inferred"
                inferred.fullName = "Inferred"
                property.type = inferred
            } else {
                // Neither type annotation nor initializer
                throw TypedMacroError.missingTypeInformation(property.name)
            }

            // Determine mutability
            property.isMutable = varDecl.bindingSpecifier.text == "var"

            // Check for initial value
            if let initializer = binding.initializer {
                property.initialValueLiteral = initializer.value.trimmedDescription
            }

            // Check for accessors (getters, setters)
            // if let accessorBlock = binding.accessorBlock {
            //     property.hasCustomGetter_p = accessorBlock.accessors.contains(where: { accessor in
            //         if case .getter = accessor {} else { return false }
            //         return true
            //     })

            //     property.hasCustomSetter_p = accessorBlock.accessors.contains(where: { accessor in
            //         if case .setter = accessor {} else { return false }
            //         return true
            //     })

            //     property.isComputed = property.hasCustomGetter_p && binding.initializer == nil
            // }

            // Extract visibility from modifiers
            property.visibility = extractVisibility(from: varDecl.modifiers)

            // Check for static property
            property.isStatic = varDecl.modifiers.contains { modifier in
                ["static", "class"].contains(modifier.name.text)
            }

            // Additional property attributes
            property.isLazy = varDecl.modifiers.contains { modifier in
                modifier.name.text == "lazy"
            }

            property.doc = extractDocComment(for: varDecl)
            property.location = extractSourceLocation(for: binding, context: context)

            properties.append(property)
        }

        return properties
    }

    /// Extract method information from a function declaration
    private static func extractMethod(
        from funcDecl: FunctionDeclSyntax,
        context: some MacroExpansionContext
    ) throws -> MethodInfo {
        var methodInfo = MethodInfo()

        // Extract method name
        methodInfo.name = funcDecl.name.text

        // Extract return type
        if let returnClause = funcDecl.signature.returnClause {
            methodInfo.returnType = try extractTypeInfo(from: returnClause.type, context: context)
        } else {
            // Default to Void return type
            var voidType = TypeInfo()
            voidType.name = "Void"
            voidType.fullName = "Swift.Void"
            methodInfo.returnType = voidType
        }

        // Extract parameters
        methodInfo.parameters = try extractParameters(
            from: funcDecl.signature.parameterClause, context: context)

        // Extract generic parameters if any
        if let genericParams = funcDecl.genericParameterClause {
            methodInfo.typeParameters = try extractTypeParameters(from: genericParams)
        }

        // Extract method visibility
        methodInfo.visibility = extractVisibility(from: funcDecl.modifiers)

        // Check for static/class method
        methodInfo.isStatic = funcDecl.modifiers.contains { modifier in
            ["static", "class"].contains(modifier.name.text)
        }

        // Check for additional modifiers
        methodInfo.isAsync = funcDecl.signature.effectSpecifiers?.asyncSpecifier != nil
        methodInfo.isFinal = funcDecl.modifiers.contains { $0.name.text == "final" }
        methodInfo.isOpen = funcDecl.modifiers.contains { $0.name.text == "open" }

        // Check for throws
        if funcDecl.signature.effectSpecifiers?.throwsSpecifier != nil {
            methodInfo.throws = ["Swift.Error"]  // Simplified, as we don't have the exact error types
        }

        // Check if it's an operator
        methodInfo.isOperator = funcDecl.modifiers.contains { $0.name.text == "operator" }

        methodInfo.doc = extractDocComment(for: funcDecl)
        methodInfo.location = extractSourceLocation(for: funcDecl, context: context)

        return methodInfo
    }

    /// Extract constructor information from an initializer declaration
    private static func extractConstructor(
        from initDecl: InitializerDeclSyntax,
        context: some MacroExpansionContext
    ) throws -> ConstructorInfo {
        var constructorInfo = ConstructorInfo()

        // Extract visibility
        constructorInfo.visibility = extractVisibility(from: initDecl.modifiers)

        // Extract parameters
        constructorInfo.parameters = try extractParameters(
            from: initDecl.signature.parameterClause, context: context)

        // Check if it's a required initializer (approximately primary)
        constructorInfo.isPrimary = initDecl.modifiers.contains { $0.name.text == "required" }

        constructorInfo.doc = extractDocComment(for: initDecl)
        constructorInfo.location = extractSourceLocation(for: initDecl, context: context)

        return constructorInfo
    }

    /// Extract parameters from a parameter clause
    private static func extractParameters(
        from parameterClause: FunctionParameterClauseSyntax,
        context: some MacroExpansionContext
    ) throws -> [ParameterInfo] {
        var parameters: [ParameterInfo] = []

        for param in parameterClause.parameters {
            var paramInfo = ParameterInfo()

            // Extract parameter name
            paramInfo.name = param.secondName?.text ?? param.firstName.text

            // Extract parameter type
            paramInfo.type = try extractTypeInfo(from: param.type, context: context)

            // Check for default value
            // paramInfo.hasDefaultValue = param.defaultValue != nil
            // if let defaultValue = param.defaultValue {
            //     paramInfo.defaultValueLiteral = defaultValue.value.trimmedDescription
            // }

            // Check for variadic parameter
            paramInfo.isVararg = param.type.description.hasSuffix("...")

            // Extract location
            paramInfo.location = extractSourceLocation(for: param, context: context)

            parameters.append(paramInfo)
        }

        return parameters
    }

    /// Extract type parameters from a generic parameter clause
    private static func extractTypeParameters(
        from genericClause: GenericParameterClauseSyntax
    ) throws -> [TypeParameterInfo] {
        var typeParameters: [TypeParameterInfo] = []

        for param in genericClause.parameters {
            var typeParam = TypeParameterInfo()

            typeParam.name = param.name.text

            // Extract type constraints
            if let inheritedType = param.inheritedType {
                var upperBound = TypeInfo()
                upperBound.name = inheritedType.trimmedDescription
                upperBound.fullName = inheritedType.trimmedDescription  // Simplified
                typeParam.upperBound = upperBound
            }

            typeParameters.append(typeParam)
        }

        return typeParameters
    }

    /// Process inheritance clause to extract superclass and implemented protocols
    private static func processInheritanceClause(
        _ inheritanceClause: InheritanceClauseSyntax,
        typeInfo: inout SerializableTypeInfo,
        context: some MacroExpansionContext
    ) throws {
        var implementedTypes: [TypeInfo] = []

        for inheritedType in inheritanceClause.inheritedTypes {
            let typeName = inheritedType.type.trimmedDescription

            // In Swift, the first inherited type in a class might be a superclass
            // For this simplified implementation, we'll assume any inherited type could be a protocol
            var typeInfo = TypeInfo()
            typeInfo.name = typeName
            typeInfo.fullName = typeName  // Simplified, ideally this would be the fully-qualified name

            implementedTypes.append(typeInfo)
        }

        if !implementedTypes.isEmpty {
            typeInfo.implementedTypes = implementedTypes

            // For classes, the first type might be a superclass
            // This is a simplification and might not be accurate without semantic information
            if typeInfo.kind == .clazz && !implementedTypes.isEmpty {
                if let firstImplementedType = implementedTypes.first {
                    typeInfo.superclass = firstImplementedType
                }
                typeInfo.implementedTypes = Array(implementedTypes.dropFirst())
            }
        }
    }

    /// Process declaration modifiers (final, open, etc.)
    private static func processModifiers(
        _ modifiers: DeclModifierListSyntax?,
        typeInfo: inout SerializableTypeInfo
    ) {
        guard let modifiers = modifiers else { return }

        // Extract visibility
        let visibility = extractVisibility(from: modifiers)

        // Map additional modifiers to SerializableTypeInfo properties
        let isFinal = modifiers.contains { $0.name.text == "final" }
        let isOpen = modifiers.contains { $0.name.text == "open" }

        // Update type info
        // typeInfo.isFinal = isFinal
        // typeInfo.isOpen = isOpen
    }

    /// Extract visibility from declaration modifiers
    private static func extractVisibility(from modifiers: DeclModifierListSyntax?)
        -> Visibility
    {
        guard let modifiers = modifiers else { return .internal }

        if modifiers.contains(where: { $0.name.text == "public" }) {
            return .public
        } else if modifiers.contains(where: { $0.name.text == "internal" }) {
            return .internal
        } else if modifiers.contains(where: { $0.name.text == "fileprivate" }) {
            return .filePrivate
        } else if modifiers.contains(where: { $0.name.text == "private" }) {
            return .private
        } else if modifiers.contains(where: { $0.name.text == "open" }) {
            return .open
        }

        // Default visibility in Swift is internal
        return .internal
    }

    /// Extract type information for a nested type
    private static func extractTypeInfo(
        for declaration: some DeclSyntaxProtocol,
        context: some MacroExpansionContext
    ) throws -> TypeInfo {
        var typeInfo = TypeInfo()

        if let namedDecl = declaration.asProtocol(NamedDeclSyntax.self) {
            typeInfo.name = namedDecl.name.text
            typeInfo.fullName = try getFullTypeName(declaration, context: context)
        } else {
            throw TypedMacroError.unsupportedDeclarationType(declaration.description)
        }

        // Set the type category based on the declaration kind
        if declaration.is(ClassDeclSyntax.self) {
            typeInfo.category = .class
        } else if declaration.is(StructDeclSyntax.self) {
            typeInfo.category = .struct
        } else if declaration.is(EnumDeclSyntax.self) {
            typeInfo.category = .enum
        } else if declaration.is(ProtocolDeclSyntax.self) {
            typeInfo.category = .interface
        } else {
            typeInfo.category = .unknown
        }

        typeInfo.doc = extractDocComment(for: declaration)
        typeInfo.location = extractSourceLocation(for: declaration, context: context)

        return typeInfo
    }

    /// Extract type information from a TypeSyntax
    private static func extractTypeInfo(
        from type: TypeSyntax,
        context: some MacroExpansionContext
    ) throws -> TypeInfo {
        var typeInfo = TypeInfo()

        if let simpleType = type.as(SimpleTypeIdentifierSyntax.self) {
            // Basic type like Int, String, etc.
            typeInfo.name = simpleType.name.text
            typeInfo.fullName = simpleType.name.text  // Simplified, would need semantic info for complete qualification

            // Try to determine if this is a primitive type
            let primitiveTypes = ["Int", "UInt", "Float", "Double", "Bool", "Character", "String"]
            typeInfo.category = primitiveTypes.contains(typeInfo.name) ? .primitive : .class

        } else if let memberType = type.as(MemberTypeIdentifierSyntax.self) {
            // Qualified type like Module.Type
            typeInfo.name = memberType.name.text
            typeInfo.fullName = type.trimmedDescription
            typeInfo.category = .class  // Assumption

        } else if let optionalType = type.as(OptionalTypeSyntax.self) {
            // Optional type (T?)
            let wrappedType = try extractTypeInfo(from: optionalType.wrappedType, context: context)
            typeInfo = wrappedType
            typeInfo.isNullable = true

        } else if let arrayType = type.as(ArrayTypeSyntax.self) {
            // Array type ([T])
            typeInfo.name = "Array"
            typeInfo.fullName = "Swift.Array"
            typeInfo.category = .class
            typeInfo.isArray = true
            typeInfo.isCollection = true

            // Extract element type
            let elementType = try extractTypeInfo(from: arrayType.elementType, context: context)
            typeInfo.typeArguments = [elementType]

        } else if let dictionaryType = type.as(DictionaryTypeSyntax.self) {
            // Dictionary type ([K: V])
            typeInfo.name = "Dictionary"
            typeInfo.fullName = "Swift.Dictionary"
            typeInfo.category = .class
            typeInfo.isMap = true
            typeInfo.isCollection = true

            // Extract key and value types
            let keyType = try extractTypeInfo(from: dictionaryType.keyType, context: context)
            let valueType = try extractTypeInfo(from: dictionaryType.valueType, context: context)
            typeInfo.typeArguments = [keyType, valueType]

            // } else if let genericType = type.as(GenericIdentifierTypeSyntax.self) {
            //     // Generic type like Array<T>
            //     typeInfo.name = genericType.genericIdentifier.text
            //     typeInfo.fullName = genericType.genericIdentifier.text  // Simplified
            //     typeInfo.category = .class  // Assumption

            //     // Process generic arguments
            //     var typeArguments: [TypeInfo] = []
            //     for argument in genericType.genericArgumentClause.arguments {
            //         let argType = try extractTypeInfo(from: argument.argumentType, context: context)
            //         typeArguments.append(argType)
            //     }
            //     typeInfo.typeArguments = typeArguments

            //     // Check if this is a collection type
            //     let collectionTypes = ["Array", "Set", "Dictionary"]
            //     typeInfo.isCollection
            //     // Check if this is a collection type
            //     let collectionTypes = ["Array", "Set", "Dictionary"]
            //     typeInfo.isCollection = collectionTypes.contains(typeInfo.name)

            //     // Check specific collection types
            //     typeInfo.isArray = typeInfo.name == "Array"
            //     typeInfo.isMap = typeInfo.name == "Dictionary"

        } else if let tupleType = type.as(TupleTypeSyntax.self) {
            // Tuple type like (T1, T2)
            typeInfo.name = "Tuple"
            typeInfo.fullName = "Swift.Tuple"
            typeInfo.category = .tuple

            // Process tuple elements
            var typeArguments: [TypeInfo] = []
            for element in tupleType.elements {
                let elementType = try extractTypeInfo(from: element.type, context: context)
                typeArguments.append(elementType)
            }
            typeInfo.typeArguments = typeArguments

        } else if let functionType = type.as(FunctionTypeSyntax.self) {
            // Function type like (T1) -> T2
            typeInfo.name = "Function"
            typeInfo.fullName = "Swift.Function"
            typeInfo.category = .function

            // Extract parameter types
            var parameterTypes: [TypeInfo] = []
            for parameter in functionType.parameters {
                let paramType = try extractTypeInfo(from: parameter.type, context: context)
                parameterTypes.append(paramType)
            }

            // Extract return type
            let returnType = try extractTypeInfo(
                from: functionType.output.returnType, context: context)

            // Combine parameter types and return type as type arguments
            typeInfo.typeArguments = parameterTypes + [returnType]

        } else if let attributedType = type.as(AttributedTypeSyntax.self) {
            // Type with attributes like @escaping (T) -> Void
            typeInfo = try extractTypeInfo(from: attributedType.baseType, context: context)

        } else if let compositionType = type.as(CompositionTypeSyntax.self) {
            // Protocol composition like P1 & P2
            typeInfo.name = "ProtocolComposition"
            typeInfo.fullName = type.trimmedDescription
            typeInfo.category = .intersection

            // Extract composed types
            var typeArguments: [TypeInfo] = []
            for element in compositionType.elements {
                let elementType = try extractTypeInfo(from: element.type, context: context)
                typeArguments.append(elementType)
            }
            typeInfo.typeArguments = typeArguments

        } else if let metatypeType = type.as(MetatypeTypeSyntax.self) {
            // Metatype like Type.Type or Type.Protocol
            let baseType = try extractTypeInfo(from: metatypeType.baseType, context: context)
            typeInfo = baseType
            typeInfo.name += ".Type"
            typeInfo.fullName += ".Type"

        } else {
            // Fallback for any other type syntax
            typeInfo.name = type.trimmedDescription
            typeInfo.fullName = type.trimmedDescription
            typeInfo.category = .unknown
        }

        return typeInfo
    }

    /// Extract documentation comment for a declaration
    private static func extractDocComment(for node: some SyntaxProtocol) -> String {
        // Find all doc comment trivia tokens preceding the node
        let leadingTrivia = node.leadingTrivia
        var docComments: [String] = []

        for piece in leadingTrivia {
            switch piece {
            case .docLineComment(let comment), .docBlockComment(let comment):
                // Remove comment markers (///, /**, */, etc.)
                var processed = comment
                if processed.hasPrefix("///") {
                    processed = String(processed.dropFirst(3))
                } else if processed.hasPrefix("/**") {
                    processed = String(processed.dropFirst(3).dropLast(2))
                }

                // Trim whitespace
                processed = processed.trimmingCharacters(in: .whitespacesAndNewlines)

                // Add to the list if non-empty
                if !processed.isEmpty {
                    docComments.append(processed)
                }
            default:
                continue
            }
        }

        // Join all doc comment lines
        return docComments.joined(separator: "\n")
    }

    /// Extract source location information for syntax node
    private static func extractSourceLocation(
        for node: some SyntaxProtocol,
        context: some MacroExpansionContext
    ) -> SourceLocation {
        var location = SourceLocation()

        // Use the location method from MacroExpansionContext to get the source location
        if let sourceLocation = context.location(
            of: node, at: .beforeLeadingTrivia, filePathMode: .filePath)
        {
            // Set file path from the source location
            location.filePath = "\(sourceLocation.file)"

            // Set line and column information
            location.startLine = Int32(String(describing: sourceLocation.line)) ?? 0
            location.startColumn = Int32(String(describing: sourceLocation.column)) ?? 0

            // For end position, we can use the position after trailing trivia
            if let endLocation = context.location(
                of: node, at: .afterTrailingTrivia, filePathMode: .filePath)
            {
                location.endLine = Int32(String(describing: endLocation.line)) ?? 0
                location.endColumn = Int32(String(describing: endLocation.line)) ?? 0
            } else {
                // Fallback if we can't get the end location
                location.endLine = location.startLine
                location.endColumn = location.startColumn
            }
        }

        return location
    }

    /// Get fully qualified type name for a declaration
    private static func getFullTypeName(
        _ declaration: some SyntaxProtocol,
        context: some MacroExpansionContext
    ) throws -> String {
        // This is a simplification as we don't have full semantic information
        // In a real implementation, you would use the compiler's semantic information

        // Try to extract module name from context
        var moduleName = "Unknown"
        if let sourceLocation = context.location(of: declaration) {
            let fileString = sourceLocation.file.description
            if let modulePath = fileString.split(separator: "/").first {
                moduleName = String(modulePath)
            }
        }
        // Extract declaration name
        var typeName: String = "Unknown"
        if let namedDecl = declaration.asProtocol(NamedDeclSyntax.self) {
            typeName = namedDecl.name.text
        } else if let extensionDecl = declaration.as(ExtensionDeclSyntax.self) {
            typeName = extensionDecl.extendedType.trimmedDescription
        }

        // Create fully qualified name
        return "\(moduleName).\(typeName)"
    }
}

// MARK: - Error Handling

/// Errors that can occur during type info extraction
enum TypedMacroError: Error, CustomStringConvertible {
    case unsupportedDeclarationType(String)
    case missingTypeInformation(String)
    case invalidTypeStructure(String)

    var description: String {
        switch self {
        case .unsupportedDeclarationType(let typeName):
            return "The @Typed macro cannot be applied to this declaration type: \(typeName)"
        case .missingTypeInformation(let propertyName):
            return "Could not determine type for property: \(propertyName)"
        case .invalidTypeStructure(let details):
            return "Invalid type structure: \(details)"
        }
    }
}

// MARK: - Diagnostic Support

extension TypedMacroError: DiagnosticMessage {
    var severity: DiagnosticSeverity {
        return .error
    }

    var diagnosticID: MessageID {
        return MessageID(domain: "TypedMacro", id: String(describing: self))
    }

    var message: String {
        return self.description
    }

    var fixItID: MessageID? {
        return nil
    }
}
