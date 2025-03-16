import Foundation
import PackagePlugin

@main
struct NMBSwiftInspectPlugin: BuildToolPlugin {
    func createBuildCommands(context: PluginContext, target: Target) throws -> [Command] {

        // Ensure we're dealing with a target that has source files
        guard let sourceTarget = target as? SourceModuleTarget else {
            return []
        }

        // Find all Swift source files in the target
        let swiftSources = sourceTarget.sourceFiles.filter { $0.url.pathExtension == "swift" }

        // Create a directory for the output files
        let outputDirectory = context.pluginWorkDirectoryURL.appendingPathComponent("TypeInfo")

        // Create a command to scan the Swift files for @Typed macros and collect their typeInfo
        return [
            .buildCommand(
                displayName:
                    "Collecting NMBSwiftInspect Type Information at \(outputDirectory)",
                executable: try context.tool(named: "NMBSwiftInspectCollector").url,
                arguments: [
                    "--source-files"
                ] + swiftSources.map { "\($0.url)" } + [
                    "--output-directory", "\(outputDirectory)",
                ],
                environment: [:],
                inputFiles: swiftSources.map { $0.url },
                outputFiles: []
            )
        ]
    }
}
