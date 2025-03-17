// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "nmb-core-sw",
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "nmb-core-sw",
            targets: ["nmb-core-sw"])
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-protobuf.git", from: "1.29.0")
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "nmb-core-sw",
            dependencies: [.product(name: "SwiftProtobuf", package: "swift-protobuf")]
        ),
        .testTarget(
            name: "nmb-core-swTests",
            dependencies: ["nmb-core-sw"]
        ),
    ]
)
