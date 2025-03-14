//! Swift-specific type information models and conversion functions.

use ordermap::OrderMap;

use super::{
    Language, TypeInfoFile, UnifiedEnumValue, UnifiedMethod, UnifiedParameter, UnifiedProperty,
    UnifiedType, UnifiedTypeInfo, UnifiedTypeKind,
};

/// Maps Swift type names to TypeScript types.
fn map_swift_type(type_name: &str) -> &'static str {
    match type_name {
        "Swift.Int" | "Swift.Int32" | "Swift.Int64" => "number",
        "Swift.Float" | "Swift.Double" => "number",
        "Swift.Bool" => "boolean",
        "Swift.String" => "string",
        "Swift.Void" => "void",
        "Swift.Never" => "never",
        "Swift.Array" => "Array",
        "Swift.Dictionary" => "Record",
        "Swift.Optional" => "null", // Will be handled separately
        "Swift.Any" => "any",
        _ => "unknown",
    }
}

/// Determines the unified type kind from a Swift type name.
fn determine_type_kind(type_name: &str) -> UnifiedTypeKind {
    match type_name {
        "Swift.Int" | "Swift.Int32" | "Swift.Int64" | "Swift.Float" | "Swift.Double"
        | "Swift.Bool" | "Swift.String" | "Swift.Character" | "Swift.Void" | "Swift.Never" => {
            UnifiedTypeKind::Primitive
        }
        "Swift.Array" | "Swift.Set" => UnifiedTypeKind::Array,
        "Swift.Dictionary" => UnifiedTypeKind::Dictionary,
        "Swift.Optional" => UnifiedTypeKind::Optional,
        _ => UnifiedTypeKind::Class, // Default to class, will be refined later
    }
}

/// Converts a Swift type info to a unified type info.
pub fn to_unified(swift_info: &TypeInfoFile) -> UnifiedTypeInfo {
    let mut unified = UnifiedTypeInfo {
        module_name: swift_info.name.clone(),
        qualified_name: swift_info.full_name.clone(),
        methods: Vec::new(),
        types: Vec::new(),
        language: Language::Swift,
        doc: swift_info.doc.clone(),
    };

    // Convert methods
    for method in &swift_info.methods {
        let return_type = convert_type_info(&method.return_type);

        let mut parameters = Vec::new();
        for param in &method.parameters {
            parameters.push(UnifiedParameter {
                name: param.name.clone(),
                type_info: convert_type_info(&param.type_info),
                has_default_value: param.has_default_value,
                doc: param.doc.clone(),
            });
        }

        // In Swift, async functions are marked differently
        let is_async = method.is_async || method.name.starts_with("async");

        unified.methods.push(UnifiedMethod {
            name: method.name.clone(),
            return_type,
            parameters,
            is_async,
            doc: method.doc.clone(),
        });
    }

    // Convert serializable types
    for type_info in &swift_info.serializable_types {
        let mut unified_type = UnifiedType {
            name: type_info.name.clone(),
            qualified_name: type_info.full_name.clone(),
            is_nullable: false,
            kind: match type_info.kind {
                super::TypeKind::Class => UnifiedTypeKind::Class,
                super::TypeKind::Interface => UnifiedTypeKind::Interface,
                super::TypeKind::Enum => UnifiedTypeKind::Enum,
                super::TypeKind::Object => UnifiedTypeKind::Class, // Swift doesn't have objects like Kotlin
                super::TypeKind::Struct => UnifiedTypeKind::Class, // Swift structs are treated as classes
            },
            type_arguments: Vec::new(),
            properties: Vec::new(),
            enum_values: Vec::new(),
            doc: type_info.doc.clone(),
        };

        // Convert properties
        for prop in &type_info.property_definitions {
            unified_type.properties.push(UnifiedProperty {
                name: prop.name.clone(),
                type_info: Box::new(convert_type_info(&prop.type_info)),
                doc: String::new(), // Swift might not have property docs in this format
            });
        }

        // Convert enum values if this is an enum
        if unified_type.kind == UnifiedTypeKind::Enum {
            for enum_val in &type_info.enum_values {
                let mut property_map = OrderMap::new();

                // Match property values to property definitions
                for (i, prop_val) in enum_val.property_values.iter().enumerate() {
                    if i < type_info.property_definitions.len() {
                        let prop_name = &type_info.property_definitions[i].name;
                        property_map.insert(prop_name.clone(), prop_val.clone());
                    }
                }

                unified_type.enum_values.push(UnifiedEnumValue {
                    name: enum_val.name.clone(),
                    property_values: property_map,
                    doc: enum_val.doc.clone(),
                });
            }
        }

        unified.types.push(unified_type);
    }

    unified
}

/// Converts a Swift TypeInfo to a UnifiedType.
fn convert_type_info(type_info: &super::TypeInfo) -> UnifiedType {
    let base_type_kind = determine_type_kind(&type_info.full_name);

    let mut unified_type = UnifiedType {
        name: type_info.name.clone(),
        qualified_name: type_info.full_name.clone(),
        is_nullable: type_info.is_nullable,
        kind: base_type_kind,
        type_arguments: Vec::new(),
        properties: Vec::new(),
        enum_values: Vec::new(),
        doc: type_info.doc.clone(),
    };

    // Convert type arguments
    for type_arg in &type_info.type_arguments {
        unified_type
            .type_arguments
            .push(convert_type_info(type_arg));
    }

    // Handle custom type hints
    if let Some(custom_hint) = &type_info.custom_return_hint {
        // If there's a custom type hint, use it as the name
        unified_type.name = custom_hint.clone();
        // This is often for enums or other special types
        unified_type.kind = UnifiedTypeKind::Class;
    }

    // Handle Swift optionals
    if unified_type.kind == UnifiedTypeKind::Optional && !unified_type.type_arguments.is_empty() {
        // Get the inner type and mark it as nullable
        let mut inner_type = unified_type.type_arguments.remove(0);
        inner_type.is_nullable = true;
        unified_type = inner_type;
    }

    unified_type
}
