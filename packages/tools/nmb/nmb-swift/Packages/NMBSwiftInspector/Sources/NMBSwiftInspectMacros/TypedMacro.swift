import Foundation
@_spi(ExperimentalLanguageFeatures) import SwiftCompilerPlugin
import SwiftProtobuf
import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros

public struct TypeInfoMacro: PeerMacro {
    public static func expansion(
        of node: SwiftSyntax.AttributeSyntax,
        providingPeersOf declaration: some SwiftSyntax.DeclSyntaxProtocol,
        in context: some SwiftSyntaxMacros.MacroExpansionContext
    ) throws -> [SwiftSyntax.DeclSyntax] {

        let collector = TypeInfoCollector(context: context)
        let _ = collector.visit(node)

        let typeInfoFile = collector.generateTypeInfoFile()

        let encodedData: [UInt8] = try typeInfoFile.serializedBytes(
            partial: true, options: BinaryEncodingOptions())

        let metadataClass = """
            @_cdecl("__typeinfo_metadata_\(UUID().uuidString.replacingOccurrences(of: "-", with: ""))")
            private func __typeinfo_metadata() -> UnsafeRawPointer {
                struct TypeInfoMetadata {
                    static let data: [UInt8] = [\(encodedData.map { "\($0)" }.joined(separator: ", "))]
                }
                return UnsafeRawPointer(TypeInfoMetadata.data)
            }
            """
        return [DeclSyntax(stringLiteral: metadataClass)]
    }
}

class TypeInfoCollector: SyntaxVisitor {
    private let context: MacroExpansionContext
    private var visitedClasses = Set<String>()
    private var visitedTypeAliases = Set<String>()
    private var classes = [ClassInfo]()
    private var typeAliases = [TypeAliasInfo]()
    private var imports = [String]()
    private var packageName: String = ""
    private var packageDoc: String = ""

    init(context: some MacroExpansionContext) {
        self.context = context
        super.init(viewMode: .sourceAccurate)
    }

    override func visit(_ node: ImportDeclSyntax) -> SyntaxVisitorContinueKind {
        let importName = node.path.description.trimmingCharacters(in: .whitespacesAndNewlines)
        imports.append(importName)
        return .visitChildren
    }

    override func visit(_ node: ClassDeclSyntax) -> SyntaxVisitorContinueKind {
        let className = node.name.text
        let qualifiedName = "\(packageName).\(className)"

        if !visitedClasses.contains(qualifiedName) {
            visitedClasses.insert(qualifiedName)
            let classInfo = processClassDeclaration(node)
            classes.append(classInfo)
        }

        return .visitChildren
    }

    override func visit(_ node: StructDeclSyntax) -> SyntaxVisitorContinueKind {
        let structName = node.name.text
        let qualifiedName = "\(packageName).\(structName)"

        if !visitedClasses.contains(qualifiedName) {
            visitedClasses.insert(qualifiedName)
            let structInfo = processStructDeclaration(node)
            classes.append(structInfo)
        }

        return .visitChildren
    }

    override func visit(_ node: EnumDeclSyntax) -> SyntaxVisitorContinueKind {
        let enumName = node.name.text
        let qualifiedName = "\(packageName).\(enumName)"

        if !visitedClasses.contains(qualifiedName) {
            visitedClasses.insert(qualifiedName)
            let enumInfo = processEnumDeclaration(node)
            classes.append(enumInfo)
        }

        return .visitChildren
    }

    override func visit(_ node: ProtocolDeclSyntax) -> SyntaxVisitorContinueKind {
        let protocolName = node.name.text
        let qualifiedName = "\(packageName).\(protocolName)"

        if !visitedClasses.contains(qualifiedName) {
            visitedClasses.insert(qualifiedName)
            let protocolInfo = processProtocolDeclaration(node)
            classes.append(protocolInfo)
        }

        return .visitChildren
    }

    override func visit(_ node: TypealiasDeclSyntax) -> SyntaxVisitorContinueKind {
        let typeAliasName = node.name.text
        let qualifiedName = "\(packageName).\(typeAliasName)"

        if !visitedTypeAliases.contains(qualifiedName) {
            visitedTypeAliases.insert(qualifiedName)
            let typeAliasInfo = processTypeAliasDeclaration(node)
            typeAliases.append(typeAliasInfo)
        }

        return .visitChildren
    }

