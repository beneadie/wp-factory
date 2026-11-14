#!/usr/bin/env bash
# One check per batch of changes.
#
#   scripts/check.sh          typecheck + lint + build
#   scripts/check.sh --fast   typecheck + lint only (iteration)
#   scripts/check.sh --perf   the above plus one server + check:perf
#
# Run it after a batch of edits, not after every file. If it fails, fix and run
# it again. The point is to stop running three commands (and three builds) in a
# row for one change.
set -uo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

fast=0
perf=0
for arg in "$@"; do
  case "$arg" in
    --fast) fast=1 ;;
    --perf) perf=1 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

log="$(mktemp -t wp-check.XXXXXX)"
server_log="$(mktemp -t wp-server.XXXXXX)"
server_pid=""

cleanup() {
  if [ -n "$server_pid" ] && kill -0 "$server_pid" 2>/dev/null; then
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
  rm -f "$log" "$server_log"
}
trap cleanup EXIT

step() { printf '%s\n' "── $1"; }

fail() {
  printf 'FAIL %s\n' "$1"
  tail -n 30 "$log" | sed 's/^/   /'
  exit 1
}

run() {
  local label="$1"
  shift
  step "$label"
  if "$@" >"$log" 2>&1; then
    printf 'ok   %s\n' "$label"
  else
    fail "$label"
  fi
}

if [ -z "${WP_BASE_URL:-}" ] && [ ! -f .env.local ]; then
  echo "FAIL env: WP_BASE_URL is not set and .env.local is missing" >&2
  exit 1
fi

run typecheck npm run typecheck
run lint npm run lint

if [ "$fast" -eq 0 ]; then
  run build npm run build
fi

if [ "$perf" -eq 1 ]; then
  if [ ! -f .next/BUILD_ID ]; then
    printf 'FAIL perf: no build; run scripts/check.sh without --fast first\n'
    exit 1
  fi

  port="${PORT:-$(node -e 'const n=require("net");const s=n.createServer();s.listen(0,"127.0.0.1",()=>{console.log(s.address().port);s.close()})')}"
  step "perf (server on $port)"
  npm run start -- -p "$port" >"$server_log" 2>&1 &
  server_pid=$!

  ready=0
  for _ in $(seq 1 60); do
    if curl -sf -o /dev/null "http://127.0.0.1:$port/"; then
      ready=1
      break
    fi
    if ! kill -0 "$server_pid" 2>/dev/null; then
      break
    fi
    sleep 1
  done

  if [ "$ready" -ne 1 ]; then
    tail -n 20 "$server_log" | sed 's/^/   /'
    fail "perf: server did not start"
  fi

  if PERF_URL="http://127.0.0.1:$port" npm run check:perf >"$log" 2>&1; then
    printf 'ok   perf (docs/verification/perf.json)\n'
  else
    fail perf
  fi
fi

printf '\nall checks passed%s\n' "$([ "$perf" -eq 1 ] && printf ' (perf included)')"
