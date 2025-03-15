//! Rules for checking type compatibility between Kotlin and Swift.

use crate::LintResult;
use nmb_core::model::{UnifiedType, UnifiedTypeInfo, UnifiedTypeKind};

/// Checks type compatibility between Kotlin and Swift modules.
pub fn check_type_compatibility(
    kotlin: &UnifiedTypeInfo,
    swift: &UnifiedTypeInfo,
) -> Vec<LintResult> {
    let mut results = Vec::new();

    // Create lookup maps for types
    // let kotlin_types_map: std::collections::HashMap<String, &UnifiedType> =
    //     kotlin.types.iter().map(|t| (t.name.clone(), t)).collect();

    let swift_types_map: std::collections::HashMap<String, &UnifiedType> =
        swift.types.iter().map(|t| (t.name.clone(), t)).collect();

    // Check each Kotlin type that also exists in Swift
    for kotlin_type in &kotlin.types {
        if let Some(swift_type) = swift_types_map.get(&kotlin_type.name) {
            // Check kind compatibility
            if !are_type_kinds_compatible(&kotlin_type.kind, &swift_type.kind) {
                results.push(LintResult::error(
                    "type-kind-mismatch",
                    &format!(
                        "Type '{}' has different kinds: Kotlin {:?} vs Swift {:?}",
                        kotlin_type.name, kotlin_type.kind, swift_type.kind
                    ),
                    None,
                ));
            }

            // For enums, check that values are compatible
            if kotlin_type.kind == UnifiedTypeKind::Enum && swift_type.kind == UnifiedTypeKind::Enum
            {
                check_enum_compatibility(kotlin_type, swift_type, &mut results);
            }

            // For classes and interfaces, check property compatibility
            if (kotlin_type.kind == UnifiedTypeKind::Class
                || kotlin_type.kind == UnifiedTypeKind::Interface)
                && (swift_type.kind == UnifiedTypeKind::Class
                    || swift_type.kind == UnifiedTypeKind::Interface)
            {
                // TODO
                // check_property_compatibility(kotlin_type, swift_type, &mut results);
            }
        }
    }

    // Check return types and parameter types of matching methods
    // check_method_type_compatibility(kotlin, swift, &mut results);

    results
}

/// Checks if two type kinds are compatible.
pub fn are_type_kinds_compatible(
    kotlin_kind: &UnifiedTypeKind,
    swift_kind: &UnifiedTypeKind,
) -> bool {
    match (kotlin_kind, swift_kind) {
        // Direct matches
        (k, s) if k == s => true,

        // Classes and interfaces can sometimes be interchangeable
        (UnifiedTypeKind::Class, UnifiedTypeKind::Interface)
        | (UnifiedTypeKind::Interface, UnifiedTypeKind::Class) => true,

        // Struct in Swift often maps to class or data class in Kotlin
        (UnifiedTypeKind::Class, UnifiedTypeKind::Struct)
        | (UnifiedTypeKind::Struct, UnifiedTypeKind::Class) => true,

        // Arrays and lists are often interchangeable
        (UnifiedTypeKind::Array, UnifiedTypeKind::Array) => true,

        // Everything else is incompatible
        _ => false,
    }
}

/// Checks if two types are compatible.
pub fn are_types_compatible(kotlin_type: &UnifiedType, swift_type: &UnifiedType) -> bool {
    // Check basic compatibility
    if kotlin_type.name == swift_type.name {
        return true;
    }

    // Handle primitive type mappings
    match (kotlin_type.name.as_str(), swift_type.name.as_str()) {
        // Number types
        ("Int", "Int32") | ("Int32", "Int") => true,
        ("Long", "Int64") | ("Int64", "Long") => true,
        ("Float", "Float") => true,
        ("Double", "Double") => true,

        // Boolean
        ("Boolean", "Bool") | ("Bool", "Boolean") => true,

        // String
        ("String", "String") => true,

        // Arrays
        ("Array", "Array") | ("List", "Array") | ("Array", "List") => {
            // Check type parameters if both have them
            if !kotlin_type.type_arguments.is_empty() && !swift_type.type_arguments.is_empty() {
                are_types_compatible(
                    &kotlin_type.type_arguments[0],
                    &swift_type.type_arguments[0],
                )
            } else {
                true // Allow array type without checking element type
            }
        }

        // Maps/Dictionaries
        ("Map", "Dictionary") | ("Dictionary", "Map") => {
            // Check type parameters if both have them
            if kotlin_type.type_arguments.len() >= 2 && swift_type.type_arguments.len() >= 2 {
                are_types_compatible(
                    &kotlin_type.type_arguments[0],
                    &swift_type.type_arguments[0],
                ) && are_types_compatible(
                    &kotlin_type.type_arguments[1],
                    &swift_type.type_arguments[1],
                )
            } else {
                true // Allow dictionary type without checking key/value types
            }
        }

        // Custom types - compare by name
        _ => kotlin_type.name.to_lowercase() == swift_type.name.to_lowercase(),
    }
}

/// Checks enum compatibility between Kotlin and Swift.
fn check_enum_compatibility(
    kotlin_type: &UnifiedType,
    swift_type: &UnifiedType,
    results: &mut Vec<LintResult>,
) {
    // Check that all enum values match
    let kotlin_values: std::collections::HashSet<String> = kotlin_type
        .enum_values
        .iter()
        .map(|v| v.name.to_lowercase())
        .collect();

    let swift_values: std::collections::HashSet<String> = swift_type
        .enum_values
        .iter()
        .map(|v| v.name.to_lowercase())
        .collect();

    // Check for values in both sets
    for kotlin_value in &kotlin_type.enum_values {
        let lowercase = kotlin_value.name.to_lowercase();
        if !swift_values.contains(&lowercase) {
            results.push(LintResult::error(
                "enum-value-mismatch",
                &format!(
                    "Enum value '{}::{}' exists in Kotlin but not in Swift",
                    kotlin_type.name, kotlin_value.name
                ),
                None,
            ));
        }
    }

    for swift_value in &swift_type.enum_values {
        let lowercase = swift_value.name.to_lowercase();
        if !kotlin_values.contains(&lowercase) {
            results.push(LintResult::error(
                "enum-value-mismatch",
                &format!(
                    "Enum value '{}::{}' exists in Swift but not in Kotlin",
                    swift_type.name, swift_value.name
                ),
                None,
            ));
        }
    }

    // For matching values, check property values if they exist
    for kotlin_value in &kotlin_type.enum_values {
        if let Some(swift_value) = swift_type
            .enum_values
            .iter()
            .find(|v| v.name.to_lowercase() == kotlin_value.name.to_lowercase())
        {
            // Check property mappings
            for (k_prop, k_val) in &kotlin_value.property_values {
                if let Some(s_val) = swift_value.property_values.get(k_prop) {
                    if k_val != s_val {
                        results.push(LintResult::error(
                            "enum-property-value-mismatch",
                            &format!(
                                "Enum value '{}::{}' property '{}' has different values: Kotlin '{}' vs Swift '{}'",
                                kotlin_type.name, kotlin_value.name, k_prop, k_val, s_val
                            ),
                            None,
                        ));
                    }
                }
            }
        }
    }
}
