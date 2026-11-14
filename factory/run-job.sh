#!/usr/bin/env bash
# Claim one queued job, copy the template into sites/<slug>, run the phases,
# gate the result, record it. Safe to call from cron: it exits if a job is
# already running.
#
# Env knobs:
#   PHASES="intake build"      run only these phase runs
#   PHASE_ATTEMPTS=3           attempts per phase run before blocking
#   AGENT_TIMEOUT=7200         seconds per agent pass
#   SKIP_INSTALL=1             skip npm ci (deps already present)
#   DRY_RUN=1                  set up the site, print the plan, block the job
#   NO_REPORT=1                do not send Telegram reports (local testing)
#   STALE_HOURS=6              age at which a `running` job is treated as dead
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Load local secrets (Telegram, model, commit identity) if present. This is what
# makes cron and systemd runs able to report, not just an interactive shell.
if [ -f "$ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$ROOT/.env"
  set +a
fi

mkdir -p logs

# Generated sites live outside the repo by default. The repo sits on a Windows
# mount; node_modules and .next are an order of magnitude slower there. Existing
# jobs keep the path they were created with.
SITES_ROOT="${SITES_ROOT:-$HOME/wp-factory-sites}"
mkdir -p "$SITES_ROOT"

# A shared npm cache on the same fast filesystem keeps `npm ci` from rebuilding
# every package for every site.
export npm_config_cache="${NPM_CONFIG_CACHE:-$HOME/.npm}"

# Keep the cron log from growing without bound. The running shell holds an open
# fd, so this only rotates between runs.
if [ -f "$ROOT/logs/cron.log" ] && [ "$(wc -c < "$ROOT/logs/cron.log")" -gt 5242880 ]; then
  mv "$ROOT/logs/cron.log" "$ROOT/logs/cron.log.1"
fi

# Recover jobs left `running` by a crash, reboot or Windows sleep. Only when no
# worker holds the lock, so a live long build is never reaped.
if flock -n "$ROOT/.factory.lock" true 2>/dev/null; then
  python3 factory/queue.py reap --older-hours "${STALE_HOURS:-6}" >/dev/null 2>&1 || true
fi

exec 9>"$ROOT/.factory.lock"
if ! flock -n 9; then
  echo "a build is already running"
  exit 0
fi

job="$(python3 factory/queue.py take-next)"
if [ -z "$job" ]; then
  echo "no queued jobs"
  exit 0
fi

read_field() {
  printf '%s' "$job" | python3 -c "import json,sys; print(json.load(sys.stdin).get('$1') or '')"
}

slug="$(read_field slug)"
name="$(read_field name)"
wp_url="$(read_field wp_url)"
niche="$(read_field niche)"
dir=""
if [ -d "$ROOT/sites/$slug" ]; then
  # Legacy location, from before SITES_ROOT existed.
  dir="$ROOT/sites/$slug"
else
  dir="$SITES_ROOT/$slug"
fi
logdir="$ROOT/logs/$slug"

PHASE_ATTEMPTS="${PHASE_ATTEMPTS:-3}"
AGENT_TIMEOUT="${AGENT_TIMEOUT:-7200}"

mkdir -p "$logdir"

send_report() {
  if [ "${NO_REPORT:-0}" = "1" ]; then
    python3 factory/report.py --slug "$slug" >/dev/null 2>&1 || true
    return 0
  fi
  python3 factory/report.py --slug "$slug" || true
}

# One-line progress message. Quiet under NO_REPORT.
notify() {
  if [ "${NO_REPORT:-0}" = "1" ]; then
    return 0
  fi
  python3 - "$1" <<'PY' || true
import sys
sys.path.insert(0, "factory")
import report
if not report.send_telegram(sys.argv[1]):
    print(sys.argv[1])
PY
}

# Is the network up at all? Used to tell "no wifi" apart from "this site is
# down", so an offline laptop postpones instead of blocking a good job.
online() {
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 https://api.telegram.org 2>/dev/null)"
  [ "${code:-000}" != "000" ]
}

# Temporary failure: put the job back and try again on the next tick.
postpone() {
  local why="$1"
  echo "postponed: $why"
  python3 factory/queue.py requeue --slug "$slug" >/dev/null 2>&1 || true
  notify "⏸ $name ($slug) postponed — $why. Retrying on the next tick."
  exit 0
}

# Terminal failure: record why, report, and leave cron with a clean exit.
block() {
  local reason="$1"
  echo "blocked: $reason"
  python3 factory/queue.py finish --slug "$slug" --exit-code 1 \
    --log-path "$logdir" --status blocked --reason "$reason" >/dev/null || true
  send_report
  exit 0
}

probe() {
  local url="$1"
  local tries="${PROBE_TRIES:-3}"
  local i=1
  local code=000
  while [ "$i" -le "$tries" ]; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 -L "$url" 2>/dev/null)"
    code="${code:-000}"
    if [ "$code" != "000" ]; then
      printf '%s' "$code"
      return 0
    fi
    i=$((i + 1))
    if [ "$i" -le "$tries" ]; then
      sleep 3
    fi
  done
  printf '%s' "$code"
}