    private func processClassDeclaration(_ node: ClassDeclSyntax) -> ClassInfo {
        let className = node.name.text
        let qualifiedName = "\(packageName).\(className)"
        let docString = extractDocumentation(for: node)

        var methods = [MethodInfo]()
        for member in node.memberBlock.members {
            if let funcDecl = member.decl.as(FunctionDeclSyntax.self) {
                methods.append(processFunction(funcDecl))
            }
        }

        var properties = [PropertyDefinition]()
        for member in node.memberBlock.members {
            if let varDecl = member.decl.as(VariableDeclSyntax.self) {
                properties.append(contentsOf: processVariable(varDecl))
            }
        }

        var typeParameters = [TypeParameterInfo]()
        if let genericParams = node.genericWhereClause {
            for param in genericParams.requirements {
                typeParameters.append(processGenericParameter(param))
            }
        }

        var implementedTypes = [TypeInfo]()
        if let inheritanceClause = node.inheritanceClause {
            for inheritedType in inheritanceClause.inheritedTypes {
                implementedTypes.append(processTypeReference(inheritedType.type))
            }
        }

        let modifiers = node.modifiers.map { $0.name.text }
        let isFinal = modifiers.contains("final")
        let isOpen = modifiers.contains("open")
        let visibility = mapVisibility(from: modifiers)

        var packageInfo = PackageInfo()
        packageInfo.name = packageName
        packageInfo.doc = packageDoc

        var classInfo = ClassInfo()
        classInfo.fullName = qualifiedName
        classInfo.name = className
        classInfo.methods = methods
        classInfo.genericMetadata = typeParameters.map { $0.name }.joined(separator: ", ")
        classInfo.serializableTypes = []
        classInfo.doc = docString
        classInfo.location = createSourceLocation(for: node, context)
        classInfo.packageInfo = packageInfo
        classInfo.typeAliases = []
        classInfo.annotations = extractAnnotations(from: node)
        classInfo.typeParameters = typeParameters
        classInfo.properties = properties
        classInfo.implementedTypes = implementedTypes
        if let superclass = implementedTypes.first {
            classInfo.superclass = superclass
        }
        classInfo.kind = .clazz
        classInfo.visibility = visibility
        classInfo.isFinal = isFinal
        classInfo.isAbstract = false
        classInfo.isOpen = isOpen
        classInfo.isSealed = false
        classInfo.constructors = extractInitializers(from: node)
        classInfo.nestedTypes = extractNestedTypes(from: node)

        return classInfo
    }

    private func processStructDeclaration(_ node: StructDeclSyntax) -> ClassInfo {
        let structName = node.name.text
        let qualifiedName = "\(packageName).\(structName)"
        let docString = extractDocumentation(for: node)

        var methods = [MethodInfo]()
        var properties = [PropertyDefinition]()
        var typeParameters = [TypeParameterInfo]()
        var implementedTypes = [TypeInfo]()

        for member in node.memberBlock.members {
            if let funcDecl = member.decl.as(FunctionDeclSyntax.self) {
                methods.append(processFunction(funcDecl))
            }
            if let varDecl = member.decl.as(VariableDeclSyntax.self) {
                properties.append(contentsOf: processVariable(varDecl))
            }
        }

        if let genericParams = node.genericWhereClause {
            typeParameters = genericParams.requirements.map { processGenericParameter($0) }
        }

        if let inheritanceClause = node.inheritanceClause {
            implementedTypes = inheritanceClause.inheritedTypes.map {
                processTypeReference($0.type)
            }
        }

        let modifiers = node.modifiers.map { $0.name.text }
        let visibility = mapVisibility(from: modifiers)

        var packageInfo = PackageInfo()
        packageInfo.name = packageName
        packageInfo.doc = packageDoc

        var classInfo = ClassInfo()
        classInfo.fullName = qualifiedName
        classInfo.name = structName
        classInfo.methods = methods
        classInfo.genericMetadata = typeParameters.map { $0.name }.joined(separator: ", ")
        classInfo.serializableTypes = []
        classInfo.doc = docString
        classInfo.location = createSourceLocation(for: node, context)
        classInfo.packageInfo = packageInfo
        classInfo.typeAliases = []
        classInfo.annotations = extractAnnotations(from: node)
        classInfo.typeParameters = typeParameters
        classInfo.properties = properties
        classInfo.implementedTypes = implementedTypes
        //classInfo.superclass = nil
        classInfo.kind = .structure
        classInfo.visibility = visibility
        classInfo.isFinal = modifiers.contains("final")
        classInfo.isAbstract = false
        classInfo.isOpen = false
        classInfo.isSealed = false
        classInfo.constructors = extractInitializers(from: node)
        classInfo.nestedTypes = extractNestedTypes(from: node)

        return classInfo
    }

