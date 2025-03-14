//! Rules for checking naming consistency between Kotlin and Swift.

use crate::LintResult;
use nmb_core::model::UnifiedTypeInfo;
use std::collections::{HashMap, HashSet};

/// Checks module naming consistency.
pub fn check_module_naming(kotlin: &UnifiedTypeInfo, swift: &UnifiedTypeInfo) -> Vec<LintResult> {
    let mut results = Vec::new();

    // Check module names
    if kotlin.module_name != swift.module_name {
        results.push(LintResult::error(
            "module-name",
            &format!(
                "Module name mismatch: Kotlin '{}' vs Swift '{}'",
                kotlin.module_name, swift.module_name
            ),
            None,
        ));
    }

    // Check method names (case-insensitive to handle camelCase vs snake_case)
    let kotlin_methods: HashSet<String> = kotlin
        .methods
        .iter()
        .map(|m| m.name.to_lowercase())
        .collect();

    let swift_methods: HashSet<String> = swift
        .methods
        .iter()
        .map(|m| m.name.to_lowercase())
        .collect();

    // Methods in Kotlin but not in Swift
    for method in kotlin.methods.iter() {
        if !swift_methods.contains(&method.name.to_lowercase()) {
            results.push(LintResult::error(
                "method-existence",
                &format!("Method '{}' exists in Kotlin but not in Swift", method.name),
                None,
            ));
        }
    }

    // Methods in Swift but not in Kotlin
    for method in swift.methods.iter() {
        if !kotlin_methods.contains(&method.name.to_lowercase()) {
            results.push(LintResult::error(
                "method-existence",
                &format!("Method '{}' exists in Swift but not in Kotlin", method.name),
                None,
            ));
        }
    }

    // Check type names
    let kotlin_types: HashMap<String, &str> = kotlin
        .types
        .iter()
        .map(|t| (t.name.to_lowercase(), t.name.as_str()))
        .collect();

    let swift_types: HashMap<String, &str> = swift
        .types
        .iter()
        .map(|t| (t.name.to_lowercase(), t.name.as_str()))
        .collect();

    // Types in Kotlin but not in Swift
    for (lowercase, original) in kotlin_types.iter() {
        if !swift_types.contains_key(lowercase) {
            results.push(LintResult::error(
                "type-existence",
                &format!("Type '{}' exists in Kotlin but not in Swift", original),
                None,
            ));
        }
    }

    // Types in Swift but not in Kotlin
    for (lowercase, original) in swift_types.iter() {
        if !kotlin_types.contains_key(lowercase) {
            results.push(LintResult::error(
                "type-existence",
                &format!("Type '{}' exists in Swift but not in Kotlin", original),
                None,
            ));
        }
    }

    // Check enum values
    for kotlin_type in kotlin.types.iter().filter(|t| !t.enum_values.is_empty()) {
        // Find matching Swift type
        if let Some(swift_type) = swift
            .types
            .iter()
            .find(|t| t.name.to_lowercase() == kotlin_type.name.to_lowercase())
        {
            // Compare enum values
            let kotlin_values: HashSet<String> = kotlin_type
                .enum_values
                .iter()
                .map(|v| v.name.to_lowercase())
                .collect();

            let swift_values: HashSet<String> = swift_type
                .enum_values
                .iter()
                .map(|v| v.name.to_lowercase())
                .collect();

            // Enum values in Kotlin but not in Swift
            for enum_value in &kotlin_type.enum_values {
                if !swift_values.contains(&enum_value.name.to_lowercase()) {
                    results.push(LintResult::error(
                        "enum-value-existence",
                        &format!(
                            "Enum value '{}::{}' exists in Kotlin but not in Swift",
                            kotlin_type.name, enum_value.name
                        ),
                        None,
                    ));
                }
            }

            // Enum values in Swift but not in Kotlin
            for enum_value in &swift_type.enum_values {
                if !kotlin_values.contains(&enum_value.name.to_lowercase()) {
                    results.push(LintResult::error(
                        "enum-value-existence",
                        &format!(
                            "Enum value '{}::{}' exists in Swift but not in Kotlin",
                            swift_type.name, enum_value.name
                        ),
                        None,
                    ));
                }
            }
        }
    }

    results
}

/// Normalize a method name for comparison.
pub fn normalize_method_name(name: &str) -> String {
    // Handle Swift-style getters (property access vs methods)
    if name.starts_with("get") && name.len() > 3 {
        let property_name = &name[3..];
        if let Some(c) = property_name.chars().next() {
            if c.is_uppercase() {
                // Convert getName to name
                return c.to_lowercase().chain(property_name[1..].chars()).collect();
            }
        }
    }

    name.to_string()
}
