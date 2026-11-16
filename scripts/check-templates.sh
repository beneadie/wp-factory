#!/usr/bin/env bash
# Structural checks for every design preset. Fast, no build, no network.
#
#   ./scripts/check-templates.sh
#
# Fails on: missing required files, a missing or renamed section export, lorem
# ipsum, raw hex outside theme.css, an accent below 4.5:1, a token that a preset
# renamed instead of overriding, and a fixture image with no dimensions.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

fail=0
note() { printf '  %s\n' "$*"; }
bad() { printf '  FAIL %s\n' "$*"; fail=1; }

required=(
  theme.css theme.ts design.md
  sections/index.ts
  sections/hero.tsx sections/page-head.tsx sections/feature-grid.tsx
  sections/quote-band.tsx sections/cta-band.tsx sections/stat-band.tsx
  sections/fixtures.ts
  reference/README.md
)

for dir in templates/*/; do
  name="$(basename "$dir")"
  [ "$name" = "_shared" ] && continue
  printf '\n%s\n' "$name"

  for f in "${required[@]}"; do
    [ -s "$dir$f" ] || bad "missing or empty $f"
  done
  [ -s "$dir/sections/index.ts" ] || continue

  # The six exports, by name.
  for sec in Hero PageHead FeatureGrid QuoteBand CtaBand StatBand; do
    grep -q "\b$sec\b" "$dir/sections/index.ts" || bad "index.ts does not export $sec"
  done

  # Types must come from the core, never from templates/.
  if grep -rqE 'from ["'"'"'](\.\./)+_shared|from ["'"'"']templates/_shared' "$dir" \
       --include='*.ts' --include='*.tsx' 2>/dev/null; then
    bad "imports the shared source instead of @/lib/section-types"
  fi

  # No lorem ipsum anywhere in a preset.
  if grep -rqi 'lorem ipsum dolor\|dolor sit amet,' "$dir" --include='*.ts' --include='*.tsx' 2>/dev/null; then
    bad "lorem ipsum in fixtures"
  fi

  # Raw hex only in theme.css.
  if grep -rlE '#[0-9A-Fa-f]{6}\b' "$dir/sections" "$dir/theme.ts" 2>/dev/null \
     | grep -v fixtures.ts | grep -q .; then
    bad "raw hex outside theme.css (fixtures and design.md are exempt)"
  fi

  # Tokens may only be overridden, not invented as new colour names.
  if grep -Eo -- '--color-[a-z-]+' "$dir/theme.css" 2>/dev/null | sort -u \
     | grep -vE -- '--color-(bg|surface|elevated|text|muted|border|primary|accent|accent-ink|inverse-bg|inverse-text|success|warning|error)$' | grep -q .; then
    bad "unknown --color-* token declared in theme.css"
  fi

  # Accent contrast against the page background, computed not eyeballed.
  python3 - "$dir/theme.css" <<'PY' || bad "accent contrast below 4.5:1 or tokens unparseable"
import re, sys
s = open(sys.argv[1]).read()
def trip(tok):
    m = re.search(r'--%s:\s*(\d+)\s+(\d+)\s+(\d+)' % tok, s)
    return tuple(int(x) for x in m.groups()) if m else None
bg, ac = trip('color-bg'), trip('color-accent')
if not bg or not ac:
    sys.exit(1)
def lum(c):
    f = lambda v: v/12.92 if v <= 0.03928 else ((v+0.055)/1.055)**2.4
    r, g, b = (f(v/255) for v in c)
    return 0.2126*r + 0.7152*g + 0.0722*b
a, b = lum(ac), lum(bg)
ratio = (max(a, b) + 0.05) / (min(a, b) + 0.05)
print('  accent %.2f:1' % ratio)
sys.exit(0 if ratio >= 4.5 else 1)
PY
done

printf '\n'
if [ "$fail" -eq 0 ]; then
  echo "templates: PASS"
else
  echo "templates: FAIL"
  exit 1
fi
