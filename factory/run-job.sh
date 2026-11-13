#!/usr/bin/env bash
# Claim one queued job, copy the template into sites/<slug>, run the agent,
# record the result. Safe to call from cron: it exits if a job is already running.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
mkdir -p logs sites

exec 9>"$ROOT/.factory.lock"
if ! flock -n 9; then
  echo "a build is already running"
  exit 0
fi

job="$(python3 factory/queue.py take-next)"
if [ -z "$job" ]; then
  exit 0
fi

read_field() {
  printf '%s' "$job" | python3 -c "import json,sys; print(json.load(sys.stdin).get('$1') or '')"
}

slug="$(read_field slug)"
name="$(read_field name)"
wp_url="$(read_field wp_url)"
niche="$(read_field niche)"
dir="$ROOT/sites/$slug"
log="$ROOT/logs/$slug.jsonl"

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

prompt="Build the storefront for ${name} from the WordPress origin ${wp_url}.
Follow the project-orchestrator skill, then wp-intake, then build the base.
Fill in src/config/site.ts, keep this site's discovered facts in docs/site/,
and update docs/site/00-status.md when you finish.
Niche: ${niche:-unknown}."

set +e
if command -v systemd-inhibit >/dev/null 2>&1; then
  systemd-inhibit --what=sleep:idle --why="site-factory: $slug" \
    bash "$ROOT/factory/agent.sh" "$slug" "$dir" "$prompt" "$log"
else
  bash "$ROOT/factory/agent.sh" "$slug" "$dir" "$prompt" "$log"
fi
code=$?
set -e

python3 factory/queue.py finish --slug "$slug" --exit-code "$code" --log-path "$log" >/dev/null
python3 factory/report.py --slug "$slug" || true

exit 0
