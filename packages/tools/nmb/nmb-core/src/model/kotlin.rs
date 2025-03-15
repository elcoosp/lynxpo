//! Kotlin-specific type information models and conversion functions.

use ordermap::OrderMap;

use super::{
    Language, TypeInfoFile, UnifiedEnumValue, UnifiedMethod, UnifiedParameter, UnifiedProperty,
    UnifiedType, UnifiedTypeInfo, UnifiedTypeKind,
};

/// Determines the unified type kind from a Kotlin type name.
fn determine_type_kind(type_name: &str) -> UnifiedTypeKind {
    match type_name {
        "kotlin.Int" | "kotlin.Long" | "kotlin.Float" | "kotlin.Double" | "kotlin.Boolean"
        | "kotlin.String" | "kotlin.Char" | "kotlin.Unit" | "kotlin.Nothing" => {
            UnifiedTypeKind::Primitive
        }
        "kotlin.Array" | "kotlin.collections.List" | "kotlin.collections.Set" => {
            UnifiedTypeKind::Array
        }
        "kotlin.collections.Map" => UnifiedTypeKind::Dictionary,
        _ => UnifiedTypeKind::Class, // Default to class, will be refined later
    }
}

/// Converts a Kotlin type info to a unified type info.
pub fn to_unified(kotlin_info: &TypeInfoFile) -> UnifiedTypeInfo {
    let mut unified = UnifiedTypeInfo {
        module_name: kotlin_info.name.clone(),
        qualified_name: kotlin_info.full_name.clone(),
        methods: Vec::new(),
        types: Vec::new(),
        language: Language::Kotlin,
        doc: kotlin_info.doc.clone(),
        location: kotlin_info.location.clone(),
    };

    // Convert methods
    for method in &kotlin_info.methods {
        let return_type = convert_type_info(&method.return_type);

        let mut parameters = Vec::new();
        for param in &method.parameters {
            parameters.push(UnifiedParameter {
                name: param.name.clone(),
                type_info: convert_type_info(&param.type_info),
                has_default_value: param.has_default_value,
                doc: param.doc.clone(),
                location: param.location.clone(),
            });
        }

        unified.methods.push(UnifiedMethod {
            name: method.name.clone(),
            return_type,
            parameters,
            is_async: method.is_async,
            doc: method.doc.clone(),
            location: method.location.clone(),
        });
    }

    // Convert serializable types
    for type_info in &kotlin_info.serializable_types {
        let mut unified_type = UnifiedType {
            name: type_info.name.clone(),
            qualified_name: type_info.full_name.clone(),
            is_nullable: false,
            kind: match type_info.kind {
                super::TypeKind::Class => UnifiedTypeKind::Class,
                super::TypeKind::Interface => UnifiedTypeKind::Interface,
                super::TypeKind::Enum => UnifiedTypeKind::Enum,
                super::TypeKind::Object => UnifiedTypeKind::Class, // Kotlin objects are singleton classes
                super::TypeKind::Struct => UnifiedTypeKind::Class, // Kotlin doesn't have structs, this is for Swift
            },
            type_arguments: Vec::new(),
            properties: Vec::new(),
            enum_values: Vec::new(),
            doc: type_info.doc.clone(),
            location: type_info.location.clone(),
        };

        // Convert properties
        for prop in &type_info.property_definitions {
            unified_type.properties.push(UnifiedProperty {
                name: prop.name.clone(),
                type_info: Box::new(convert_type_info(&prop.type_info)),
                doc: String::new(), // Kotlin doesn't have property docs in this format
                location: prop.location.clone(),
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
                    location: enum_val.location.clone(),
                });
            }
        }

        unified.types.push(unified_type);
    }

    unified
}

/// Converts a Kotlin TypeInfo to a UnifiedType.
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
        location: type_info.location.clone(),
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

    unified_type
}
