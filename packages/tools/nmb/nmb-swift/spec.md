## 1. Data Model (1:1 with Kotlin)

```swift

import Foundation

@Codable
public struct SourceLocation {
    let filePath: String
    let startLine: Int
    let startColumn: Int
    let endLine: Int
    let endColumn: Int
}

@Codable
public struct TypeInfo {
    let fullName: String
    let name: String
    let isNullable: Bool
    let typeArguments: [TypeInfo]
    let customReturnHint: String?
    let doc: String
    let location: SourceLocation
}

@Codable
public struct ParameterInfo {
    let name: String
    let type: TypeInfo
    let hasDefaultValue: Bool
    let doc: String
    let location: SourceLocation
}

@Codable
public struct MethodInfo {
    let name: String
    let returnType: TypeInfo
    let parameters: [ParameterInfo]
    let receiverType: TypeInfo?
    let visibility: Visibility
    let isExtension: Bool
    let isInline: Bool
    let isAsync: Bool
    let doc: String
    let location: SourceLocation

    @Codable
    public enum Visibility: String {
        case public, intern, PROTECTED, priv
    }
}

@Codable
public struct SerializableTypeInfo {
    let fullName: String
    let name: String
    let kind: Kind
    let propertyDefinitions: [PropertyDefinition]
    let enumValues: [EnumValue]
    let doc: String
    let location: SourceLocation

    @Codable
    public struct PropertyDefinition {
        let name: String
        let type: TypeInfo
        let location: SourceLocation
    }

    @Codable
    public struct EnumValue {
        let name: String
        let propertyValues: [String]
        let doc: String
        let location: SourceLocation
    }

    @Codable
    public enum Kind: String {
        case CLASS, INTERFACE, ENUM, OBJECT, struct
    }
}

@Codable
public struct ClassInfo {
    let fullName: String
    let name: String
    let methods: [MethodInfo]
    let genericMetadata: String
    let serializableTypes: [SerializableTypeInfo]
    let doc: String
    let location: SourceLocation
}
```
---

## 2. Macro Annotations (Kotlin Equivalent)

```swift

@attached(peer, names: arbitrary) // Generates metadata structure
public macro Typed(_ value: String = "") = #externalMacro(
    module: "NMBInspectMacros",
    type: "NMBTypedMacro"
)

@attached(peer) // Marks methods for inclusion
public macro LynxMethod() = #externalMacro(
    module: "NMBInspectMacros",
    type: "NMBLynxMethodMacro"
)

@attached(peer) // Return type override
public macro TsRetInto(_ value: String) = #externalMacro(
    module: "NMBInspectMacros",
    type: "NMBTsRetIntoMacro"
)
```
---

## 3. Macro Implementation Requirements

### 3.1 Type Resolution

```swift

private extension TypeSyntax {
    func resolveTypeInfo(
        context: MacroExpansionContext,
        resolver: TypeResolver
    ) -> TypeInfo {
        let typeName = self.as(SimpleTypeIdentifierSyntax.self)?.name.text ?? "Unknown"
        let isNullable = self.is(OptionalTypeSyntax.self) != nil

        return TypeInfo(
            fullName: resolver.fullyQualifiedName(for: self),
            name: typeName,
            isNullable: isNullable,
            typeArguments: self.genericArguments.map {
                $0.resolveTypeInfo(context: context, resolver: resolver)
            },
            customReturnHint: nil,
            doc: self.documentation,
            location: context.location(of: self)
        )
    }
}
```

### 3.2 Source Location Handling

```swift

extension MacroExpansionContext {
    func location(of node: some SyntaxProtocol) -> SourceLocation {
        guard let source = node.startLocation(converter: SourceLocationConverter(file: "", tree: node.root)) else {
            return SourceLocation(filePath: "", startLine: 0, startColumn: 0, endLine: 0, endColumn: 0)
        }

        return SourceLocation(
            filePath: source.file,
            startLine: source.line,
            startColumn: source.column,
            endLine: source.endLine,
            endColumn: source.endColumn
        )
    }
}
```

---

## 4. Metadata Generation Workflow

### 4.1 Class Processing

```swift

struct ClassProcessor {
    let declaration: ClassDeclSyntax
    let context: MacroExpansionContext
    let resolver: TypeResolver

    func process() -> ClassInfo {
        ClassInfo(
            fullName: fullyQualifiedName,
            name: declaration.name.text,
            methods: declaration.memberBlock.members
                .compactMap { $0.decl.as(FunctionDeclSyntax.self) }
                .filter { $0.hasMacro("LynxMethod") }
                .map { MethodProcessor($0, context: context, resolver: resolver).process() },
            genericMetadata: declaration.genericParameters?.description ?? "",
            serializableTypes: collectSerializableTypes(),
            doc: declaration.documentation,
            location: context.location(of: declaration)
        )
    }

    private func collectSerializableTypes() -> [SerializableTypeInfo] {
        // Implementation matching Kotlin's collectSerializableTypes
    }
}
```

---

## 5. JSON Output Guarantees

Must produce identical JSON structure to Kotlin version:

```json
{
  "fullName": "lynxpo.ktts.model.ClassInfo",
  "name": "ClassInfo",
  "methods": [
    {
      "name": "process",
      "returnType": {
        "fullName": "lynxpo.ktts.model.ClassInfo",
        "name": "ClassInfo",
        "isNullable": false,
        "typeArguments": [],
        "customReturnHint": null,
        "doc": "Main processing method",
        "location": {...}
      },
      "parameters": [...],
      "visibility": "public",
      ...
    }
  ],
  "serializableTypes": [...]
}
```

---

## 6. Testing Requirements

### 6.1 Macro Expansion Test

```swift

import SwiftSyntaxMacroTest
import XCTest

final class NMBInspectTests: XCTestCase {
    func testClassInfoGeneration() {
        assertMacro(["NMBInspect"], record: true) {
            """
            @Typed class NetworkService {
                @LynxMethod
                @TsRetInto("FutureResult")
                func fetchData() async -> DataResult { ... }
            }
            """
        } matches: {
            """
            class NetworkService {
                func fetchData() async -> DataResult { ... }

                struct __NMB_NetworkService_Metadata {
                    static let info = ClassInfo(
                        fullName: "NetworkService",
                        name: "NetworkService",
                        methods: [...],
                        serializableTypes: [...]
                    )
                }
            }
            """
        }
    }
}
```
### 6.2 JSON Serialization Test

```swift

func testJSONOutput() throws {
    let classInfo = ClassInfo(...)
    let json = try JSONEncoder().encode(classInfo)
    let kotlinEquivalent = """
    {"fullName":"...","methods":[...]}
    """

    XCTAssertEqual(
        String(data: json, encoding: .utf8),
        kotlinEquivalent,
        "Swift JSON output must match Kotlin's structure exactly"
    )
}
```
