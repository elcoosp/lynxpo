// import Foundation
// import MetaCodable

// @Codable
// public struct SourceLocation {
//     let filePath: String
//     let startLine: Int
//     let startColumn: Int
//     let endLine: Int
//     let endColumn: Int
// }

// @Codable
// public struct TypeInfo {
//     let fullName: String
//     let name: String
//     let isNullable: Bool
//     let typeArguments: [TypeInfo]
//     let customReturnHint: String?
//     let doc: String
//     let location: SourceLocation
// }

// @Codable
// public struct ParameterInfo {
//     let name: String
//     let type: TypeInfo
//     let hasDefaultValue: Bool
//     let doc: String
//     let location: SourceLocation
// }

// @Codable
// public struct MethodInfo {
//     let name: String
//     let returnType: TypeInfo
//     let parameters: [ParameterInfo]
//     let receiverType: TypeInfo?
//     let visibility: Visibility
//     let isExtension: Bool
//     let isInline: Bool
//     let isAsync: Bool
//     let doc: String
//     let location: SourceLocation

//     //@Codable
//     public enum Visibility: String, Codable {
//         //case pub, intern, protected, priv
//         case pub = "PUBLIC"
//         case intern = "INTERNAL"
//         case protected = "PROTECTED"
//         case priv = "PRIVATE"
//     }
// }

// @Codable
// public struct SerializableTypeInfo {
//     let fullName: String
//     let name: String
//     let kind: Kind
//     let propertyDefinitions: [PropertyDefinition]
//     let enumValues: [EnumValue]
//     let doc: String
//     let location: SourceLocation

//     @Codable
//     public struct PropertyDefinition {
//         let name: String
//         let type: TypeInfo
//         let location: SourceLocation
//     }

//     @Codable
//     public struct EnumValue {
//         let name: String
//         let propertyValues: [String]
//         let doc: String
//         let location: SourceLocation
//     }

//     //@Codable
//     public enum Kind: String, Codable {
//         // case clazz, interf, enumeration, obj, structure
//         case clazz = "CLASS"
//         case interf = "INTERFACE"
//         case enumeration = "ENUM"
//         case obj = "OBJECT"
//         case structure = "STRUCT"
//     }
// }

// @Codable
// public struct ClassInfo {
//     let fullName: String
//     let name: String
//     let methods: [MethodInfo]
//     let genericMetadata: String
//     let serializableTypes: [SerializableTypeInfo]
//     let doc: String
//     let location: SourceLocation
// }
