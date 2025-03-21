import Foundation
import SwiftCompilerPlugin
import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros

// public struct TypedMacro: PeerMacro {
//     public static func expansion(
//         of node: AttributeSyntax,
//         providingPeersOf declaration: some DeclSyntaxProtocol,
//         in context: some MacroExpansionContext
//     ) throws -> [DeclSyntax] {
//         guard let classDecl = declaration.as(ClassDeclSyntax.self) else {
//             throw MacroError("@Typed can only be applied to classes")
//         }

//         // Process the class and generate metadata
//         let processor = SwiftTypeProcessor(classDecl: classDecl)
//         return [try processor.generateMetadata()]
//     }
// }

public struct LynxMethodMacro: PeerMacro {
    public static func expansion(
        of node: AttributeSyntax,
        providingPeersOf declaration: some DeclSyntaxProtocol,
        in context: some MacroExpansionContext
    ) throws -> [DeclSyntax] {
        // This macro doesn't generate anything directly, it just marks methods for processing
        return []
    }
}

// public struct TsRetIntoMacro: PeerMacro {
//     public static func expansion(
//         of node: AttributeSyntax,
//         providingPeersOf declaration: some DeclSyntaxProtocol,
//         in context: some MacroExpansionContext
//     ) throws -> [DeclSyntax] {
//         // This macro doesn't generate anything directly, it just provides type conversion info
//         return []
//     }
// }

// enum MacroError: Error, CustomStringConvertible {
//     case message(String)

//     init(_ message: String) {
//         self = .message(message)
//     }

//     var description: String {
//         switch self {
//         case .message(let text):
//             return text
//         }
//     }
// }

// struct SwiftTypeProcessor {
//     let classDecl: ClassDeclSyntax
//     private let processedSerializableTypes = Set<String>()
//     func generateMetadata() throws -> DeclSyntax {
//         let className = classDecl.name.text
//         let serializableTypes = collectSerializableTypes()
//         let methods = collectMethods()

//         let classInfo = createClassInfo(
//             className: className, methods: methods, serializableTypes: serializableTypes)
//         let jsonData = try JSONEncoder().encode(classInfo)

//         let jsonString =
//             String(data: jsonData, encoding: .utf8)?.replacingOccurrences(of: "\"", with: "\\\"")
//             ?? "{}"

//         // Generate the static property as a member of the class
//         return """
//             class TypeInfo {
//                 static let typeInfo = \"\"\"
//                 \(raw: jsonString)
//                 \"\"\"
//             }
//             """
//     }
//     func collectSerializableTypes() -> [SerializableTypeInfo] {
//         var result: [SerializableTypeInfo] = []

//         // Find all nested types that conform to Codable protocol
//         for member in classDecl.memberBlock.members {
//             if let structDecl = member.decl.as(StructDeclSyntax.self) {
//                 if conformsToCodable(structDecl) {
//                     result.append(processSerializableType(structDecl))
//                 }
//             } else if let enumDecl = member.decl.as(EnumDeclSyntax.self) {
//                 if conformsToCodable(enumDecl) {
//                     result.append(processEnumType(enumDecl))
//                 }
//             }
//         }

//         return result
//     }  // Helper function to check if a type conforms to Codable
//     func conformsToCodable(_ typeDecl: DeclGroupSyntax) -> Bool {
//         // Check inheritance clause for explicit Codable conformance
//         if let inheritanceClause = typeDecl.inheritanceClause {
//             for inheritedType in inheritanceClause.inheritedTypes {
//                 if let type = inheritedType.type.as(IdentifierTypeSyntax.self),
//                     type.name.text == "Codable"
//                 {
//                     return true
//                 }
//             }
//         }

//         return false
//     }

//     func hasCodableAttribute(_ attributes: AttributeListSyntax?) -> Bool {
//         guard let attributes = attributes else { return false }

//         for attribute in attributes {
//             if let attrName = attribute.as(AttributeSyntax.self)?.attributeName.as(
//                 IdentifierTypeSyntax.self)?.name.text,
//                 attrName == "Codable"
//             {
//                 return true
//             }
//         }
//         return false
//     }

//     func processSerializableType(_ structDecl: StructDeclSyntax) -> SerializableTypeInfo {
//         let name = structDecl.name.text
//         var propertyDefinitions: [SerializableTypeInfo.PropertyDefinition] = []

