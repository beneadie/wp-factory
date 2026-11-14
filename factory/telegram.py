#!/usr/bin/env python3
"""Minimal Telegram front end: enqueue jobs, check status.

Long-polls Telegram, so it needs no public URL. State (the update offset) lives
in the queue database, so restarting this process never replays a job.

    /build <wp_url> <name>      e.g. /build https://acme.ie Acme Wool
    /jobs                       last 10 jobs
    /status <slug>              one job

If you already have a scouting bot, it does not need this file: have it call
`python3 factory/queue.py add --slug ... --name ... --wp-url ...` directly.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import time
import urllib.parse
import urllib.request

import queue as job_queue

API = "https://api.telegram.org/bot{token}/{method}"
HELP = (
    "Commands:\n"
    "/build <wp_url> <name> — queue a site\n"
    "/jobs — recent jobs\n"
    "/status <slug> — one job"
)


def api(token: str, method: str, **payload) -> dict:
    data = urllib.parse.urlencode(payload).encode()
    request = urllib.request.Request(API.format(token=token, method=method), data=data)
    with urllib.request.urlopen(request, timeout=70) as response:
        return json.load(response)


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:48] or "site"


def handle(token: str, chat_id: int, text: str) -> None:
    parts = text.strip().split()
    command = parts[0].split("@")[0].lower() if parts else ""

    if command == "/start" or command == "/help":
        reply = HELP
    elif command == "/build" and len(parts) >= 3:
        wp_url = parts[1].rstrip("/")
        name = " ".join(parts[2:])
        job = job_queue.enqueue(slugify(name), name, wp_url)
        reply = f"Queued {job['name']} ({job['slug']}) for {job['wp_url']}."
    elif command == "/jobs":
        rows = job_queue.list_jobs()[:10]
        reply = "\n".join(
            f"{r['status']:<8} {r['slug']}  {r['wp_url']}" for r in rows
        ) or "No jobs yet."
    elif command == "/status" and len(parts) == 2:
        job = job_queue.get_job(parts[1])
        reply = (
            json.dumps(
                {k: job[k] for k in ("slug", "status", "phase", "reason", "exit_code", "started_at", "finished_at")},
                indent=2,
            )
            if job
            else f"No job named {parts[1]}."
        )
    else:
        reply = HELP

    api(token, "sendMessage", chat_id=chat_id, text=reply)


def poll_once(token: str) -> int:
    offset = job_queue.get_meta("telegram_offset")
    payload = {"timeout": 50, "allowed_updates": json.dumps(["message"])}
    if offset:
        payload["offset"] = offset

    updates = api(token, "getUpdates", **payload).get("result", [])
    for update in updates:
        job_queue.set_meta("telegram_offset", str(update["update_id"] + 1))
        message = update.get("message")
        if not message or "text" not in message:
            continue
        handle(token, message["chat"]["id"], message["text"])
    return len(updates)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--loop", action="store_true", help="keep polling")
    parser.add_argument("--interval", type=int, default=5)
    args = parser.parse_args()

    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    if not token:
        print("TELEGRAM_BOT_TOKEN is not set")
        return 1

    while True:
        try:
            poll_once(token)
        except Exception as error:  # network blips should not kill the loop
            print(f"poll failed: {error}", flush=True)
        if not args.loop:
            return 0
        time.sleep(args.interval)


if __name__ == "__main__":
    raise SystemExit(main())