    private func processEnumDeclaration(_ node: EnumDeclSyntax) -> ClassInfo {
        let enumName = node.name.text
        let qualifiedName = "\(packageName).\(enumName)"
        let docString = extractDocumentation(for: node)

        var methods = [MethodInfo]()
        var properties = [PropertyDefinition]()
        var typeParameters = [TypeParameterInfo]()
        var implementedTypes = [TypeInfo]()

        for member in node.memberBlock.members {
            if let funcDecl = member.decl.as(FunctionDeclSyntax.self) {
                methods.append(processFunction(funcDecl))
            }
            if let varDecl = member.decl.as(VariableDeclSyntax.self) {
                properties.append(contentsOf: processVariable(varDecl))
            }
            if let caseDecl = member.decl.as(EnumCaseDeclSyntax.self) {
                for element in caseDecl.elements {
                    let caseName = element.name.text
                    let caseType =
                        element.parameterClause != nil
                        ? processEnumCaseType(element.parameterClause!)
                        : nil

                    var propertyDef = PropertyDefinition()
                    propertyDef.name = caseName

                    var typeInfo = TypeInfo()
                    typeInfo.fullName = qualifiedName
                    typeInfo.name = enumName
                    typeInfo.isNullable = false

                    propertyDef.type = typeInfo
                    propertyDef.visibility = .public
                    propertyDef.isStatic = true
                    propertyDef.isConst = true
                    propertyDef.doc = extractDocumentation(for: caseDecl)

                    properties.append(propertyDef)
                }
            }
        }

        if let genericParams = node.genericWhereClause {
            typeParameters = genericParams.requirements.map { processGenericParameter($0) }
        }

        if let inheritanceClause = node.inheritanceClause {
            implementedTypes = inheritanceClause.inheritedTypes.map {
                processTypeReference($0.type)
            }
        }

        let modifiers = node.modifiers.map { $0.name.text }
        let visibility = mapVisibility(from: modifiers)

        var packageInfo = PackageInfo()
        packageInfo.name = packageName
        packageInfo.doc = packageDoc

        var classInfo = ClassInfo()
        classInfo.fullName = qualifiedName
        classInfo.name = enumName
        classInfo.methods = methods
        classInfo.genericMetadata = typeParameters.map { $0.name }.joined(separator: ", ")
        classInfo.doc = docString
        classInfo.location = createSourceLocation(for: node, context)
        classInfo.packageInfo = packageInfo
        classInfo.typeAliases = []
        classInfo.annotations = extractAnnotations(from: node)
        classInfo.typeParameters = typeParameters
        classInfo.properties = properties
        classInfo.implementedTypes = implementedTypes
        classInfo.kind = .enumeration
        classInfo.visibility = visibility
        classInfo.isFinal = true
        classInfo.nestedTypes = extractNestedTypes(from: node)

        return classInfo
    }

    private func processEnumCaseType(_ paramClause: EnumCaseParameterClauseSyntax) -> TypeInfo {
        //if paramClause.parameters.count == 1 {
        //return processTypeReference(paramClause.parameters.first?)
        // } else {
        var typeInfo = TypeInfo()
        typeInfo.fullName = "Swift.Tuple"
        typeInfo.name = "Tuple"
        typeInfo.isNullable = false
        typeInfo.typeArguments = paramClause.parameters.map { processTypeReference($0.type) }
        typeInfo.category = .tuple
        return typeInfo
        //}
    }