//         // Process properties
//         for member in structDecl.memberBlock.members {
//             if let varDecl = member.decl.as(VariableDeclSyntax.self) {
//                 for binding in varDecl.bindings {
//                     if let identifier = binding.pattern.as(IdentifierPatternSyntax.self)?.identifier
//                         .text,
//                         let typeAnnotation = binding.typeAnnotation
//                     {
//                         let typeInfo = processTypeAnnotation(typeAnnotation.type)
//                         let location = extractLocation(node: binding)

//                         propertyDefinitions.append(
//                             SerializableTypeInfo.PropertyDefinition(
//                                 name: identifier,
//                                 type: typeInfo,
//                                 location: location
//                             )
//                         )
//                     }
//                 }
//             }
//         }

//         return SerializableTypeInfo(
//             fullName: name,  // In a real implementation, this would include the module name
//             name: name,
//             kind: .structure,
//             propertyDefinitions: propertyDefinitions,
//             enumValues: [],
//             doc: extractDocumentation(structDecl),
//             location: extractLocation(node: structDecl)
//         )
//     }

//     func processEnumType(_ enumDecl: EnumDeclSyntax) -> SerializableTypeInfo {
//         let name = enumDecl.name.text
//         var enumValues: [SerializableTypeInfo.EnumValue] = []

//         // Process enum cases
//         for member in enumDecl.memberBlock.members {
//             if let caseDecl = member.decl.as(EnumCaseDeclSyntax.self) {
//                 for element in caseDecl.elements {
//                     let caseName = element.name.text
//                     let location = extractLocation(node: element)

//                     // For simple enums, we don't have property values
//                     enumValues.append(
//                         SerializableTypeInfo.EnumValue(
//                             name: caseName,
//                             propertyValues: [],
//                             doc: extractDocumentation(element),
//                             location: location
//                         )
//                     )
//                 }
//             }
//         }

//         return SerializableTypeInfo(
//             fullName: name,  // In a real implementation, this would include the module name
//             name: name,
//             kind: .enumeration,
//             propertyDefinitions: [],
//             enumValues: enumValues,
//             doc: extractDocumentation(enumDecl),
//             location: extractLocation(node: enumDecl)
//         )
//     }

//     func collectMethods() -> [MethodInfo] {
//         var result: [MethodInfo] = []

//         // Find all methods with @LynxMethod annotation
//         for member in classDecl.memberBlock.members {
//             if let funcDecl = member.decl.as(FunctionDeclSyntax.self) {
//                 if hasLynxMethodAttribute(funcDecl.attributes) {
//                     result.append(processMethod(funcDecl))
//                 }
//             }
//         }

//         return result
//     }

//     func hasLynxMethodAttribute(_ attributes: AttributeListSyntax?) -> Bool {
//         guard let attributes = attributes else { return false }

//         for attribute in attributes {
//             if let attrName = attribute.as(AttributeSyntax.self)?.attributeName.as(
//                 IdentifierTypeSyntax.self)?.name.text,
//                 attrName == "LynxMethod"
//             {
//                 return true
//             }
//         }
//         return false
//     }

//     func extractCustomReturnTypeHint(_ attributes: AttributeListSyntax?) -> String? {
//         guard let attributes = attributes else { return nil }

//         for attribute in attributes {
//             if let attrSyntax = attribute.as(AttributeSyntax.self),
//                 let attrName = attrSyntax.attributeName.as(IdentifierTypeSyntax.self)?.name.text,
//                 attrName == "TsRetInto",
//                 let args = attrSyntax.arguments?.as(LabeledExprListSyntax.self),
//                 let firstArg = args.first?.expression.as(StringLiteralExprSyntax.self)
//             {

//                 return firstArg.segments.description
//                     .replacingOccurrences(of: "\"", with: "")
//                     .trimmingCharacters(in: .whitespacesAndNewlines)
//             }
//         }
//         return nil
//     }

//     func processMethod(_ funcDecl: FunctionDeclSyntax) -> MethodInfo {
//         let name = funcDecl.name.text
//         let returnTypeInfo = processReturnType(funcDecl)
//         let parameters = processParameters(funcDecl)
//         let visibility = determineVisibility(funcDecl.modifiers)
//         let customReturnHint = extractCustomReturnTypeHint(funcDecl.attributes)

//         var finalReturnType = returnTypeInfo
//         if let customReturnHint = customReturnHint {
//             finalReturnType = TypeInfo(
//                 fullName: returnTypeInfo.fullName,
//                 name: returnTypeInfo.name,
//                 isNullable: returnTypeInfo.isNullable,
//                 typeArguments: returnTypeInfo.typeArguments,
//                 customReturnHint: customReturnHint,
//                 doc: returnTypeInfo.doc,
//                 location: returnTypeInfo.location
//             )
//         }

