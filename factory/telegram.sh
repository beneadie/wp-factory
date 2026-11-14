#!/usr/bin/env bash
# Run the Telegram bot with the repo's .env loaded.
#   factory/telegram.sh --loop
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ -f "$ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$ROOT/.env"
  set +a
fi

if [ -z "${TELEGRAM_BOT_TOKEN:-}" ]; then
  echo "TELEGRAM_BOT_TOKEN is not set (.env missing or empty)" >&2
  exit 1
fi

exec python3 factory/telegram.py "$@"
