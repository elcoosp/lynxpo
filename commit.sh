#!/bin/bash
set -e

echo "🔍 Scanning for all remaining uncommitted files..."

# 1. Temporarily stage everything to let Git resolve renames/deletions
git add -A

# 2. Extract the exact list of files that have changes
git diff --cached --name-only | sort -u > remaining_files.txt
FILE_COUNT=$(wc -l < remaining_files.txt | tr -d ' ')

# 3. Reset the index so we can commit them one by one
git reset

echo "✅ Found $FILE_COUNT files to commit individually."
echo "========================================"

# Function to generate context-aware commit info
get_commit_info() {
  local file="$1"
  local type="chore"
  local scope="repo"
  local subject="update $file"
  local body="Automated commit for file updates."

  if [[ "$file" =~ ^packages/modules/([^/]+)/(.*)$ ]]; then
    local mod="${BASH_REMATCH[1]}"
    local rel="${BASH_REMATCH[2]}"
    scope="modules/$mod"

    if [[ "$rel" == "LICENSE" ]]; then
      subject="add Apache 2.0 license"
      body="Includes the Apache 2.0 license file in the module root to satisfy npm publishing requirements and clearly define the licensing terms for consumers."
    elif [[ "$rel" == "package.json" ]]; then
      subject="prepare package for npm publishing and autolink"
      body="Bumps version to 0.1.0, removes the legacy nmi postinstall hook, moves @lynx-js/react to peerDependencies, and updates the files array to include lynx.lib.json, types, and native twins for official autolink consumption."
    elif [[ "$rel" == "rslib.config.ts" ]]; then
      subject="drop custom ktts plugin from build"
      body="Removes the pluginKotlinToTS configuration from rslib as the project now relies on the official @lynx-js/autolink-codegen for TypeScript binding generation."
    elif [[ "$rel" == "src/index.ts" ]]; then
      subject="rebase facade to official autolink bindings"
      body="Replaces the manual INativeModules interface and NativeModules accessor pattern with direct imports from the generated ./generated/ directory, aligning with the official TS-first autolink flow."
    elif [[ "$rel" =~ ^android/src/main/java/.*\.(java|kt)$ ]]; then
      if [[ "$rel" == *"/generated/"* ]]; then
        subject="update generated android spec signatures"
        body="Regenerates the Android spec file to use precise Lynx bridge types (e.g., WritableMap, Promise, Double, Boolean) instead of generic Object or primitive doubles, ensuring type-safe JSBridge communication."
      else
        subject="migrate android module to LynxContext"
        body="Updates the native module constructor to accept LynxContext instead of the standard Android Context, required for proper integration with the Lynx JSBridge and official autolink system."
      fi
    elif [[ "$rel" == "lynx.lib.json" ]]; then
      subject="adopt official autolink manifest format"
      body="Restructures lynx.lib.json to match the official Lynx autolink specification, explicitly defining platform-specific source directories and package names for host app integration."
    elif [[ "$rel" =~ ^ios/ ]]; then
      if [[ "$rel" == *.podspec ]]; then
        subject="add iOS CocoaPods podspec"
        body="Introduces the CocoaPods podspec for the iOS native module to support the official Lynx autolink and module registration."
      else
        subject="update iOS native module implementation"
        body="Updates iOS native module source files and headers with @LynxNativeModule annotations to support the official Lynx autolink."
      fi
    elif [[ "$rel" =~ ^types/ ]]; then
      subject="add TypeScript definitions for codegen"
      body="Adds types/index.d.ts with @lynxmodule annotations to drive the official @lynx-js/autolink-codegen TypeScript binding generation."
    elif [[ "$rel" == "tsconfig.json" ]]; then
      subject="update tsconfig for new toolchain"
      body="Adjusts TypeScript configuration to align with the new rslib build setup and official autolink codegen flow."
    elif [[ "$rel" == "android/src/main/AndroidManifest.xml" ]]; then
      subject="add Android manifest for proxy activity"
      body="Adds AndroidManifest.xml to declare proxy activities required for system pickers and intents outside the Lynx view."
    else
      subject="update module files"
      body="Miscellaneous updates to module files for autolink compatibility."
    fi

  elif [[ "$file" =~ ^packages/core/(.*)$ ]]; then
    scope="core"
    local rel="${BASH_REMATCH[1]}"
    if [[ "$rel" =~ gradle|\.kts|\.toml ]]; then
      type="build"
      subject="update android core build configuration"
      body="Updates Gradle properties, version catalogs, and build scripts to align with the latest Lynx SDK 4.2.0 versions, compileSdk 37, and official Android build requirements."
    elif [[ "$rel" == ".gitignore" ]]; then
      subject="add gitignore for core package"
      body="Ignores local Gradle properties to prevent accidental commits of machine-specific SDK paths."
    else
      subject="clean up core local files"
      body="Removes local.properties and other machine-specific configurations from the core package."
    fi

  elif [[ "$file" =~ ^packages/playground/(.*)$ ]]; then
    scope="playground"
    local rel="${BASH_REMATCH[1]}"
    if [[ "$rel" =~ Podfile|Podfile.lock ]]; then
      type="build"
      subject="switch iOS host to official engine pods"
      body="Replaces the vendored Lynx engine checkout with official published CocoaPods specs, pinning engine versions to 4.2.0 and enabling the official autolink plugin."
    elif [[ "$rel" == "package.json" ]]; then
      subject="update playground dependencies"
      body="Updates playground dependencies to use the latest rspeedy 0.17.1, removes obsolete plugin links, and adds workspace links for new modules."
    elif [[ "$rel" =~ lynx.config.ts ]]; then
      subject="remove ktts plugin from playground build"
      body="Drops the custom pluginKotlinToTS from the playground rspeedy configuration as type generation is now handled by official autolink."
    elif [[ "$rel" =~ src/mods/.*Info.ts ]]; then
      subject="update module info facades"
      body="Adjusts playground module info components to use the newly generated autolink accessor functions."
    elif [[ "$rel" =~ src/host/ ]]; then
      subject="update standalone host app"
      body="Cleans up obsolete host build scripts and updates the generated library registry to include newly autolinked modules."
    elif [[ "$rel" == ".gitignore" ]]; then
      subject="update playground gitignore"
      body="Removes obsolete ignore rules for the vendored engine tree and build artifacts."
    elif [[ "$rel" == *.bundle ]]; then
      subject="rebuild host bundle"
      body="Rebuilds the host showcase bundle to reflect the latest module changes and autolink registry updates."
    else
      subject="update playground configuration"
      body="Adjusts playground build configs and ignore rules to reflect the new toolchain and removal of the vendored engine."
    fi

  elif [[ "$file" =~ ^scripts/migrate/(.*)$ ]]; then
    scope="scripts/migrate"
    type="feat"
    subject="add migration script $(basename "$file")"
    body="Adds Node.js migration script to automate the transition from custom tooling (nmi, ktts) to official Lynx autolink and npm publishing standards."
  elif [[ "$file" =~ ^scripts/native-android-check/(.*)$ ]]; then
    scope="scripts/native-android-check"
    type="feat"
    subject="add native android check setup"
    body="Adds Gradle setup for native Android module compilation checks to ensure all twin sources compile correctly in CI."

  elif [[ "$file" == "pnpm-lock.yaml" ]]; then
    subject="update pnpm lockfile"
    body="Regenerates pnpm-lock.yaml to reflect dependency updates, additions, and removals across the workspace."
  elif [[ "$file" == "pnpm-workspace.yaml" ]]; then
    subject="update pnpm workspace config"
    body="Removes obsolete tool and plugin paths from the pnpm workspace configuration."
  elif [[ "$file" == "turbo.json" ]]; then
    subject="update turbo build dependencies"
    body="Adds dependsOn for build tasks to ensure correct topological execution order in Turborepo."
  elif [[ "$file" == "lynxpo.code-workspace" ]]; then
    subject="update vscode workspace file"
    body="Removes references to deleted tools and plugins from the VS Code workspace definition."
  elif [[ "$file" == "package.json" ]]; then
    subject="update root package scripts and deps"
    body="Updates root package.json scripts for the new dev flow, adds changesets, and bumps rspeedy to 0.17.0."
  fi

  echo "${type}|${scope}|${subject}|${body}"
}

# Loop through each file and commit individually
while IFS= read -r file; do
  [ -z "$file" ] && continue

  info=$(get_commit_info "$file")
  IFS='|' read -r type scope subject body <<< "$info"

  msg="${type}(${scope}): ${subject}"

  echo "📝 Committing: $file"
  echo "   Message: $msg"

  # Stage the file correctly (handles new, modified, renamed, and deleted)
  if [ -e "$file" ]; then
    git add "$file"
  else
    # If the file was deleted, git add fails, so we use git rm
    git rm "$file" 2>/dev/null || git add -u "$file"
  fi

  # Commit with subject and long body description
  git commit -m "$msg" -m "$body" > /dev/null

done < remaining_files.txt

# Cleanup
rm remaining_files.txt

echo "========================================"
echo "✅ All $FILE_COUNT files committed successfully!"