//         return MethodInfo(
//             name: name,
//             returnType: finalReturnType,
//             parameters: parameters,
//             receiverType: nil,  // No direct equivalent in Swift, but could be computed for extension methods
//             visibility: visibility,
//             isExtension: false,  // Would need to check if this is in an extension
//             isInline: false,  // Swift doesn't have direct inline equivalent
//             isAsync: funcDecl.signature.effectSpecifiers?.asyncSpecifier != nil,
//             doc: extractDocumentation(funcDecl),
//             location: extractLocation(node: funcDecl)
//         )
//     }

//     func processReturnType(_ funcDecl: FunctionDeclSyntax) -> TypeInfo {
//         if let returnType = funcDecl.signature.returnClause?.type {
//             return processTypeAnnotation(returnType)
//         }

//         // Default to Void if no return type is specified
//         return TypeInfo(
//             fullName: "Void",
//             name: "Void",
//             isNullable: false,
//             typeArguments: [],
//             customReturnHint: nil,
//             doc: "",
//             location: SourceLocation(
//                 filePath: "", startLine: 0, startColumn: 0, endLine: 0, endColumn: 0)
//         )
//     }

//     func processParameters(_ funcDecl: FunctionDeclSyntax) -> [ParameterInfo] {
//         var parameters: [ParameterInfo] = []

//         for parameter in funcDecl.signature.parameterClause.parameters {
//             let name = parameter.firstName.text
//             let typeInfo = processTypeAnnotation(parameter.type)
//             let hasDefaultValue = parameter.defaultValue != nil

//             parameters.append(
//                 ParameterInfo(
//                     name: name,
//                     type: typeInfo,
//                     hasDefaultValue: hasDefaultValue,
//                     doc: extractDocumentation(parameter),
//                     location: extractLocation(node: parameter)
//                 )
//             )
//         }

//         return parameters
//     }

//     func processTypeAnnotation(_ type: TypeSyntax) -> TypeInfo {
//         if let identifierType = type.as(IdentifierTypeSyntax.self) {
//             return TypeInfo(
//                 fullName: identifierType.name.text,
//                 name: identifierType.name.text,
//                 isNullable: false,
//                 typeArguments: [],
//                 customReturnHint: nil,
//                 doc: "",
//                 location: extractLocation(node: type)
//             )
//         } else if let optionalType = type.as(OptionalTypeSyntax.self) {
//             let baseType = processTypeAnnotation(optionalType.wrappedType)
//             return TypeInfo(
//                 fullName: baseType.fullName,
//                 name: baseType.name,
//                 isNullable: true,
//                 typeArguments: baseType.typeArguments,
//                 customReturnHint: baseType.customReturnHint,
//                 doc: baseType.doc,
//                 location: baseType.location
//             )
//         } else {
//             fatalError("Unsupported type syntax: \(type.description)")
//         }
//     }
//     func determineVisibility(_ modifiers: DeclModifierListSyntax?) -> Visibility {
//         guard let modifiers = modifiers else { return .pub }

//         for modifier in modifiers {
//             switch modifier.name.text {
//             case "private":
//                 return .priv
//             case "fileprivate":
//                 return .intern  // closest equivalent
//             case "internal":
//                 return .intern
//             case "public":
//                 return .pub
//             default:
//                 continue
//             }
//         }

//         // Default to internal in Swift
//         return .intern
//     }

//     func extractDocumentation(_ node: any SyntaxProtocol) -> String {
//         // In a real implementation, this would extract doc comments
//         // For now, return empty string
//         return ""
//     }

//     func extractLocation(node: any SyntaxProtocol) -> SourceLocation {
//         return SourceLocation(
//             filePath: "",  // Would need file information from context
//             startLine: 0,
//             startColumn: 0,
//             endLine: 0,
//             endColumn: node.description.count
//         )
//     }

//     func createClassInfo(
//         className: String, methods: [MethodInfo], serializableTypes: [SerializableTypeInfo]
//     ) -> ClassInfo {
//         return ClassInfo(
//             fullName: className,  // In a real implementation, this would include the module name
//             name: className,
//             methods: methods,
//             genericMetadata: "",
//             serializableTypes: serializableTypes,
//             doc: extractDocumentation(classDecl),
//             location: extractLocation(node: classDecl)
//         )
//     }
// }
@main
struct NMBSwiftInspectMacros: CompilerPlugin {
    var providingMacros: [Macro.Type] = [
        TypeInfoMacro.self,
        LynxMethodMacro.self,
        // TsRetIntoMacro.self,
    ]
}
