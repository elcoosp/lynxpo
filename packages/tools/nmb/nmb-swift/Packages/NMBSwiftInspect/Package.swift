// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import CompilerPluginSupport
import PackageDescription

let depsProducts: [Target.Dependency] = [
    .product(
        name: "MetaCodable",
        package: "MetaCodable"
    ),
    .product(
        name: "SwiftSyntax",
        package: "swift-syntax"
    ),
    .product(name: "SwiftSyntaxMacros", package: "swift-syntax"),
    .product(name: "SwiftCompilerPlugin", package: "swift-syntax"),
    // .product(name: "MacroTesting", package: "swift-macro-testing"),
]
let package = Package(
    name: "NMBSwiftInspect",
    platforms: [.macOS(.v15)],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "NMBSwiftInspect",
            targets: ["NMBSwiftInspect"]
        ),
        // .plugin(name: "NMBSwiftInspectPlugin", targets: ["NMBSwiftInspectPlugin"]),
        .plugin(name: "NMBSwiftInspectPluginCmd", targets: ["NMBSwiftInspectPluginCmd"]),
        .executable(name: "NMBSwiftInspectCollector", targets: ["NMBSwiftInspectCollector"]),
    ],
    dependencies: [
        .package(url: "https://github.com/elcoosp/MetaCodable", revision: "c2ff8f"),
        .package(url: "https://github.com/swiftlang/swift-syntax.git", branch: "main"),
        // .package(url: "https://github.com/pointfreeco/swift-macro-testing", branch: "main"),
        .package(url: "https://github.com/apple/swift-argument-parser", branch: "main"),
        .package(url: "https://github.com/stackotter/swift-macro-toolkit", branch: "main"),
        .package(url: "https://github.com/apple/swift-log.git", branch: "main"),
    ],
    targets: [
        .macro(
            name: "NMBSwiftInspectMacros",
            dependencies: depsProducts
        ),
        .executableTarget(
            name: "NMBSwiftInspectCollector",
            dependencies: [
                "NMBSwiftInspect",
                .product(name: "SwiftSyntax", package: "swift-syntax"),
                .product(name: "SwiftSyntaxMacros", package: "swift-syntax"),
                .product(name: "SwiftCompilerPlugin", package: "swift-syntax"),
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
                .product(name: "Logging", package: "swift-log"),

            ]
        ),
        //.testTarget(
        //    name: "NMBSwiftInspectTests",
        //    dependencies: depsProducts + ["NMBSwiftInspect"]
        //),
        // .plugin(
        //     name: "NMBSwiftInspectPlugin",
        //     capability: .buildTool(),
        //     dependencies: ["NMBSwiftInspectCollector"]
        // ),
        .plugin(
            name: "NMBSwiftInspectPluginCmd",
            capability: .command(
                intent: .sourceCodeFormatting(),
                permissions: [
                    .writeToPackageDirectory(reason: "This command write type infos metadata")
                ]
            ),
            dependencies: ["NMBSwiftInspectCollector"]
        ),
        .target(
            name: "NMBSwiftInspect",
            dependencies: ["NMBSwiftInspectMacros"]
        ),
    ]
)
