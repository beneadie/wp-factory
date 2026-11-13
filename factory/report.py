#!/usr/bin/env python3
"""Report a finished job to Telegram (or stdout when no credentials are set)."""

from __future__ import annotations

import argparse
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

import queue as job_queue


def read_status(slug: str) -> str:
    path = Path(__file__).resolve().parent.parent / "sites" / slug / "docs" / "site" / "00-status.md"
    if not path.exists():
        return ""
    lines = [line.rstrip() for line in path.read_text().splitlines() if line.strip()]
    return "\n".join(lines[:14])


def tail(path: str, limit: int = 12) -> str:
    if not path or not Path(path).exists():
        return ""
    lines = Path(path).read_text(errors="replace").splitlines()
    return "\n".join(lines[-limit:])


def build_message(job: dict) -> str:
    icon = {"done": "✅", "failed": "❌"}.get(job["status"], "•")
    parts = [
        f"{icon} {job['name']} ({job['slug']}) — {job['status']}",
        f"WP: {job['wp_url']}",
    ]
    if job.get("exit_code") not in (None, 0):
        parts.append(f"exit code: {job['exit_code']}")
    status = read_status(job["slug"])
    if status:
        parts += ["", status]
    if job["status"] != "done":
        log_tail = tail(job.get("log_path") or "")
        if log_tail:
            parts += ["", log_tail]
    parts += ["", f"Open: cd sites/{job['slug']} && opencode"]
    return "\n".join(parts)


def send_telegram(text: str) -> bool:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return False
    data = urllib.parse.urlencode(
        {"chat_id": chat_id, "text": text, "disable_web_page_preview": "true"}
    ).encode()
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage", data=data
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.status == 200


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", required=True)
    args = parser.parse_args()

    job = job_queue.get_job(args.slug)
    if job is None:
        print(f"no job named {args.slug}", flush=True)
        return 1

    message = build_message(job)
    if not send_telegram(message):
        print(message, flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
