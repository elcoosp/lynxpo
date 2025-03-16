import Foundation
import NMBSwiftInspect
import SwiftSyntax

/// Helper class to extract and format class info from typeInfo strings
class ClassInfoExtractor {
    /// Extract structured ClassInfo from a typeInfo string
    static func extractClassInfo(from typeInfoString: String) -> [String: Any]? {
        // Attempt to parse the typeInfo string as JSON
        guard let data = typeInfoString.data(using: .utf8) else {
            return nil
        }

        do {
            if let json = try JSONSerialization.jsonObject(with: data, options: [])
                as? [String: Any]
            {
                return json
            }
        } catch {
            print("Failed to parse typeInfo as JSON: \(error)")
        }

        return nil
    }

    /// Write class info to file with pretty printing
    static func writeClassInfoToFile(_ classInfo: [String: Any], to outputPath: URL) throws {
        let data = try JSONSerialization.data(withJSONObject: classInfo, options: [.prettyPrinted])
        try data.write(to: outputPath)
    }
}
