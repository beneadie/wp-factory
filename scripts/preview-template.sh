#!/usr/bin/env bash
# Compose one design preset into a throwaway Next app and serve it.
#
#   ./scripts/preview-template.sh practice
#   ./scripts/preview-template.sh shop --port 3410
#
# The preview lives in /tmp/opencode/preview-<name>. Its .next cache and
# node_modules symlink survive re-runs, so the first start is the slow one.
#
# /__styleguide   the design system and all six sections
# /               the real site (needs .env.local + a reachable WordPress origin)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NAME="${1:-}"
shift || true

PORT=3400
while [ "${1:-}" != "" ]; do
  case "$1" in
    --port) PORT="${2:-3400}"; shift 2 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

if [ -z "$NAME" ]; then
  echo "usage: $0 <template> [--port 3400]" >&2
  echo "available:" >&2
  find "$ROOT/templates" -mindepth 1 -maxdepth 1 -type d ! -name '_shared' -printf '  %f\n' | sort >&2
  exit 2
fi

SRC="$ROOT/templates/$NAME"
[ -f "$SRC/theme.css" ] || { echo "no theme.css in $SRC" >&2; exit 1; }
[ -f "$SRC/sections/index.ts" ] || { echo "no sections/index.ts in $SRC" >&2; exit 1; }

OUT="${PREVIEW_DIR:-/tmp/opencode/preview-$NAME}"
mkdir -p "$OUT"

# 1. Core app, minus what we do not want to copy.
rsync -a --delete \
  --exclude node_modules --exclude .next --exclude .env.local \
  "$ROOT/template/" "$OUT/"

# 2. Overlay -> composed app.
mkdir -p "$OUT/src/styles"
cp "$SRC/theme.css" "$OUT/src/styles/theme.base.css"
[ -f "$OUT/src/styles/theme.css" ] || \
  printf '/* Client brand overrides - written by the design pass, never regenerated. */\n' \
  > "$OUT/src/styles/theme.css"

rm -rf "$OUT/src/template-sections"
mkdir -p "$OUT/src/template-sections"
cp "$SRC/sections/"* "$OUT/src/template-sections/"
cp "$SRC/theme.ts" "$OUT/src/config/theme.ts"

# 3. Apply the template's font variables to <body> (idempotent). The theme CSS
#    itself is imported by globals.css, so only the font wiring is needed here.
python3 - "$OUT/src/app/layout.tsx" <<'PY'
import sys
p = sys.argv[1]
s = open(p).read()
if "fontVariables" not in s:
    if 'from "@/config/theme"' not in s:
        s = s.replace(
            'import "./globals.css";',
            'import "./globals.css";\nimport { fontVariables } from "@/config/theme";',
            1,
        )
    s = s.replace(
        '<body className="flex min-h-dvh flex-col">',
        '<body className={`${fontVariables} flex min-h-dvh flex-col`}>',
        1,
    )
    open(p, "w").write(s)
PY

# 4. Give the preview a WordPress origin and a neutral site name. TEMPLATE is
#    what the styleguide prints in its eyebrow.
if [ ! -f "$OUT/.env.local" ]; then
  donor_env="$(find "$ROOT/sites" -maxdepth 2 -name .env.local -print 2>/dev/null | head -1)"
  [ -n "$donor_env" ] && cp "$donor_env" "$OUT/.env.local"
fi
python3 - "$OUT/.env.local" "$NAME" <<'PY'
import os, re, sys
p, name = sys.argv[1], sys.argv[2]
s = open(p).read() if os.path.exists(p) else ""
for k, v in (("SITE_NAME", "Preview - " + name), ("TEMPLATE", name)):
    if re.search(r"^%s=" % k, s, re.M):
        s = re.sub(r"^%s=.*" % k, "%s=%s" % (k, v), s, flags=re.M)
    else:
        s += ("" if not s or s.endswith("\n") else "\n") + "%s=%s\n" % (k, v)
open(p, "w").write(s)
PY

# 5. Reuse an installed node_modules instead of a fresh npm install.
if [ ! -e "$OUT/node_modules" ]; then
  donor="$(find "$ROOT/sites" -maxdepth 2 -type d -name node_modules -printf '%h\n' 2>/dev/null | head -1)"
  if [ -n "$donor" ]; then
    ln -s "$donor/node_modules" "$OUT/node_modules"
  else
    ( cd "$OUT" && npm ci --prefer-offline --no-audit --no-fund )
  fi
fi

echo "template: $NAME"
echo "url:      http://localhost:$PORT/__styleguide"
echo "dir:      $OUT"
cd "$OUT"
exec npm run dev -- --port "$PORT"
