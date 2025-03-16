import Foundation
import NMBSwiftInspect
import SwiftSyntax

class ClassInfoExtractor {
    static func extractClassInfo(from jsonString: String) -> ClassInfo? {
        guard let jsonData = jsonString.data(using: .utf8) else {
            return nil
        }

        do {
            return try JSONDecoder().decode(ClassInfo.self, from: jsonData)
        } catch {
            print("Failed to decode ClassInfo: \(error)")
            return nil
        }
    }

    static func writeClassInfoToFile(_ classInfo: ClassInfo, to outputPath: URL) throws {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        let jsonData = try encoder.encode(classInfo)
        try jsonData.write(to: outputPath)
    }
}