    private func processProtocolDeclaration(_ node: ProtocolDeclSyntax) -> ClassInfo {
        let protocolName = node.name.text
        let qualifiedName = "\(packageName).\(protocolName)"
        let docString = extractDocumentation(for: node)

        var methods = [MethodInfo]()
        var properties = [PropertyDefinition]()
        var typeParameters = [TypeParameterInfo]()
        var implementedTypes = [TypeInfo]()

        for member in node.memberBlock.members {
            if let funcDecl = member.decl.as(FunctionDeclSyntax.self) {
                methods.append(processFunction(funcDecl))
            }
            if let varDecl = member.decl.as(VariableDeclSyntax.self) {
                properties.append(contentsOf: processVariable(varDecl))
            }
        }

        if let genericParams = node.genericWhereClause {
            typeParameters = genericParams.requirements.map { processGenericParameter($0) }
        }

        if let inheritanceClause = node.inheritanceClause {
            implementedTypes = inheritanceClause.inheritedTypes.map {
                processTypeReference($0.type)
            }
        }

        let modifiers = node.modifiers.map { $0.name.text }
        let visibility = mapVisibility(from: modifiers)

        var packageInfo = PackageInfo()
        packageInfo.name = packageName
        packageInfo.doc = packageDoc

        var classInfo = ClassInfo()
        classInfo.fullName = qualifiedName
        classInfo.name = protocolName
        classInfo.methods = methods
        classInfo.genericMetadata = typeParameters.map { $0.name }.joined(separator: ", ")
        classInfo.doc = docString
        classInfo.location = createSourceLocation(for: node, context)
        classInfo.packageInfo = packageInfo
        classInfo.typeAliases = []
        classInfo.annotations = extractAnnotations(from: node)
        classInfo.typeParameters = typeParameters
        classInfo.properties = properties
        classInfo.implementedTypes = implementedTypes
        classInfo.kind = .interf
        classInfo.visibility = visibility
        classInfo.isAbstract = true
        classInfo.nestedTypes = extractNestedTypes(from: node)

        return classInfo
    }

    private func processTypeAliasDeclaration(_ node: TypealiasDeclSyntax) -> TypeAliasInfo {
        let name = node.name.text
        let qualifiedName = "\(packageName).\(name)"
        let docString = extractDocumentation(for: node)

        let underlyingType = processTypeReference(node.initializer.value)

        var typeParameters = [TypeParameterInfo]()
        if let genericParams = node.genericWhereClause {
            typeParameters = genericParams.requirements.map { processGenericParameter($0) }
        }

        var typeAliasInfo = TypeAliasInfo()
        typeAliasInfo.name = name
        typeAliasInfo.fullName = qualifiedName
        typeAliasInfo.underlyingType = underlyingType
        typeAliasInfo.doc = docString
        typeAliasInfo.location = createSourceLocation(for: node, context)
        typeAliasInfo.typeParameters = typeParameters
        typeAliasInfo.visibility = mapVisibility(from: node.modifiers.map { $0.name.text })

        return typeAliasInfo
    }

