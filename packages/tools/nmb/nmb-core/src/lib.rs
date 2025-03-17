//! Core types and functionality for the ktts-interop tool.
//!
//! This crate provides the data models and parsing functionality for
//! Kotlin and Swift type information files.

pub mod model;

use anyhow::Result;

/// Loads type information from a file path.
pub fn load_type_info(path: &str) -> Result<model::TypeInfoFile> {
    let content = std::fs::read_to_string(path)?;
    let info = serde_json::from_str(&content)?;
    Ok(info)
}

/// Detects the language of a type info file based on its content.
pub fn detect_language(info: &model::TypeInfoFile) -> model::Language {
    // Simple heuristic detection based on common patterns
    // Could be improved with more sophisticated detection
    if info.has_kotlin_specific_fields() {
        model::Language::Kotlin
    } else {
        model::Language::Swift
    }
}

/// Creates a unified representation from either Kotlin or Swift type info.
pub fn to_unified_model(info: model::TypeInfoFile) -> model::UnifiedTypeInfo {
    // match detect_language(&info) {
    // model::Language::Kotlin =>
    model::kotlin::to_unified(&info)
    // model::Language::Swift => model::swift::to_unified(&info),
    // }
}

pub mod modtyinfo {
    include!(concat!(env!("OUT_DIR"), "/modtyinfo.rs"));
}
