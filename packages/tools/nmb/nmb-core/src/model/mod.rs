//! Data models for representing type information from different languages.

pub mod kotlin;
pub mod swift;

use ordermap::OrderMap;
use serde::{Deserialize, Serialize};

/// Represents the source location of a declaration in the source code.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SourceLocation {
    #[serde(default)]
    pub file_path: String,
    #[serde(default)]
    pub start_line: u32,
    #[serde(default)]
    pub start_column: u32,
    #[serde(default)]
    pub end_line: u32,
    #[serde(default)]
    pub end_column: u32,
}

impl Default for SourceLocation {
    fn default() -> Self {
        Self {
            file_path: String::new(),
            start_line: 0,
            start_column: 0,
            end_line: 0,
            end_column: 0,
        }
    }
}

/// Represents the source language of type information.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Language {
    Kotlin,
    Swift,
}

/// A generic type information file that can represent either Kotlin or Swift info.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TypeInfoFile {
    pub full_name: String,
    pub name: String,
    pub methods: Vec<MethodInfo>,
    #[serde(default)]
    pub generic_metadata: String,
    #[serde(default)]
    pub serializable_types: Vec<SerializableTypeInfo>,
    #[serde(default)]
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

impl TypeInfoFile {
    /// Checks if this file has Kotlin-specific fields or patterns.
    // FIXME: broken
    pub fn has_kotlin_specific_fields(&self) -> bool {
        unimplemented!();
        // Look for Kotlin-specific patterns
        //     self.methods.iter().any(|m| m.is_extension || m.is_async)
        //         || self
        //             .serializable_types
        //             .iter()
        //             .any(|t| matches!(t.kind, TypeKind::Object))
    }
}

/// Represents a method/function in either language.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MethodInfo {
    pub name: String,
    pub return_type: TypeInfo,
    #[serde(default)]
    pub parameters: Vec<ParameterInfo>,
    pub receiver_type: Option<TypeInfo>,
    pub visibility: Visibility,
    #[serde(default)]
    pub is_extension: bool,
    #[serde(default)]
    pub is_inline: bool,
    #[serde(default)]
    pub is_async: bool,
    #[serde(default)]
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// Visibility modifiers for methods and fields.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum Visibility {
    #[serde(rename = "PUBLIC")]
    Public,
    #[serde(rename = "INTERNAL")]
    Internal,
    #[serde(rename = "PROTECTED")]
    Protected,
    #[serde(rename = "PRIVATE")]
    Private,
}

/// Represents type information for parameters and return values.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TypeInfo {
    pub full_name: String,
    pub name: String,
    #[serde(default)]
    pub is_nullable: bool,
    #[serde(default)]
    pub type_arguments: Vec<TypeInfo>,
    pub custom_return_hint: Option<String>,
    #[serde(default)]
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// Parameter information for methods.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterInfo {
    pub name: String,
    #[serde(rename = "type")]
    pub type_info: TypeInfo,
    #[serde(default)]
    pub has_default_value: bool,
    #[serde(default)]
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// Information about serializable types like classes, interfaces, and enums.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerializableTypeInfo {
    pub full_name: String,
    pub name: String,
    pub kind: TypeKind,
    #[serde(default)]
    pub property_definitions: Vec<PropertyDefinition>,
    #[serde(default)]
    pub enum_values: Vec<EnumValue>,
    #[serde(default)]
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// Type kind for serializable types.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum TypeKind {
    #[serde(rename = "CLASS")]
    Class,
    #[serde(rename = "INTERFACE")]
    Interface,
    #[serde(rename = "ENUM")]
    Enum,
    #[serde(rename = "OBJECT")]
    Object,
    #[serde(rename = "STRUCT")]
    Struct,
}

/// Property definition for serializable types.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PropertyDefinition {
    pub name: String,
    #[serde(rename = "type")]
    pub type_info: TypeInfo,
    #[serde(default)]
    pub location: SourceLocation,
}

/// Enum value information for enum types.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnumValue {
    pub name: String,
    #[serde(default)]
    pub property_values: Vec<String>,
    #[serde(default)]
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// A unified representation of type information that abstracts away language differences.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnifiedTypeInfo {
    pub module_name: String,
    pub qualified_name: String,
    pub methods: Vec<UnifiedMethod>,
    pub types: Vec<UnifiedType>,
    pub language: Language,
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// A unified method representation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnifiedMethod {
    pub name: String,
    pub return_type: UnifiedType,
    pub parameters: Vec<UnifiedParameter>,
    pub is_async: bool,
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// A unified parameter representation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnifiedParameter {
    pub name: String,
    pub type_info: UnifiedType,
    pub has_default_value: bool,
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// A unified type representation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnifiedType {
    pub name: String,
    pub qualified_name: String,
    pub is_nullable: bool,
    pub kind: UnifiedTypeKind,
    pub type_arguments: Vec<UnifiedType>,
    pub properties: Vec<UnifiedProperty>,
    pub enum_values: Vec<UnifiedEnumValue>,
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// Type kind for unified types.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum UnifiedTypeKind {
    Primitive,
    Class,
    Struct,
    Interface,
    Enum,
    Array,
    Dictionary,
    Optional,
    Unknown,
}

/// A unified property representation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnifiedProperty {
    pub name: String,
    pub type_info: Box<UnifiedType>,
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}

/// A unified enum value representation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnifiedEnumValue {
    pub name: String,
    pub property_values: OrderMap<String, String>,
    pub doc: String,
    #[serde(default)]
    pub location: SourceLocation,
}