    private func processFunction(_ node: FunctionDeclSyntax) -> MethodInfo {
        let funcName = node.name.text
        let docString = extractDocumentation(for: node)

        var returnTypeInfo = TypeInfo()
        if let returnType = node.signature.returnClause?.type {
            returnTypeInfo = processTypeReference(returnType)
        } else {
            returnTypeInfo.fullName = "Swift.Void"
            returnTypeInfo.name = "Void"
            returnTypeInfo.isNullable = false
        }

        var parameters = [ParameterInfo]()
        for param in node.signature.parameterClause.parameters {
            parameters.append(processParameter(param))
        }

        var typeParameters = [TypeParameterInfo]()
        if let genericParams = node.genericWhereClause {
            for param in genericParams.requirements {
                typeParameters.append(processGenericParameter(param))
            }
        }

        let modifiers = node.modifiers.map { $0.name.text }
        let isStatic = modifiers.contains("static") || modifiers.contains("class")
        let visibility = mapVisibility(from: modifiers)

        var methodInfo = MethodInfo()
        methodInfo.name = funcName
        methodInfo.returnType = returnTypeInfo
        methodInfo.parameters = parameters
        //methodInfo.receiverType = nil
        methodInfo.visibility = visibility
        methodInfo.isExtension = false
        methodInfo.isInline = false
        methodInfo.isAsync = modifiers.contains("async")
        methodInfo.doc = docString
        methodInfo.location = createSourceLocation(for: node, context)
        methodInfo.isStatic = isStatic
        methodInfo.isAbstract = false
        methodInfo.isFinal = modifiers.contains("final")
        methodInfo.isOpen = modifiers.contains("open")
        methodInfo.isConstructor = false
        methodInfo.typeParameters = typeParameters
        methodInfo.throws =
            node.signature.effectSpecifiers?.throwsSpecifier != nil ? ["Swift.Error"] : []
        methodInfo.annotations = extractAnnotations(from: node)
        methodInfo.isOperator = false
        methodInfo.isInfix = false
        methodInfo.languageSpecificFlags = modifiers.joined(separator: ", ")

        return methodInfo
    }

    private func processParameter(_ node: FunctionParameterSyntax) -> ParameterInfo {
        let paramName = node.firstName.text
        let type = processTypeReference(node.type)
        let hasDefaultValue = node.defaultValue != nil

        var paramInfo = ParameterInfo()
        paramInfo.name = paramName
        paramInfo.type = type
        paramInfo.hasDefaultValue_p = hasDefaultValue
        //paramInfo.defaultValueLiteral = hasDefaultValue ? "_hasDefault_" : nil
        paramInfo.doc = ""
        paramInfo.location = createSourceLocation(for: node, context)
        paramInfo.isVararg = node.ellipsis != nil
        paramInfo.isCrossinline = false
        paramInfo.isNoinline = false
        paramInfo.annotations = [:]
        paramInfo.parameterModifiers = []

        return paramInfo
    }

