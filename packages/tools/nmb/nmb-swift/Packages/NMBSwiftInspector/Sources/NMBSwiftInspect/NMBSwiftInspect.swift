// @attached(peer, names: named(TypeInfo))  // Generates metadata structure
// public macro Typed(_ value: String = "") =
//     #externalMacro(
//         module: "NMBSwiftInspectMacros",
//         type: "TypedMacro"
//     )

@attached(peer)  // Marks methods for inclusion
public macro LynxMethod() =
    #externalMacro(
        module: "NMBSwiftInspectMacros",
        type: "LynxMethodMacro"
    )

@attached(peer)  // Return type override
public macro TsRetInto(_ value: String) =
    #externalMacro(
        module: "NMBSwiftInspectMacros",
        type: "TsRetIntoMacro"
    )
@attached(peer, names: named(TypeInfo))  // Generates metadata structure
public macro Typed(_ value: String = "") =
    #externalMacro(
        module: "NMBSwiftInspectMacros",
        type: "TypedMacro"
    )
