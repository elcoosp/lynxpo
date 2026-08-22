#!/usr/bin/env bash
#
# dump-files.sh — produce dump.txt: a single-file review bundle of all
# *authored* lynxpo source (excluding the vendored Lynx engine tree,
# third_party, buildtools, and build/dist/node_modules artifacts).
#
# Every file is delimited by a line:
#     === File: <repo-relative path> ===
#
# Usage:
#     bash scripts/dump-files.sh          # writes ./dump.txt (next to repo root)
#     bash scripts/dump-files.sh OUT.txt  # custom output path
#
# Safe to re-run; it overwrites the destination.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-"$ROOT/dump.txt"}"
# Repo-relative path of the output, used to exclude it from the dump itself.
OUT_REL="${OUT#"$ROOT"/}"
[[ "$OUT_REL" == "$OUT" ]] && OUT_REL="$(basename "$OUT")"   # if outside repo, exclude by basename

# --- Vendored / non-product trees to skip entirely -------------------------
VENDOR_PREFIXES=(
  packages/playground/src/lynx
  packages/playground/src/third_party
  packages/playground/src/buildtools
  packages/playground/src/build
  packages/playground/src/out
  packages/playground/out
  packages/playground/dist
  proposals
)

# Build a `find` prune expression for vendored dirs (matched 1 level deep only).
PRUNE_FIND=()
for p in "${VENDOR_PREFIXES[@]}"; do
  PRUNE_FIND+=( -path "./$p" -prune -o )
done

# Directories we skip everywhere (regardless of location).
SKIP_DIRS=( node_modules .git dist build out .gradle .turbo .cxx .idea venv
            .cache __pycache__ .hermes .vscode .DS_Store )

# Add the skip-dirs to the find prune expression so find never descends into them.
for d in "${SKIP_DIRS[@]}"; do
  PRUNE_FIND+=( -name "$d" -prune -o )
done

# Build a bash-regex of vendored prefixes for the file-list walk.
VENDOR_RE=""
for p in "${VENDOR_PREFIXES[@]}"; do
  VENDOR_RE+="$p/|"
done
VENDOR_RE="${VENDOR_RE%|}"   # strip trailing |

# --- File extensions to include --------------------------------------------
# shellcheck disable=SC2207
EXTS=( ts tsx js jsx mjs cjs json jsonc kt kts swift m h mm c hpp cpp cc java
       py rs go md toml yaml yml gradle sh bash txt css scss sass less html htm
       xml pbxproj plist proto graphql gni gn cmake lock csv gitignore gitmodules
       editorconfig npmrc babelrc eslintrc prettierrc browserslistrc nvmrc
       dockerignore code-workspace turbo gitattributes clang-format clang-tidy
       swiftlint.yml cxx )

# Directories we skip everywhere (regardless of location). (regex used as a
# secondary guard on the already-pruned file list; find already pruned them.)
SKIP_DIRS_RE='(^|/)(node_modules|\.git|dist|build|out|\.gradle|\.turbo|\.cxx|\.idea|venv|\.cache|__pycache__|\.hermes|\.vscode)(/|$)'

# --- Collect the file list --------------------------------------------------
# Walk with find (pruning vendored trees), then filter by ext + skip-dirs in bash.
declare -a FILES=()
while IFS= read -r f; do
  rel="${f#./}"
  # skip-dirs regex
  if [[ "$rel" =~ $SKIP_DIRS_RE ]]; then continue; fi
  # vendored prefixes
  if [[ "$rel" =~ ^($VENDOR_RE) ]]; then continue; fi
  # never include the dump output itself, or this script's own dir
  if [[ "$rel" == "$OUT_REL" ]]; then continue; fi
  if [[ "$rel" =~ ^scripts/ ]]; then continue; fi
  ext="${rel##*.}"
  ext="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"   # lowercase (bash 3.2 safe)
  # require ext in EXTS
  ok=0
  for e in "${EXTS[@]}"; do
    if [[ "$ext" == "$e" ]]; then ok=1; break; fi
  done
  if [[ "$ok" -eq 1 ]]; then FILES+=("$rel"); fi
done < <(cd "$ROOT" && find . "${PRUNE_FIND[@]}" -type f -print | sort)

# --- Write the dump ---------------------------------------------------------
TOTAL=${#FILES[@]}
SIZE_BYTES=0
# pre-compute total size (bytes); guard against failed stat / absurd values
while IFS= read -r sz; do SIZE_BYTES=$((SIZE_BYTES + sz)); done < <(
  for f in "${FILES[@]}"; do
    s=$(stat -f%z "$ROOT/$f" 2>/dev/null)
    case "$s" in (*[!0-9]*|"") s=0;; esac   # force numeric
    if [[ "$s" -gt 1073741824 ]]; then s=0; fi
    echo "$s"
  done
)
# bytes -> MB with bc (bash 3.2 has no float arithmetic)
SIZE_MB="$(echo "scale=2; $SIZE_BYTES/1048576" | bc)"

# Bash 3.2-safe extension breakdown: stream file list through sort/uniq.
EXT_BREAKDOWN="$(for f in "${FILES[@]}"; do
  e="${f##*.}"; e="$(printf '%s' "$e" | tr '[:upper:]' '[:lower:]')"
  echo ".$e"
done | sort | uniq -c | sort -rn | awk '{printf " %s:%s", $2, $1}')"

{
  echo "lynxpo source dump"
  echo "Generated for review by an external agent."
  echo "Each file is delimited by a line: === File: <repo-relative path> ==="
  echo ""
  echo "EXCLUDED (vendored engine / build artifacts / non-product):"
  for p in "${VENDOR_PREFIXES[@]}"; do echo "  - $p/"; done
  echo "  - node_modules, dist, build, out, .gradle, .turbo, .cxx, venv, .cache, .idea, .hermes, .vscode"
  echo ""
  echo "TOTAL FILES INCLUDED: $TOTAL"
  echo "TOTAL SIZE: ${SIZE_MB:-0.00} MB"
  echo ""
  echo "EXTENSION BREAKDOWN:${EXT_BREAKDOWN}"
  echo "================================================================================"
  echo ""
  for rel in "${FILES[@]}"; do
    # Guarantee the delimiter starts on its own line even if the previous
    # file had no trailing newline (otherwise it would fuse onto the last line).
    echo ""
    echo "=== File: $rel ==="
    if [[ -f "$ROOT/$rel" ]]; then
      cat "$ROOT/$rel"
    else
      echo "<MISSING: $rel>"
    fi
  done
} > "$OUT"

echo "Wrote $OUT"
echo "files: $TOTAL  size: ${SIZE_MB:-0.00} MB"