    private func processVariable(_ node: VariableDeclSyntax) -> [PropertyDefinition] {
        var properties = [PropertyDefinition]()

        for binding in node.bindings {
            if let patternIdentifier = binding.pattern.as(IdentifierPatternSyntax.self) {
                let propertyName = patternIdentifier.identifier.text
                let docString = extractDocumentation(for: node)

                var typeInfo = TypeInfo()
                if let typeAnnotation = binding.typeAnnotation?.type {
                    typeInfo = processTypeReference(typeAnnotation)
                } else {
                    typeInfo.fullName = "Swift.Any"
                    typeInfo.name = "Any"
                    typeInfo.isNullable = false
                }

                let isMutable = node.bindingSpecifier.text == "var"

                var hasCustomGetter =
                    binding.accessorBlock?.accessors.as(AccessorDeclListSyntax.self)?.contains {
                        accessor in
                        accessor.accessorSpecifier.text == "get"
                    } ?? false
                var hasCustomSetter =
                    binding.accessorBlock?.accessors.as(AccessorDeclListSyntax.self)?.contains {
                        accessor in
                        accessor.accessorSpecifier.text == "set"
                    } ?? false
                if binding.accessorBlock?.accessors.is(CodeBlockItemListSyntax.self) == true {
                    hasCustomGetter = true
                    hasCustomSetter = false
                }
                let modifiers = node.modifiers.map { $0.name.text }
                let isStatic = modifiers.contains("static") || modifiers.contains("class")
                let visibility = mapVisibility(from: modifiers)

                var propertyDef = PropertyDefinition()
                propertyDef.name = propertyName
                propertyDef.type = typeInfo
                propertyDef.location = createSourceLocation(for: node, context)
                propertyDef.isMutable = isMutable
                //propertyDef.initialValueLiteral = binding.initializer?.value.description
                propertyDef.hasCustomGetter_p = hasCustomGetter
                propertyDef.hasCustomSetter_p = hasCustomSetter
                propertyDef.visibility = visibility
                propertyDef.setterVisibility = hasCustomSetter ? visibility : .private
                propertyDef.doc = docString
                propertyDef.isLateInit = false
                propertyDef.isConst = modifiers.contains("let")
                propertyDef.isStatic = isStatic
                propertyDef.isLazy = modifiers.contains("lazy")
                propertyDef.annotations = extractAnnotations(from: node)
                propertyDef.isComputed = binding.accessorBlock != nil
                propertyDef.isAbstract = false
                propertyDef.isOpen = modifiers.contains("open")
                propertyDef.isFinal = modifiers.contains("final")

                properties.append(propertyDef)
            }
        }

        return properties
    }
    private func extractAnnotations(from node: some SyntaxProtocol) -> [String: String] {
        // return node.attributes?.compactMap { attr in
        //     attr.as(AttributeSyntax.self)?.attributeName.description
        // } ?? []
        return Dictionary()
    }
    private func processGenericParameter(_ node: GenericRequirementSyntax) -> TypeParameterInfo {
        // Extract the type parameter name from the left side of the requirement
        var name = ""
        var upperBound: TypeInfo? = nil
        var constraints = [TypeInfo]()

        // Handle different types of requirements
        switch node.requirement {
        case .conformanceRequirement(let conformance):
            // Extract name from left type
            if let idType = conformance.leftTypeIdentifier.as(IdentifierTypeSyntax.self) {
                name = idType.name.text
            }

            // Process the conformance type as an upper bound
            upperBound = processTypeReference(conformance.rightType)
            constraints.append(upperBound!)

        case .sameTypeRequirement(let sameType):
            // Extract name from left type
            if let idType = sameType.leftTypeIdentifier.as(IdentifierTypeSyntax.self) {
                name = idType.name.text
            }

            // Process the same-type as a constraint
            if let ty = sameType.rightType.as(TypeSyntax.self) {
                let typeInfo = processTypeReference(ty)
                constraints.append(typeInfo)
            }

        case .layoutRequirement(let layout):
            // Extract name from type identifier
            if let idType = layout.typeIdentifier.as(IdentifierTypeSyntax.self) {
                name = idType.name.text
            }

        // No type constraints for layout requirements, just note it in comments
        // Could add specific handling for _AnyObject, _RefCountedObject, etc.
        }

        var typeParamInfo = TypeParameterInfo()
        typeParamInfo.name = name
        //typeParamInfo.upperBound = upperBound
        //typeParamInfo.lowerBound = nil
        typeParamInfo.typeConstraints = constraints
        typeParamInfo.isReified = false
        typeParamInfo.isVariant = false
        typeParamInfo.variance = .invariant
        typeParamInfo.doc = ""
        typeParamInfo.location = createSourceLocation(for: node, context)

        return typeParamInfo
    }
    private func processTypeReference(_ node: TypeSyntax) -> TypeInfo {
        if let optionalType = node.as(OptionalTypeSyntax.self) {
            var typeInfo = processTypeReference(optionalType.wrappedType)
            typeInfo.isNullable = true
            return typeInfo
        }

        if let arrayType = node.as(ArrayTypeSyntax.self) {
            var typeInfo = TypeInfo()
            typeInfo.fullName = "Swift.Array"
            typeInfo.name = "Array"
            typeInfo.isNullable = false
            typeInfo.typeArguments = [processTypeReference(arrayType.elementType)]
            typeInfo.isArray = true
            typeInfo.isCollection = true
            typeInfo.category = .class
            return typeInfo
        }

        if let dictType = node.as(DictionaryTypeSyntax.self) {
            let keyTypeInfo = processTypeReference(dictType.keyType)
            let valueTypeInfo = processTypeReference(dictType.valueType)

            var typeInfo = TypeInfo()
            typeInfo.fullName = "Swift.Dictionary"
            typeInfo.name = "Dictionary"
            typeInfo.isNullable = false
            typeInfo.typeArguments = [keyTypeInfo, valueTypeInfo]
            typeInfo.isMap = true
            typeInfo.isCollection = true
            typeInfo.category = .class
            return typeInfo
        }

        if let identifierType = node.as(IdentifierTypeSyntax.self) {
            let typeName = identifierType.name.text
            var typeArguments = [TypeInfo]()

            if let genericArgs = identifierType.genericArgumentClause {
                typeArguments = genericArgs.arguments.map { processGenericArgument($0) }
            }

            let fullName: String
            if [
                "Int", "String", "Bool", "Double", "Float", "Character", "Any", "AnyObject", "Void",
            ].contains(typeName) {
                fullName = "Swift.\(typeName)"
            } else {
                fullName = "\(packageName).\(typeName)"
            }

            let isCollection = ["Array", "Set", "Dictionary"].contains(typeName)

            var typeInfo = TypeInfo()
            typeInfo.fullName = fullName
            typeInfo.name = typeName
            typeInfo.isNullable = false
            typeInfo.typeArguments = typeArguments
            typeInfo.isCollection = isCollection
            typeInfo.isMap = typeName == "Dictionary"
            typeInfo.isArray = typeName == "Array"
            typeInfo.category = determineTypeCategory(typeName)
            return typeInfo
        }

        if let metatypeType = node.as(MetatypeTypeSyntax.self) {
            let baseType = processTypeReference(metatypeType.baseType)

            var typeInfo = TypeInfo()
            typeInfo.fullName = "Swift.Type"
            typeInfo.name = "Type"
            typeInfo.isNullable = false
            typeInfo.typeArguments = [baseType]
            typeInfo.category = baseType.category
            return typeInfo
        }

        if let functionType = node.as(FunctionTypeSyntax.self) {
            let returnType = processTypeReference(functionType.returnClause.type)
            let parameterTypes = functionType.parameters.map { processTypeReference($0.type) }

            var typeInfo = TypeInfo()
            typeInfo.fullName = "Swift.Function"
            typeInfo.name = "Function"
            typeInfo.isNullable = false
            typeInfo.typeArguments = parameterTypes + [returnType]
            typeInfo.category = .function
            return typeInfo
        }

        if let tupleType = node.as(TupleTypeSyntax.self) {
            let elementTypes = tupleType.elements.map { processTypeReference($0.type) }

            var typeInfo = TypeInfo()
            typeInfo.fullName = "Swift.Tuple"
            typeInfo.name = "Tuple"
            typeInfo.isNullable = false
            typeInfo.typeArguments = elementTypes
            typeInfo.category = .tuple
            return typeInfo
        }

        let typeName = node.description.trimmingCharacters(in: .whitespacesAndNewlines)

        var typeInfo = TypeInfo()
        typeInfo.fullName = "Swift.\(typeName)"
        typeInfo.name = typeName
        typeInfo.isNullable = false
        typeInfo.category = .unknown
        return typeInfo
    }
    private func processGenericArgument(_ node: GenericArgumentSyntax) -> TypeInfo {
        if node.argument.is(TypeSyntax.self) {
            // Process type arguments normally
            return processTypeReference(node.argument.as(TypeSyntax.self).unsafelyUnwrapped)
        } else {
            return processTypeReference(node.argument.as(TypeSyntax.self).unsafelyUnwrapped)
        }
    }
    private func determineTypeCategory(_ typeName: String) -> TypeCategory {
        switch typeName {
        case "Int", "Int8", "Int16", "Int32", "Int64",
            "UInt", "UInt8", "UInt16", "UInt32", "UInt64",
            "Float", "Double", "Bool":
            return .primitive
        case "String", "Character":
            return .primitive
        case "Array", "Set", "Dictionary":
            return .class
        case "Any", "AnyObject":
            return .unknown
        default:
            return .unknown
        }
    }

