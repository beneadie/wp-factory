#!/usr/bin/env bash
# Batch the read-only WordPress probes into one call.
#
#   scripts/wp-probe.sh https://acme.ie /tmp/wp-probe content
#   scripts/wp-probe.sh https://acme.ie /tmp/wp-probe catalog
#   scripts/wp-probe.sh https://acme.ie /tmp/wp-probe cart
#   scripts/wp-probe.sh https://acme.ie /tmp/wp-probe all
#
# Writes one JSON file plus headers and status code per endpoint, then prints a
# summary. Probes run concurrently; nothing here mutates the origin.
set -uo pipefail

base="${1:?usage: wp-probe.sh <base-url> <outdir> [content|catalog|cart|checkout|all]}"
out="${2:?usage: wp-probe.sh <base-url> <outdir> [mode]}"
mode="${3:-all}"
base="${base%/}"
parallel="${PARALLEL:-6}"

mkdir -p "$out"
jobs="$(mktemp)"
trap 'rm -f "$jobs"' EXIT

add() {
  printf '%s\t%s\n' "$1" "$base$2" >>"$jobs"
}

case "$mode" in
  content|all)
    add index "/wp-json/"
    add pages "/wp-json/wp/v2/pages?per_page=100"
    add posts "/wp-json/wp/v2/posts?per_page=20"
    add media "/wp-json/wp/v2/media?per_page=20"
    add menus "/wp-json/wp/v2/menus"
    ;;
esac

case "$mode" in
  catalog|all)
    add products "/wp-json/wc/store/v1/products?per_page=100"
    add product_categories "/wp-json/wc/store/v1/products/categories?per_page=100"
    add product_tags "/wp-json/wc/store/v1/products/tags?per_page=100"
    ;;
esac

case "$mode" in
  cart|all)
    add cart "/wp-json/wc/store/v1/cart"
    ;;
esac

case "$mode" in
  checkout|all)
    add checkout_options "/wp-json/wc/store/v1/checkout"
    ;;
esac

fetch() {
  local name="$1" url="$2"
  curl -sS -L --max-time 30 \
    -D "$out/$name.headers" \
    -o "$out/$name.json" \
    -w '%{http_code}' \
    "$url" >"$out/$name.code" 2>"$out/$name.err" || true
}

export -f fetch
export out

# shellcheck disable=SC2016
xargs -P "$parallel" -n 2 bash -c 'fetch "$0" "$1"' <"$jobs"

printf '%-20s %-5s %s\n' name code bytes
while IFS=$'\t' read -r name _; do
  code="$(cat "$out/$name.code" 2>/dev/null || echo 000)"
  bytes="$(wc -c <"$out/$name.json" 2>/dev/null || echo 0)"
  printf '%-20s %-5s %s\n' "$name" "$code" "$bytes"
done <"$jobs"

headers="$out/cart.headers"
if [ -f "$headers" ]; then
  printf '\ncart headers:\n'
  grep -iE '^(nonce|access-control-expose-headers):' "$headers" | sed 's/^/  /' || true
  # Never print the session token in full; it is a credential.
  grep -iE '^cart-token:' "$headers" | awk -F': ' '{print "  cart-token: " substr($2,1,16) "…"}'
fi

exit 0
