pub mod location {
    use nmb_core::model::SourceLocation;
    use terminal_hyperlink::Hyperlink;

    // Helper function to create terminal hyperlinks from location information
    pub fn fmt_hyperlink(location: &SourceLocation, item_name: &str) -> String {
        if location.file_path.is_empty() || location.start_line == 0 {
            // If no valid location information, just return the name
            return format!("`{}`", item_name);
        }

        let url = format!(
            "file://{file_path}:{line}:{column}",
            file_path = location.file_path,
            line = location.start_line,
            column = location.start_column + 1
        );

        format!("`{}`", item_name.hyperlink(url))
    }
}
