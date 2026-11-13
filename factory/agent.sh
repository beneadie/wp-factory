#!/usr/bin/env bash
# Run one agent pass in one site directory.
#   agent.sh <slug> <dir> <prompt> <log>
set -euo pipefail

slug="$1"
dir="$2"
prompt="$3"
log="$4"

cd "$dir"

args=(run --agent site-builder --auto --standalone --format json --title "$slug")
if [ -n "${OPENCODE_MODEL:-}" ]; then
  args+=(--model "$OPENCODE_MODEL")
fi

opencode "${args[@]}" "$prompt" >"$log" 2>&1
