//! Linting functionality for comparing Kotlin and Swift type info.

// pub mod report;
pub mod rules;

use anyhow::Result;
use nmb_core::model::{UnifiedMethod, UnifiedTypeInfo};
use serde::{Deserialize, Serialize};

/// Severity of lint findings.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum Severity {
    #[serde(rename = "error")]
    Error,
    #[serde(rename = "warning")]
    Warning,
}

/// Result of a lint check.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LintResult {
    pub rule: String,
    pub message: String,
    pub severity: Severity,
    pub details: Option<String>,
}

impl LintResult {
    pub fn error(rule: &str, message: &str, details: Option<String>) -> Self {
        Self {
            rule: rule.to_string(),
            message: message.to_string(),
            severity: Severity::Error,
            details,
        }
    }

    pub fn warning(rule: &str, message: &str, details: Option<String>) -> Self {
        Self {
            rule: rule.to_string(),
            message: message.to_string(),
            severity: Severity::Warning,
            details,
        }
    }
}

/// Compare two modules and return a list of lint results.
pub fn compare_modules(kotlin: &UnifiedTypeInfo, swift: &UnifiedTypeInfo) -> Vec<LintResult> {
    let mut results = Vec::new();

    // Apply various rules
    results.extend(rules::naming::check_module_naming(kotlin, swift));
    results.extend(rules::types::check_type_compatibility(kotlin, swift));
    // results.extend(rules::structure::check_method_compatibility(kotlin, swift));

    results
}

/// Determines if the list of results contains any errors.
pub trait HasErrors {
    fn has_errors(&self) -> bool;
}

impl HasErrors for Vec<LintResult> {
    fn has_errors(&self) -> bool {
        self.iter().any(|r| r.severity == Severity::Error)
    }
}

/// Compares two methods to determine if they are compatible.
pub fn are_methods_compatible(
    kotlin_method: &UnifiedMethod,
    swift_method: &UnifiedMethod,
) -> Result<()> {
    // Check return type compatibility
    if !rules::types::are_types_compatible(&kotlin_method.return_type, &swift_method.return_type) {
        return Err(anyhow::anyhow!(
            "Return type mismatch: Kotlin '{}' vs Swift '{}'",
            kotlin_method.return_type.name,
            swift_method.return_type.name
        ));
    }

    // Check parameter count
    if kotlin_method.parameters.len() != swift_method.parameters.len() {
        return Err(anyhow::anyhow!(
            "Parameter count mismatch: Kotlin {} vs Swift {}",
            kotlin_method.parameters.len(),
            swift_method.parameters.len()
        ));
    }

    // Check parameters
    for (i, (k_param, s_param)) in kotlin_method
        .parameters
        .iter()
        .zip(swift_method.parameters.iter())
        .enumerate()
    {
        // Check parameter names
        if k_param.name != s_param.name {
            return Err(anyhow::anyhow!(
                "Parameter #{} name mismatch: Kotlin '{}' vs Swift '{}'",
                i,
                k_param.name,
                s_param.name
            ));
        }

        // Check parameter types
        if !rules::types::are_types_compatible(&k_param.type_info, &s_param.type_info) {
            return Err(anyhow::anyhow!(
                "Parameter '{}' type mismatch: Kotlin '{}' vs Swift '{}'",
                k_param.name,
                k_param.type_info.name,
                s_param.type_info.name
            ));
        }
    }

    Ok(())
}
