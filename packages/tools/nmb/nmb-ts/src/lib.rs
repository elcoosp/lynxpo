use anyhow::Result;
use nmb_core::model::*;
/// Generates TypeScript type definitions from unified type information
pub fn generate_typescript(unified_info: &UnifiedTypeInfo) -> Result<String> {
    let mut ts_content = String::new();

    // Add file header comment with metadata
    ts_content.push_str(&format!(
        "/**\n * Generated TypeScript definitions from {} code\n * Module: {}\n */\n\n",
        match unified_info.language {
            Language::Kotlin => "Kotlin",
            Language::Swift => "Swift",
        },
        unified_info.module_name
    ));

    // Add documentation if available
    if !unified_info.doc.is_empty() {
        ts_content.push_str(&format!(
            "/**\n * {}\n */\n",
            unified_info.doc.replace("\n", "\n * ")
        ));
    }

    // Generate type definitions for all types
    for type_info in &unified_info.types {
        ts_content.push_str(&generate_ts_type(type_info).unwrap());
        ts_content.push('\n');
    }

    // Generate function definitions for all methods
    for method in &unified_info.methods {
        ts_content.push_str(&generate_ts_method(method).unwrap());
        ts_content.push('\n');
    }

    Ok(ts_content)
}

/// Generates TypeScript type definition for a unified type
fn generate_ts_type(type_info: &UnifiedType) -> Result<String, Box<dyn std::error::Error>> {
    let mut ts_type = String::new();

    // Add documentation if available
    if !type_info.doc.is_empty() {
        ts_type.push_str(&format!(
            "/**\n * {}\n */\n",
            type_info.doc.replace("\n", "\n * ")
        ));
    }

    match type_info.kind {
        UnifiedTypeKind::Enum => {
            // Generate enum type
            ts_type.push_str(&format!("export enum {} {{\n", type_info.name));
            const CONSTRUCTOR_PROP_INDEX: usize = 0;
            let constr_ty = type_info.properties[CONSTRUCTOR_PROP_INDEX]
                .type_info
                .name
                .clone();
            println!("{type_info:#?}");
            for enum_value in &type_info.enum_values {
                // Add enum value documentation if available
                if !enum_value.doc.is_empty() {
                    ts_type.push_str(&format!(
                        "  /**\n   * {}\n   */\n",
                        enum_value.doc.replace("\n", "\n   * ")
                    ));
                }
                println!("{enum_value:#?}");
                // There is no constructor in typescript
                let val = enum_value.property_values[CONSTRUCTOR_PROP_INDEX].clone();
                let val_maybe_str = match constr_ty.as_str() {
                    "Int" => val.to_string(),
                    "String" => format!("\"{val}\""),
                    _ => panic!("Can not create a typescript enum with a member value of {val}"),
                };
                ts_type.push_str(&format!("  {} = {},\n", enum_value.name, val_maybe_str));
            }

            ts_type.push_str("}\n");
        }
        UnifiedTypeKind::Interface => {
            // Generate interface type
            ts_type.push_str(&format!("export interface {} {{\n", type_info.name));

            for property in &type_info.properties {
                // Add property documentation if available
                if !property.doc.is_empty() {
                    ts_type.push_str(&format!(
                        "  /**\n   * {}\n   */\n",
                        property.doc.replace("\n", "\n   * ")
                    ));
                }

                let property_type = get_ts_type_name(&property.type_info);
                ts_type.push_str(&format!("  {}: {};\n", property.name, property_type));
            }

            ts_type.push_str("}\n");
        }
        UnifiedTypeKind::Class | UnifiedTypeKind::Struct => {
            // Generate class or interface type
            // For simplicity, we'll use interfaces for both classes and structs
            ts_type.push_str(&format!("export interface {} {{\n", type_info.name));

            for property in &type_info.properties {
                // Add property documentation if available
                if !property.doc.is_empty() {
                    ts_type.push_str(&format!(
                        "  /**\n   * {}\n   */\n",
                        property.doc.replace("\n", "\n   * ")
                    ));
                }

                let property_type = get_ts_type_name(&property.type_info);
                ts_type.push_str(&format!("  {}: {};\n", property.name, property_type));
            }

            ts_type.push_str("}\n");
        }
        _ => {
            // Handle other type kinds
            // For primitive types, arrays, etc. we don't need to generate anything
            return Ok(String::new());
        }
    }

    Ok(ts_type)
}