    private func extractDocumentation(for node: some SyntaxProtocol) -> String {
        return node.leadingTrivia.compactMap { piece in
            switch piece {
            case .docLineComment(let comment):
                return comment.replacingOccurrences(of: "///", with: "").trimmingCharacters(
                    in: .whitespacesAndNewlines)
            case .docBlockComment(let comment):
                return comment.replacingOccurrences(of: "/**", with: "")
                    .replacingOccurrences(of: "*/", with: "")
                    .trimmingCharacters(in: .whitespacesAndNewlines)
            default:
                return nil
            }
        }.joined(separator: "\n")
    }

    private func createSourceLocation(
        for node: some SyntaxProtocol,
        _ context: some MacroExpansionContext
    ) -> SourceLocation {
        var location = SourceLocation()

        if let sourceLocation = context.location(
            of: node, at: .beforeLeadingTrivia, filePathMode: .filePath)
        {
            location.filePath = "\(sourceLocation.file)"
            location.startLine = Int32(String(describing: sourceLocation.line)) ?? 0
            location.startColumn = Int32(String(describing: sourceLocation.column)) ?? 0

            if let endLocation = context.location(
                of: node, at: .afterTrailingTrivia, filePathMode: .filePath)
            {
                location.endLine = Int32(String(describing: endLocation.line)) ?? 0
                location.endColumn = Int32(String(describing: endLocation.column)) ?? 0
            } else {
                location.endLine = location.startLine
                location.endColumn = location.startColumn
            }
        }

        return location
    }

