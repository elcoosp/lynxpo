// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "NMBSwiftInspect",
    platforms: [.macOS(.v15)],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "NMBSwiftInspect",
            targets: ["NMBSwiftInspect"])
    ],
    dependencies: [
        .package(url: "https://github.com/SwiftyLab/MetaCodable.git", branch: "main"),
        .package(url: "https://github.com/swiftlang/swift-syntax.git", from: "600.0.1"),
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "NMBSwiftInspect",

            dependencies: [
                .product(
                    name: "MetaCodable",
                    package: "MetaCodable"
                ),
                .product(
                    name: "SwiftSyntax",
                    package: "swift-syntax"
                ),
                .product(name: "SwiftSyntaxMacros", package: "swift-syntax"),
            ]),
        .testTarget(
            name: "NMBSwiftInspectTests",
            dependencies: ["NMBSwiftInspect"]
        ),
    ]
)