# Preflight: fail in seconds rather than after a paid agent pass. Retries once
# or twice so a DNS blip does not block a good site.
wp_code="$(probe "$wp_url/wp-json/")"
case "$wp_code" in
  000)
    if online; then
      block "unreachable"
    else
      postpone "no network"
    fi
    ;;
  2*) : ;;
  *) block "not-wordpress" ;;
esac

# Classify the site; never reject a shop. A Store API means it is a shop build:
# the base is still neutral and the agent creates the catalogue per the origin's
# IA. `SITE_MODE` selects which phase runs apply (see factory/phases.tsv).
site_mode="content"
store_code="$(probe "$wp_url/wp-json/wc/store/v1/products?per_page=1")"
case "$store_code" in
  2*) site_mode="store" ;;
  401|403) block "store-private" ;;
  000)
    if online; then
      block "store-api-error"
    else
      postpone "no network"
    fi
    ;;
  *) site_mode="content" ;;
esac
echo "site mode: $site_mode"
notify "▶ $name ($slug) — building in $site_mode mode"

# Copy, never clone, so the client repo never contains the factory or the queue.
if [ ! -d "$dir" ]; then
  mkdir -p "$dir"
  tar -C "$ROOT/template" \
    --exclude=node_modules --exclude=.next --exclude=.git \
    -cf - . | tar -C "$dir" -xf -
  (
    cd "$dir"
    git init -q
    git add -A
    git -c user.name="${GIT_AUTHOR_NAME:-site-factory}" \
        -c user.email="${GIT_AUTHOR_EMAIL:-factory@localhost}" \
        commit -qm "base: $slug"
  )
fi

# Per-site build config. The WordPress origin is prospect data, so it lives in
# the site, never in the factory's .env. Keep the agent's edits on resume.
if [ ! -f "$dir/.env.local" ]; then
  cat > "$dir/.env.local" <<EOF
WP_BASE_URL=$wp_url
SITE_MODE=$site_mode
SITE_NAME=$name
SITE_DESCRIPTION=The website for $name.
SITE_URL=http://localhost:3000
SITE_LOCALE=en-IE
EOF
fi

# Keep the mode line authoritative on resume, including sites created before
# SITE_MODE existed.
if grep -q '^SITE_MODE=' "$dir/.env.local" 2>/dev/null; then
  sed -i "s/^SITE_MODE=.*/SITE_MODE=$site_mode/" "$dir/.env.local"
else
  printf 'SITE_MODE=%s\n' "$site_mode" >> "$dir/.env.local"
fi

if [ "${DRY_RUN:-0}" != "1" ] && [ "${SKIP_INSTALL:-0}" != "1" ] \
   && [ ! -d "$dir/node_modules" ] && [ -f "$dir/package-lock.json" ]; then
  if ! ( cd "$dir" && npm ci --prefer-offline --no-audit --no-fund ); then
    block "npm-ci-failed"
  fi
fi

# Status parsing and prompt rendering live in lib.sh so they can be tested
# without claiming a job.
# shellcheck source=factory/lib.sh
. "$ROOT/factory/lib.sh"

# Phase runs, in file order. The `when` column (all|store|content) decides
# applicability: a content site skips 2b/3/4c and the api-map prompt marks them
# SKIPPED. Capability is never removed, only gated.
if [ -n "${PHASES:-}" ]; then
  runs="$PHASES"
else
  runs="$(awk -F'\t' -v mode="$site_mode" '
    !/^#/ && NF >= 2 {
      when = (NF >= 4 && $4 != "") ? $4 : "all"
      if (when != "all" && when != mode) next
      if (!seen[$1]++) printf "%s ", $1
    }' factory/phases.tsv)"
fi

if [ "${DRY_RUN:-0}" = "1" ]; then
  echo "dry run: $slug ($wp_url)"
  echo "phases: $runs"
  echo "--- intake prompt ---"
  render intake
  block "dry-run"
