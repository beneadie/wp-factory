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
job_template="$(read_field template)"
dir=""
site_existed=0
if [ -d "$ROOT/sites/$slug" ]; then
  # Legacy location, from before SITES_ROOT existed.
  dir="$ROOT/sites/$slug"
else
  dir="$SITES_ROOT/$slug"
fi
if [ -d "$dir" ]; then
  site_existed=1
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
  if [ -n "$job_template" ]; then
    printf 'TEMPLATE=%s\n' "$job_template" >> "$dir/.env.local"
  fi
fi

# Keep the mode line authoritative on resume, including sites created before
# SITE_MODE existed.
if grep -q '^SITE_MODE=' "$dir/.env.local" 2>/dev/null; then
  sed -i "s/^SITE_MODE=.*/SITE_MODE=$site_mode/" "$dir/.env.local"
else
  printf 'SITE_MODE=%s\n' "$site_mode" >> "$dir/.env.local"
fi

# Template choice follows the same rule: an explicit job value wins, otherwise
# a value already in the site stays authoritative. It is resolved from evidence
# only when the site has none (see choose_template below).
read_env_template() {
  [ -f "$dir/.env.local" ] || return 0
  awk -F= '$1 == "TEMPLATE" { sub(/^[^=]*=/, ""); sub(/\r$/, ""); print; exit }' "$dir/.env.local"
}

set_env_template() {
  local value="$1"
  if grep -q '^TEMPLATE=' "$dir/.env.local" 2>/dev/null; then
    sed -i "s/^TEMPLATE=.*/TEMPLATE=$value/" "$dir/.env.local"
  else
    printf 'TEMPLATE=%s\n' "$value" >> "$dir/.env.local"
  fi
}

validate_template_name() {
  local value="$1"
  [ -n "$value" ] || return 1
  case "$value" in
    *[!a-z0-9-]*) return 1 ;;
    [!a-z0-9]*) return 1 ;;
  esac
  return 0
}

TEMPLATE="$(read_env_template || true)"
if [ -n "$job_template" ]; then
  if ! validate_template_name "$job_template"; then
    block "template-invalid"
  fi
  TEMPLATE="$job_template"
  set_env_template "$TEMPLATE"
fi
if ! validate_template_name "$TEMPLATE"; then
  # A hand-edited .env.local must not become a path traversal.
  TEMPLATE=""
fi

composed_template=""
synclog="$logdir/sync.log"
compose_log="$logdir/compose.log"

# regenerated artifacts are separate from client artifacts; never write client state into a regenerated file.
#
#   regenerated on every run: src/styles/theme.base.css, src/config/theme.ts,
#                             src/template-sections/, docs/site/template.md,
#                             docs/site/reference/
#   client-owned, never touched by compose: src/styles/theme.css,
#                             docs/site/design-notes.md
#
# theme.base.css is the template skin. theme.css is the origin's values, created
# once by the factory and edited only by the design pass.
compose_regenerated_file() {
  local from="$1" to="$2" label="$3"
  if [ ! -f "$from" ]; then
    echo "skip $label: not in template" >> "$compose_log"
    return 0
  fi
  mkdir -p "$(dirname "$to")"
  if cmp -s "$from" "$to" 2>/dev/null; then
    echo "unchanged $label" >> "$compose_log"
  else
    cp "$from" "$to"
    echo "regenerated $label" >> "$compose_log"
  fi
}

ensure_client_theme() {
  local target="$dir/src/styles/theme.css"
  if [ -f "$target" ]; then
    echo "kept client-owned src/styles/theme.css" >> "$compose_log"
    return 0
  fi
  mkdir -p "$dir/src/styles"
  cat > "$target" <<'EOF'
/* theme.css — CLIENT brand overrides only.
 *
 * Created once for this site. The design pass writes the origin's palette and
 * type here as token VALUES in one :root block. Never rename a token.
 *
 * Never edit src/styles/theme.base.css, src/config/theme.ts or
 * src/template-sections/: those are regenerated from the template on every
 * run. Client-only decisions belong here and in docs/site/design-notes.md.
 */
EOF
  echo "created client-owned src/styles/theme.css" >> "$compose_log"
}

