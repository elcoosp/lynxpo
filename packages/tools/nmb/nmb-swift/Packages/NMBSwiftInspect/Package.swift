// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

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
        )
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
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "NMBSwiftInspect",

            dependencies: depsProducts
        ),
        .executableTarget(
            name: "NMBSwiftInspectCollector",
            dependencies: [
                "NMBSwiftInspect",
                .product(name: "SwiftSyntax", package: "swift-syntax"),
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
                .product(name: "Logging", package: "swift-log"),
            ]
        ),
        //.testTarget(
        //    name: "NMBSwiftInspectTests",
        //    dependencies: depsProducts + ["NMBSwiftInspect"]
        //),
        .plugin(
            name: "NMBSwiftInspectPlugin",
            capability: .buildTool(),
            dependencies: ["NMBSwiftInspectCollector"]
        ),
    ]
)