    // Additional methods needed to make the class work

    private func mapVisibility(from modifiers: [String]) -> Visibility {
        if modifiers.contains("public") || modifiers.contains("open") {
            return .public
        } else if modifiers.contains("internal") {
            return .internal
        } else if modifiers.contains("fileprivate") {
            return .filePrivate
        } else if modifiers.contains("private") {
            return .private
        }
        return .internal  // Default visibility in Swift
    }
    // Extract initializers from a type declaration
    private func extractInitializers<T: DeclGroupSyntax>(from node: T) -> [ConstructorInfo] {
        var constructors = [ConstructorInfo]()

        for member in node.memberBlock.members {
            if let initDecl = member.decl.as(InitializerDeclSyntax.self) {
                let docString = extractDocumentation(for: initDecl)

                // Process parameters
                var parameters = [ParameterInfo]()
                for param in initDecl.signature.parameterClause.parameters {
                    parameters.append(processParameter(param))
                }

                // Extract modifiers
                let modifiers = initDecl.modifiers.map { $0.name.text }
                let visibility = mapVisibility(from: modifiers)

                var constructor = ConstructorInfo()
                constructor.parameters = parameters
                constructor.visibility = visibility
                constructor.isPrimary = false  // Swift doesn't have primary constructors
                constructor.doc = docString
                constructor.location = createSourceLocation(for: initDecl, context)
                //constructor.isFailable = initDecl.optionalMark != nil
                //constructor.throws = initDecl.signature.effectSpecifiers?.throwsSpecifier != nil

                constructors.append(constructor)
            }
        }

        return constructors
    }

    // Extract nested types from a declaration
    private func extractNestedTypes<T: DeclGroupSyntax>(from node: T) -> [TypeInfo] {
        var nestedTypes = [TypeInfo]()

        for member in node.memberBlock.members {
            if let classDecl = member.decl.as(ClassDeclSyntax.self) {
                let className = classDecl.name.text
                var typeInfo = TypeInfo()
                typeInfo.fullName = "\(packageName).\(className)"
                typeInfo.name = className
                typeInfo.isNullable = false
                typeInfo.category = .class
                nestedTypes.append(typeInfo)
            } else if let structDecl = member.decl.as(StructDeclSyntax.self) {
                let structName = structDecl.name.text
                var typeInfo = TypeInfo()
                typeInfo.fullName = "\(packageName).\(structName)"
                typeInfo.name = structName
                typeInfo.isNullable = false
                typeInfo.category = .struct
                nestedTypes.append(typeInfo)
            } else if let enumDecl = member.decl.as(EnumDeclSyntax.self) {
                let enumName = enumDecl.name.text
                var typeInfo = TypeInfo()
                typeInfo.fullName = "\(packageName).\(enumName)"
                typeInfo.name = enumName
                typeInfo.isNullable = false
                typeInfo.category = .enum
                nestedTypes.append(typeInfo)
            }
        }

        return nestedTypes
    }

    // Generate the final TypeInfoFile
    func generateTypeInfoFile() -> TypeInfoFile {
        var typeInfoFile = TypeInfoFile()
        typeInfoFile.classes = classes
        typeInfoFile.typeAliases = typeAliases
        //typeInfoFile.packageName = packageName
        typeInfoFile.imports = imports
        //typeInfoFile.annotations = [:]
        //typeInfoFile.sourceFilePath = context.source?.description ?? ""

        return typeInfoFile
    }
}
