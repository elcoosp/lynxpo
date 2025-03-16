@attached(peer, names: arbitrary)  // Generates metadata structure
public macro Typed(_ value: String = "") =
    #externalMacro(
        module: "NMBSwiftInspect",
        type: "TypedMacro"
    )

@attached(peer)  // Marks methods for inclusion
public macro LynxMethod() =
    #externalMacro(
        module: "NMBSwiftInspect",
        type: "LynxMethodMacro"
    )

@attached(peer)  // Return type override
public macro TsRetInto(_ value: String) =
    #externalMacro(
        module: "NMBSwiftInspect",
        type: "TsRetIntoMacro"
    )
