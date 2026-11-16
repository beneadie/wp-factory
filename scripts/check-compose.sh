#!/usr/bin/env bash
# Compose every preset into a throwaway app and typecheck it.
#
#   ./scripts/check-compose.sh            # all presets
#   ./scripts/check-compose.sh practice   # one
#
# This is the real integration gate: a preset compiles alone, but only the
# composed app proves the seven exported fixtures, the section signatures and
# the theme wiring fit the core template. Uses the first site's node_modules.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

WORK="${COMPOSE_DIR:-/tmp/opencode/compose}"
mkdir -p "$WORK"

donor="$(find "$ROOT/sites" -maxdepth 2 -type d -name node_modules -printf '%h\n' 2>/dev/null | head -1)"
[ -n "$donor" ] || { echo "no node_modules in sites/ - install once first" >&2; exit 1; }

fail=0
presets=("$@")
if [ "${#presets[@]}" -eq 0 ]; then
  mapfile -t presets < <(find templates -mindepth 1 -maxdepth 1 -type d ! -name _shared -printf '%f\n' | sort)
fi

for name in "${presets[@]}"; do
  out="$WORK/$name"
  printf '\n=== %s ===\n' "$name"
  mkdir -p "$out"
  rsync -a --delete --exclude node_modules --exclude .next --exclude .env.local \
    "$ROOT/template/" "$out/"

  mkdir -p "$out/src/styles"
  cp "templates/$name/theme.css" "$out/src/styles/theme.base.css"
  [ -f "$out/src/styles/theme.css" ] || printf '/* client overrides */\n' > "$out/src/styles/theme.css"
  rm -rf "$out/src/template-sections"
  mkdir -p "$out/src/template-sections"
  cp "templates/$name/sections/"* "$out/src/template-sections/"
  cp "templates/$name/theme.ts" "$out/src/config/theme.ts"
  [ -e "$out/node_modules" ] || ln -s "$donor/node_modules" "$out/node_modules"

  if ( cd "$out" && npx tsc --noEmit ); then
    echo "typecheck: PASS"
  else
    echo "typecheck: FAIL"
    fail=1
  fi
done

printf '\n'
if [ "$fail" -eq 0 ]; then
  echo "compose: PASS (${#presets[@]} preset(s))"
else
  echo "compose: FAIL"
  exit 1
fi