compose_tree() {
  local from="$1" to="$2" label="$3"
  mkdir -p "$(dirname "$to")"
  if command -v rsync >/dev/null 2>&1; then
    if rsync -a --delete "$from/" "$to/" >> "$compose_log" 2>&1; then
      echo "composed $label" >> "$compose_log"
      return 0
    fi
    echo "rsync failed for $label; using cp" >> "$compose_log"
  fi
  case "$to" in
    "$dir"/*) rm -rf "$to" ;;
    *)
      echo "refusing to replace $to" >> "$compose_log"
      return 1
      ;;
  esac
  mkdir -p "$to"
  cp -a "$from/." "$to/" >> "$compose_log" 2>&1
  echo "composed $label (cp fallback)" >> "$compose_log"
}

compose_overlay() {
  [ -n "$TEMPLATE" ] || return 0
  local src="$ROOT/templates/$TEMPLATE"
  if [ ! -f "$src/theme.css" ] || [ ! -f "$src/sections/index.ts" ]; then
    echo "template-missing: $TEMPLATE (need $src/theme.css and $src/sections/index.ts)" \
      | tee -a "$compose_log" >&2
    block "template-missing"
  fi

  : > "$compose_log"
  echo "template: $TEMPLATE" >> "$compose_log"
  mkdir -p "$dir/src/styles" "$dir/src/template-sections" "$dir/src/config" \
    "$dir/docs/site"

  # Template-owned: regenerated from templates/<name>/ on every run.
  compose_regenerated_file "$src/theme.css" "$dir/src/styles/theme.base.css" \
    "src/styles/theme.base.css"
  compose_regenerated_file "$src/theme.ts" "$dir/src/config/theme.ts" \
    "src/config/theme.ts"
  compose_regenerated_file "$src/design.md" "$dir/docs/site/template.md" \
    "docs/site/template.md"

  # Client-owned: created once, then never overwritten. The design pass owns
  # the token values in this file.
  ensure_client_theme

  # The reference record is optional, but when an overlay ships one it belongs
  # with the site so the design pass can read what the look came from.
  if [ -d "$src/reference" ]; then
    compose_tree "$src/reference" "$dir/docs/site/reference" "docs/site/reference"
  fi

  # Section components are template-owned, not agent-authored. A re-compose is
  # authoritative for this directory.
  compose_tree "$src/sections" "$dir/src/template-sections" "src/template-sections"
  echo "template: composed $TEMPLATE" >> "$compose_log"
}

compose_if_ready() {
  [ -n "$TEMPLATE" ] || return 0
  [ "$composed_template" = "$TEMPLATE" ] && return 0
  compose_overlay
  composed_template="$TEMPLATE"
}

# No TEMPLATE and no explicit job value: use discovery evidence. The helper
# writes docs/site/template-choice.md, including the weak-evidence fallback.
choose_template() {
  [ -n "$TEMPLATE" ] && return 0
  local choice=""
  mkdir -p "$dir/docs/site"
  choice="$(python3 "$ROOT/factory/template_choice.py" --site "$dir" --slug "$slug" \
    --write 2>>"$logdir/template-choice.log" | tail -n 1)" || choice=""
  if [ -z "$choice" ]; then
    choice="practice"
    cat > "$dir/docs/site/template-choice.md" <<EOF
# Template choice — $slug

Chosen: \`practice\`
Confidence: weak

The evidence helper produced no result, so the factory defaulted to \`practice\`
rather than guessing. Set \`TEMPLATE\` in \`.env.local\` to override.
EOF
  fi
  if ! validate_template_name "$choice"; then
    block "template-invalid"
  fi
  TEMPLATE="$choice"
  set_env_template "$TEMPLATE"
  echo "template: chose $TEMPLATE from discovery evidence (docs/site/template-choice.md)"
}

# On a resume, discovery evidence may already be on disk. Resolve it before the
# first phase runs, so the overlay is in place even for a retried base pass.
if [ -z "$TEMPLATE" ] && [ "$site_existed" -eq 1 ] \
   && { [ -f "$dir/docs/wp-discovery/site-profile.md" ] \
        || [ -f "$dir/docs/wp-discovery/capability-register.md" ]; }; then
  choose_template
fi

compose_if_ready

# Re-copy the skill set and agent config before every attempt. The template is
# authoritative for .opencode/ and opencode.json; the site's docs/ and src/ are
# never touched here. Only the two paths below are synced.
sync_tree() {
  local src="$1" dst="$2" label="$3"
  if [ ! -d "$src" ]; then
    echo "skip $label: template source missing" >> "$synclog"
    return 0
  fi
  if command -v rsync >/dev/null 2>&1; then
    local changes
    changes="$(rsync -ain --delete "$src/" "$dst/" 2>/dev/null || true)"
    if [ -z "$changes" ]; then
      echo "unchanged $label" >> "$synclog"
      return 0
    fi
    mkdir -p "$dst"
    if ! rsync -a --delete "$src/" "$dst/" >> "$synclog" 2>&1; then
      echo "sync failed: $label" >> "$synclog"
      return 1
    fi
    echo "synced $label ($(printf '%s\n' "$changes" | wc -l | tr -d ' ') changes)" >> "$synclog"
  else
    if command -v diff >/dev/null 2>&1 && [ -d "$dst" ] \
       && diff -qr "$src" "$dst" >/dev/null 2>&1; then
      echo "unchanged $label" >> "$synclog"
      return 0
    fi
    case "$dst" in
      "$dir"/*) rm -rf "$dst" ;;
      *)
        echo "refusing to replace $dst" >> "$synclog"
        return 1
        ;;
    esac
    mkdir -p "$dst"
    if ! cp -a "$src/." "$dst/" >> "$synclog" 2>&1; then
      echo "sync failed: $label (cp fallback)" >> "$synclog"
      return 1
    fi
    echo "synced $label (cp fallback)" >> "$synclog"
  fi
}

sync_file() {
  local src="$1" dst="$2" label="$3"
  if [ ! -f "$src" ]; then
    echo "skip $label: template source missing" >> "$synclog"
    return 0
  fi
  if [ -f "$dst" ] && cmp -s "$src" "$dst"; then
    echo "unchanged $label" >> "$synclog"
  else
    mkdir -p "$(dirname "$dst")"
    if ! cp "$src" "$dst"; then
      echo "sync failed: $label" >> "$synclog"
      return 1
    fi
    echo "synced $label" >> "$synclog"
  fi
}

sync_template() {
  : > "$synclog"
  printf 'sync %s template=%s\n' "$(date -u +%FT%TZ)" "${TEMPLATE:-unset}" >> "$synclog"
  sync_tree "$ROOT/template/.opencode" "$dir/.opencode" ".opencode"
  sync_file "$ROOT/template/opencode.json" "$dir/opencode.json" "opencode.json"
}

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

  # Base needs the composed overlay, so resolve a missing template from the
  # evidence intake has just written before the first build phase launches.
  if [ -z "$TEMPLATE" ] && [ "$run" != "intake" ]; then
    choose_template
    compose_if_ready
  fi

  python3 factory/queue.py set-phase --slug "$slug" --phase "$run" >/dev/null

  ok=0
  attempt=1
  while [ "$attempt" -le "$PHASE_ATTEMPTS" ]; do
    log="$logdir/$run-$attempt.jsonl"
    # Template skills/config can change while a build is running. Sync before
    # every attempt, not just at setup, so a running site sees the current set.
    if ! sync_template; then
      block "sync-failed"
    fi
    prompt="$(render "$run")"
    if [ "$run" = "base" ]; then
      # The design pass is a sub-step of the same agent session, not a phase.
      prompt="$prompt

$(render design)"
    fi
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
