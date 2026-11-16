#!/usr/bin/env bash
# Helpers shared by run-job.sh. Sourced, never executed directly.
# Callers set: ROOT, dir, slug, name, wp_url, niche.

# Read a phase label from the site's status file. Tolerates a leading "- " or
# "* " bullet, returns the status word and anything after it.
status_get() {
  local label="$1"
  local file="$dir/docs/site/00-status.md"
  [ -f "$file" ] || return 0
  awk -v l="$label" '
    { line=$0; sub(/^[-*][[:space:]]*/, "", line) }
    index(line, l ": ") == 1 { print substr(line, length(l) + 3); exit }
  ' "$file"
}

status_ok() {
  case "$(status_get "$1")" in
    PASS*|SKIPPED*) return 0 ;;
    *) return 1 ;;
  esac
}

# True when every comma-separated artifact exists under $dir and is non-trivial.
# This is what stops an agent from writing PASS without producing the handoff.
artifact_ok() {
  local list="$1"
  local min="${MIN_ARTIFACT_BYTES:-100}"
  local file
  local IFS=','
  for file in $list; do
    [ -n "$file" ] || continue
    [ -f "$dir/$file" ] || return 1
    [ "$(wc -c < "$dir/$file")" -ge "$min" ] || return 1
  done
  return 0
}

# Render a phase prompt with the job's values substituted.
render() {
  local template="$ROOT/factory/prompts/$1.md"
  python3 - "$template" "$slug" "$name" "$wp_url" "${niche:-unknown}" "${site_mode:-store}" "${TEMPLATE:-unknown}" <<'PY'
import sys
path, slug, name, url, niche, mode, template = sys.argv[1:8]
text = open(path).read()
for key, value in (
    ("{{slug}}", slug), ("{{name}}", name),
    ("{{wp_url}}", url), ("{{niche}}", niche or "unknown"),
    ("{{site_mode}}", mode or "store"), ("{{template}}", template or "unknown"),
):
    text = text.replace(key, value)
sys.stdout.write(text)
PY
}