fi

check_phase() {
  ok=1
  failures=""
  local row label require state
  for row in "${rows[@]}"; do
    label="${row%%$'\t'*}"
    require="${row#*$'\t'}"
    [ -n "$label" ] || continue
    state="$(status_get "$label")"
    if ! status_ok "$label"; then
      echo "phase $run: $label is not PASS ($state)"
      ok=0
      failures="$failures $label=$state;"
      continue
    fi
    case "$state" in
      PASS*)
        if [ -n "$require" ] && ! artifact_ok "$require"; then
          echo "phase $run: $label is PASS but artifacts missing or empty: $require"
          ok=0
          failures="$failures $label=missing-artifact;"
        fi
        ;;
    esac
  done
}

for run in $runs; do
  mapfile -t rows < <(awk -F'\t' -v r="$run" \
    '!/^#/ && $1 == r { printf "%s\t%s\n", $2, $3 }' factory/phases.tsv)

  # Resume: a phase that already reached its gate with its artifacts is not
  # re-run after a requeue.
  check_phase
  if [ "$ok" -eq 1 ]; then
    echo "phase $run: already complete, skipping"
    continue
  fi

  python3 factory/queue.py set-phase --slug "$slug" --phase "$run" >/dev/null

  ok=0
  attempt=1
  while [ "$attempt" -le "$PHASE_ATTEMPTS" ]; do
    log="$logdir/$run-$attempt.jsonl"
    prompt="$(render "$run")"
    args=( "$dir" "$slug" "$run" "$log" "$prompt" )
    if [ "$attempt" -gt 1 ]; then
      prompt="$prompt

$(render retry)"
      args=( "$dir" "$slug" "$run" "$log" "$prompt" --continue )
    fi
    echo "phase $run: attempt $attempt ($log)"
    set +e
    timeout "$AGENT_TIMEOUT" bash "$ROOT/factory/agent.sh" "${args[@]}"
    code=$?
    set -e

    if [ "$code" -ne 0 ]; then
      echo "phase $run: agent exited $code"
      # Bad credentials never fix themselves; report it instead of burning
      # two more attempts on the same 401.
      if grep -q 'provider\.auth' "$log" 2>/dev/null; then
        block "provider-auth"
      fi
      notify "⚠️ $name ($slug) — $run attempt $attempt: agent exited $code"
      attempt=$((attempt + 1))
      continue
    fi

    ok=1
    failures=""
    check_phase

    if [ "$ok" -eq 1 ]; then
      break
    fi
    notify "⚠️ $name ($slug) — $run attempt $attempt did not reach PASS.$failures"
    attempt=$((attempt + 1))
  done

  if [ "$ok" -ne 1 ]; then
    block "phase:$run"
  fi
  notify "⏭ $name ($slug) — $run PASS"
done

# Independent gate: never trust the agent's own PASS. What counts as proof
# depends on the site mode, not on the template.
gate_fail=""
if ! grep -Eq '^WP_BASE_URL=.+' "$dir/.env.local" 2>/dev/null; then
  gate_fail="env-local"
fi

non_empty_list() {
  python3 -c 'import json,sys; d=json.load(sys.stdin); sys.exit(0 if isinstance(d, list) and d else 1)'
}

if [ -z "$gate_fail" ]; then
  if [ "$site_mode" = "store" ]; then
    proof_endpoints="wc/store/v1/products"
    missing="empty-catalogue"
  else
    proof_endpoints="wp/v2/pages wp/v2/posts"
    missing="no-content"
  fi

  proof_ok=0
  for endpoint in $proof_endpoints; do
    for _ in 1 2 3; do
      if curl -sSfL --max-time 20 "$wp_url/wp-json/$endpoint?per_page=1" \
          | non_empty_list 2>/dev/null; then
        proof_ok=1
        break 2
      fi
      sleep 3
    done
  done

  if [ "$proof_ok" -ne 1 ]; then
    gate_fail="$missing"
  fi
fi

if [ -z "$gate_fail" ] && [ ! -f "$dir/.next/BUILD_ID" ]; then
  gate_fail="no-build"
fi

if [ -n "$gate_fail" ]; then
  if ! online; then
    postpone "no network at gate"
  fi
  block "$gate_fail"
fi

python3 factory/queue.py finish --slug "$slug" --exit-code 0 \
  --log-path "$logdir" --status done --phase complete >/dev/null
send_report

exit 0
