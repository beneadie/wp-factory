#!/usr/bin/env bash
# Run one agent pass in one site directory.
#   agent.sh <dir> <slug> <phase> <log> <prompt> [--continue]
# --continue resumes the last session in that directory, which is this phase's
# session when the runner is retrying it.
set -euo pipefail

dir="$1"
slug="$2"
phase="$3"
log="$4"
prompt="$5"
shift 5

cont=0
if [ "${1:-}" = "--continue" ]; then
  cont=1
fi

cd "$dir"
mkdir -p "$(dirname "$log")"

args=(run --agent site-builder --auto --standalone --format json --title "$slug:$phase")
if [ -n "${OPENCODE_MODEL:-}" ]; then
  args+=(--model "$OPENCODE_MODEL")
fi
if [ "$cont" -eq 1 ]; then
  args+=(--continue)
fi

opencode "${args[@]}" "$prompt" >"$log" 2>&1
