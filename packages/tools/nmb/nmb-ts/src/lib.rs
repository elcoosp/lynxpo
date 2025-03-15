pub mod gen;
pub mod utils;
use anyhow::Result;
use log::*;
use nmb_core::model::*;
use ts_quote::{ts_string, TSSource, TS};

fn doc_wrap(doc: String) -> String {
    format!(
        "
/**
 * {doc}
 */
"
    )
    .to_string()
}
/// Generates TypeScript type definitions from unified type information
pub fn generate_typescript(unified_info: &UnifiedTypeInfo) -> Result<String> {
    // Add file header comment with metadata
    let module_name = unified_info.module_name.clone();
    let header = doc_wrap(
        ts_string! {Generated TypeScript definitions from Lynx Native Module: #module_name}.into(),
    );
    let mod_doc = doc_wrap(unified_info.doc.to_string());

    // Generate type definitions for all types
    let common_types = unified_info
        .types
        .iter()
        .map(|type_info| generate_ts_type(type_info).unwrap())
        .collect::<Vec<_>>()
        .join("\n");

    let implementations = unified_info
        .methods
        .iter()
        .map(|method| {
            match generate_impls_from_method(method, unified_info){
                Ok(x) => x,
                Err(e) => {
                    // Format a file location hyperlink if location information is available
                    let location_link = utils::location::fmt_hyperlink(&method.location, &method.name);
                
                    match e.to_string().starts_with("Expected '=>', got ':'") {
                        true => {
                            error!(
                                "Error while generating impl for {}: likely caused by missing/incorrect method.return_type.name",
                                location_link
                            )
                        },
                        false => {
                            error!(
                                "Unexpected error while generating impl for {}",
                                location_link
                            )
                        },
                    };
                    
                    // Log additional method details for debugging
                    error!("Method details: {:#?}", method);
                    panic!("Failed to generate implementation: {}", e)
                },
            }})
        .collect::<Vec<_>>()
        .join("\n");
    let react_imports = ["useState", "useCallback", "useEffect"].join(", ");
    let mod_interface = {
        let methods_types = unified_info
            .methods
            .iter()
            .map(|method: &UnifiedMethod| {
                let params = get_method_params(method)
                    .iter()
                    .map(|(name, ty)| format!("{}: {}", name, ty))
                    .collect::<Vec<_>>()
                    .join(", ");
                let name = method.name.clone();
                let ret = get_ts_type_name(&method.return_type);
                ts_string! { #name: (#params) => #ret }
            })
            .collect::<Vec<_>>()
            .join("\n");
        ts_string! {
            #mod_doc
            export interface #module_name {
                #methods_types
            }
        }
    };
    let ts_content = ts_string! {
        #header
        import { #react_imports } from "@lynx-js/react";
        import { NativeModules } from "@lynx-js/core";

        #common_types

        #mod_interface

        #implementations

    };
    // Parse and format the generated TypeScript
    let parsed = TS::from_source(ts_content).unwrap();
    let formatted = parsed.formatted(None).unwrap();

    Ok(formatted)
}

/// Generates TypeScript type definition for a unified type
fn generate_ts_type(type_info: &UnifiedType) -> Result<String, Box<dyn std::error::Error>> {
    let ts_type = match type_info.kind {
        UnifiedTypeKind::Enum => {
            let enum_name = &type_info.name;
            let variants = type_info
                .enum_values
                .iter()
                .map(|ev| {
                    let doc = if !ev.doc.is_empty() {
                        doc_wrap(ev.doc.to_string())
                    } else {
                        String::new()
                    };

                    const CONSTRUCTOR_PROP_INDEX: usize = 0;
                    let constr_ty = &type_info.properties[CONSTRUCTOR_PROP_INDEX].type_info.name;
                    let val = &ev.property_values[CONSTRUCTOR_PROP_INDEX];
                    let val_maybe_str = match constr_ty.as_str() {
                        "Int" => val.to_string(),
                        "String" => format!("\"{val}\""),
                        _ => panic!("Unsupported enum constructor type: {}", constr_ty),
                    };
                    let enum_variant_name = ev.name.clone();
                    ts_string! {
                        #doc
                        #enum_variant_name = #val_maybe_str
                    }
                })
                .collect::<Vec<_>>()
                .join(",\n");

            ts_string! {
                export enum #enum_name {
                    #variants
                }
            }
        }
        UnifiedTypeKind::Interface | UnifiedTypeKind::Class | UnifiedTypeKind::Struct => {
            let type_name = &type_info.name;
            let properties = type_info
                .properties
                .iter()
                .map(|prop| {
                    let doc = if !prop.doc.is_empty() {
                        doc_wrap(prop.doc.to_string())
                    } else {
                        String::new()
                    };
                    let prop_type = get_ts_type_name(&prop.type_info);
                    let prop_name = prop.name.clone();
                    ts_string! {
                        #doc
                        #prop_name: #prop_type
                    }
                })
                .collect::<Vec<_>>()
                .join(";\n");

            ts_string! {
                export interface #type_name {
                    #properties
                }
            }
        }
        _ => String::new(),
    };

    Ok(ts_type)
}

/// Generates TypeScript method/function definition
fn generate_impls_from_method(
    method: &UnifiedMethod,
    unified_info: &UnifiedTypeInfo,
) -> Result<String, Box<dyn std::error::Error>> {
    let params = get_method_params(method);

    let return_type = get_ts_type_name(&method.return_type);
    let return_type = if method.is_async {
        format!("Promise<{}>", return_type)
    } else {
        return_type
    };

    let doc_comment = if !method.doc.is_empty() {
        let doc = method.doc.to_string();
        // TODO
        // for param in &method.parameters {
        //     if !param.doc.is_empty() {
        //         doc.push_str(&format!("\n * @param {} {}", param.name, param.doc));
        //     }
        // }
        // if !method.return_type.doc.is_empty() {
        //     doc.push_str(&format!("\n * @returns {}", method.return_type.doc));
        // }
        doc_wrap(doc)
    } else {
        String::new()
    };
    let method_name = method.name.clone();

    let hooks = gen::hooks::generate_hooks(&gen::hooks::HookConfig {
        native_module_name: unified_info.module_name.clone(),
        method_name,
        return_type,
        params: params
            .into_iter()
            .map(|(name, type_name)| gen::hooks::Param { name, type_name })
            .collect::<Vec<_>>(),
        strategy: gen::hooks::HookGenerationStrategy::Direct,
        is_promise: true,
    })?;
    Ok(ts_string! {
        // #method_def
        #hooks
    })
}

/// Converts a UnifiedType to a TypeScript type name
fn get_ts_type_name(type_info: &UnifiedType) -> String {
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
            let type_name = type_info.name.clone();
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

fn get_method_params(method: &UnifiedMethod) -> Vec<(String, String)> {
    let params = method
        .parameters
        .iter()
        .map(|param| {
            let type_name = get_ts_type_name(&param.type_info);
            let optional = if param.has_default_value { "?" } else { "" };
            (format!("{}{}", param.name, optional), type_name)
        })
        .collect::<Vec<_>>();
    params
}
