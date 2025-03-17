use cmd_lib::run_cmd;
use std::{io::Result, path::Path};

/// lang param should be kt | sw
fn build_lang_kt(lang: &str) -> Result<()> {
    let dir = get_dir_name(lang);
    // TODO: need to extract gradle
    run_cmd!(
        info "$dir build start";
        cd "$dir";
        gradle "build";
        info "$dir build complete";

    )
}
fn build_lang_sw(lang: &str) -> Result<()> {
    let dir = get_dir_name(lang);
    // TODO: need to extract protoc invokation
    run_cmd!(
        info "$dir build start";
        cd "$dir";
        protoc --proto_path="../src/protos" --swift_out="Sources/$dir" modtyinfo.proto;
        swift build | xcbeautify;
        info "$dir build complete";

    )
}

fn get_dir_name(lang: &str) -> String {
    let manifest_dir = Path::new(env!("CARGO_MANIFEST_DIR"));
    let manifest_dir_stem = manifest_dir.file_stem().unwrap().to_str().unwrap();
    format!("{manifest_dir_stem}-{lang}")
}
fn main() -> Result<()> {
    prost_build::compile_protos(&["src/protos/modtyinfo.proto"], &["src/"])?;
    build_lang_kt("kt").unwrap();
    build_lang_sw("sw")
}
