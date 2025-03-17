// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "NMBExample",
    platforms: [.macOS(.v15)],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "NMBExample",
            targets: ["NMBExample"])
    ],
    dependencies: [
        .package(path: "../NMBSwiftInspector")
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "NMBExample",
            dependencies: [
                .product(name: "NMBSwiftInspect", package: "NMBSwiftInspector")
            ]
        )

    ]
)
