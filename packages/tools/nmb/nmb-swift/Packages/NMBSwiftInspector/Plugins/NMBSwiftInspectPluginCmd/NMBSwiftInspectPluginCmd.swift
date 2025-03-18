import Foundation
import PackagePlugin

@main
struct NMBSwiftInspectPluginCmd: CommandPlugin {
    func performCommand(
        context: PluginContext,
        arguments: [String]
    ) throws {
        // Locate the collector tool executable
        let collectorTool = try context.tool(named: "NMBSwiftInspectCollector")

        // Extract target arguments (empty means all targets)
        var argExtractor = ArgumentExtractor(arguments)
        let targetNames = argExtractor.extractOption(named: "target")
        let targets =
            targetNames.isEmpty
            ? context.package.targets
            : try context.package.targets(named: targetNames)

        // Process each target
        for target in targets {
            // Skip non-source targets
            guard let sourceTarget = target as? SourceModuleTarget else { continue }

            // Collect Swift source files
            let swiftSources = sourceTarget.sourceFiles
                .filter { $0.url.pathExtension == "swift" }
                .map { $0.path.string }

            // Create output directory
            let outputDir = context.pluginWorkDirectoryURL
                .appending(path: "TypeInfo")
            try FileManager.default.createDirectory(
                atPath: outputDir.formatted(),
                withIntermediateDirectories: true
            )

            // Prepare arguments
            let toolArgs =
                [
                    "--source-files"
                ] + swiftSources + [
                    "--output-directory", outputDir.formatted(),
                ]

            // Run the collection tool
            let process = try Process.run(
                URL(fileURLWithPath: collectorTool.url.formatted()),
                arguments: toolArgs
            )
            process.waitUntilExit()

            // Handle results
            if process.terminationReason == .exit && process.terminationStatus == 0 {
                print("Collected type info for \(target.name) at \(outputDir)")
            } else {
                let problem = "\(process.terminationReason):\(process.terminationStatus)"
                Diagnostics.error("Collection failed for \(target.name): \(problem)")
            }
        }
    }
}