/// Generates TypeScript method/function definition
fn generate_ts_method(method: &UnifiedMethod) -> Result<String, Box<dyn std::error::Error>> {
    let mut ts_method = String::new();

    // Add documentation if available
    if !method.doc.is_empty() {
        ts_method.push_str(&format!("/**\n * {}\n", method.doc.replace("\n", "\n * ")));

        // Add parameter documentation
        for param in &method.parameters {
            if !param.doc.is_empty() {
                ts_method.push_str(&format!(" * @param {} {}\n", param.name, param.doc));
            }
        }

        // Add return documentation
        if !method.return_type.doc.is_empty() {
            ts_method.push_str(&format!(" * @returns {}\n", method.return_type.doc));
        }

        ts_method.push_str(" */\n");
    }

    // Generate function signature
    ts_method.push_str(&format!("export function {}(", method.name));

    // Generate parameters
    let params: Vec<String> = method
        .parameters
        .iter()
        .map(|param| {
            let type_name = get_ts_type_name(&param.type_info);
            let optional = if param.has_default_value { "?" } else { "" };
            format!("{}{}: {}", param.name, optional, type_name)
        })
        .collect();

    ts_method.push_str(&params.join(", "));

    // Generate return type
    let return_type = get_ts_type_name(&method.return_type);
    ts_method.push_str(&format!(
        "): {}",
        if method.is_async {
            format!("Promise<{}>", return_type)
        } else {
            return_type
        }
    ));

    // For a type definition file, we just need the signature
    ts_method.push_str(";\n");

    Ok(ts_method)
}

/// Converts a UnifiedType to a TypeScript type name
fn get_ts_type_name(type_info: &UnifiedType) -> String {
    // Handle nullable types
    let type_suffix = if type_info.is_nullable { " | null" } else { "" };

    let base_type = match type_info.kind {
        UnifiedTypeKind::Primitive => match type_info.name.as_str() {
            "Int" | "Long" | "Short" | "Byte" | "Float" | "Double" => "number",
            "Boolean" => "boolean",
            "String" | "Char" => "string",
            "Unit" | "Void" => "void",
            "Any" => "any",
            _ => type_info.name.as_str(),
        }
        .to_string(),
        UnifiedTypeKind::Array => {
            if !type_info.type_arguments.is_empty() {
                format!("{}[]", get_ts_type_name(&type_info.type_arguments[0]))
            } else {
                "any[]".to_string()
            }
        }
        UnifiedTypeKind::Dictionary => {
            if type_info.type_arguments.len() >= 2 {
                format!(
                    "Record<{}, {}>",
                    get_ts_type_name(&type_info.type_arguments[0]),
                    get_ts_type_name(&type_info.type_arguments[1])
                )
            } else {
                "Record<string, any>".to_string()
            }
        }
        UnifiedTypeKind::Optional => {
            if !type_info.type_arguments.is_empty() {
                format!(
                    "{} | undefined",
                    get_ts_type_name(&type_info.type_arguments[0])
                )
            } else {
                "any | undefined".to_string()
            }
        }
        _ => {
            // For custom types, use the name directly
            let type_name = type_info.name.clone();

            // Handle generics
            if !type_info.type_arguments.is_empty() {
                let generic_args: Vec<String> = type_info
                    .type_arguments
                    .iter()
                    .map(get_ts_type_name)
                    .collect();

                format!("{}<{}>", type_name, generic_args.join(", "))
            } else {
                type_name
            }
        }
    };

    format!("{}{}", base_type, type_suffix)
}
