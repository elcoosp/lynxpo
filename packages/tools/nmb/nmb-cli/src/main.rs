//! CLI tool for comparing Kotlin and Swift type information and generating TypeScript.
use anyhow::{Context, Result};
use clap::{Parser, Subcommand};
use log::*;
use nmb_core::{
    load_type_info,
    model::{Language, UnifiedTypeInfo},
    to_unified_model,
};
use nmb_lint::HasErrors;
use nmb_lint::LintResult;
use nmb_ts::generate_typescript;
use std::path::PathBuf;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Compare Kotlin and Swift type info files
    Compare {
        /// Path to the Kotlin type info file
        #[arg(short, long)]
        kotlin: PathBuf,

        /// Path to the Swift type info file
        #[arg(short, long)]
        swift: PathBuf,

        /// Output lint report to this file
        #[arg(short, long)]
        output_report: Option<PathBuf>,

        /// Exit with error if there are lint issues
        #[arg(long)]
        strict: bool,
    },

    /// Generate TypeScript from a type info file
    Generate {
        /// Path to the type info file (Kotlin or Swift)
        #[arg(short, long)]
        input: PathBuf,

        /// Output TypeScript file
        #[arg(short, long)]
        output: PathBuf,
    },

    /// Validate a type info file's structure
    Validate {
        /// Path to the type info file
        #[arg(short, long)]
        input: PathBuf,

        /// Expected language (kotlin or swift)
        #[arg(short, long)]
        language: Option<String>,
    },
}

fn main() -> Result<()> {
    env_logger::init();
    let cli = Cli::parse();

    match &cli.command {
        Commands::Compare {
            kotlin,
            swift,
            output_report,
            strict,
        } => {
            let kotlin_info = load_type_info(kotlin.to_str().unwrap())
                .with_context(|| format!("Failed to load Kotlin type info from {:?}", kotlin))?;

            let swift_info = load_type_info(swift.to_str().unwrap())
                .with_context(|| format!("Failed to load Swift type info from {:?}", swift))?;

            let kotlin_unified = to_unified_model(kotlin_info);
            let swift_unified = to_unified_model(swift_info);

            info!(
                "Comparing Kotlin module '{}' with Swift module '{}'",
                kotlin_unified.module_name, swift_unified.module_name
            );

            let lint_results = nmb_lint::compare_modules(&kotlin_unified, &swift_unified);

            // Print the lint results
            print_lint_results(&lint_results);

            // Save report if requested
            if let Some(report_path) = output_report {
                save_lint_report(&lint_results, report_path)?;
            }

            // Exit with error if strict mode and there are issues
            if *strict && lint_results.has_errors() {
                std::process::exit(1);
            }

            Ok(())
        }

        Commands::Generate { input, output } => {
            let type_info = load_type_info(input.to_str().unwrap())
                .with_context(|| format!("Failed to load type info from {:?}", input))?;

            let unified = to_unified_model(type_info);

            info!(
                "Generating TypeScript for '{}', from language: {:?}",
                unified.module_name, unified.language
            );

            let ts_content = generate_typescript(&unified).unwrap();

            std::fs::write(output, ts_content)
                .with_context(|| format!("Failed to write TypeScript to {:?}", output))?;

            info!("TypeScript generated successfully: {:?}", output);

            Ok(())
        }

        Commands::Validate { input, language } => {
            let type_info = load_type_info(input.to_str().unwrap())
                .with_context(|| format!("Failed to load type info from {:?}", input))?;

            let unified = to_unified_model(type_info);

            // Validate against expected language if specified
            if let Some(lang_str) = language {
                let expected_language = match lang_str.to_lowercase().as_str() {
                    "kotlin" => Language::Kotlin,
                    "swift" => Language::Swift,
                    _ => {
                        return Err(anyhow::anyhow!(
                            "Invalid language: {}. Expected 'kotlin' or 'swift'",
                            lang_str
                        ))
                    }
                };

                if unified.language != expected_language {
                    return Err(anyhow::anyhow!(
                        "File language mismatch. Expected {:?}, got {:?}",
                        expected_language,
                        unified.language
                    ));
                }
            }

            validate_structure(&unified)?;

            info!(
                "Validation successful for {:?} module '{}'",
                unified.language, unified.module_name
            );

            Ok(())
        }
    }
}

/// Prints lint results to stdout.
fn print_lint_results(results: &[LintResult]) {
    let (errors, warnings): (Vec<&LintResult>, Vec<&LintResult>) = results
        .iter()
        .partition(|r| r.severity == nmb_lint::Severity::Error);

    info!(
        "\nFound {} errors and {} warnings.",
        errors.len(),
        warnings.len()
    );

    if !errors.is_empty() {
        error!("\nERRORS:");
        for error in &errors {
            error!("  • {}", error.message);
            if let Some(details) = &error.details {
                error!("    {}", details);
            }
        }
    }

    if !warnings.is_empty() {
        warn!("\nWARNINGS:");
        for warning in &warnings {
            warn!("  • {}", warning.message);
            if let Some(details) = &warning.details {
                warn!("    {}", details);
            }
        }
    }
}

/// Saves lint results to a file.
fn save_lint_report(results: &[LintResult], path: &PathBuf) -> Result<()> {
    let json = serde_json::to_string_pretty(results)?;
    std::fs::write(path, json)
        .with_context(|| format!("Failed to write lint report to {:?}", path))?;
    info!("Lint report saved to {:?}", path);
    Ok(())
}

/// Validates the structure of a type info file.
fn validate_structure(unified: &UnifiedTypeInfo) -> Result<()> {
    // Basic structure validation
    if unified.module_name.is_empty() {
        return Err(anyhow::anyhow!("Module name is empty"));
    }

    if unified.qualified_name.is_empty() {
        return Err(anyhow::anyhow!("Qualified name is empty"));
    }

    // Check for duplicate type names
    let mut type_names = std::collections::HashSet::new();
    for t in &unified.types {
        if !type_names.insert(&t.name) {
            return Err(anyhow::anyhow!("Duplicate type name: {}", t.name));
        }
    }

    // Check for duplicate method names
    let mut method_names = std::collections::HashSet::new();
    for m in &unified.methods {
        if !method_names.insert(&m.name) {
            return Err(anyhow::anyhow!("Duplicate method name: {}", m.name));
        }
    }

    Ok(())
}
