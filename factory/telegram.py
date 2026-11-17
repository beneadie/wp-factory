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
    "/build <url> [name] — queue a site (name is optional)\n"
    "/jobs — recent jobs\n"
    "/status <slug> — one job"
)


def name_from_url(value: str) -> str:
    """A readable fallback client name from a domain."""
    host = re.sub(r"^[a-z]+://", "", value.strip(), flags=re.I)
    host = host.split("/")[0].split(":")[0].lower()
    if host.startswith("www."):
        host = host[4:]
    base = host.split(".")[0] or host
    return base.replace("-", " ").replace("_", " ").title() or "New Site"


def api(token: str, method: str, **payload) -> dict:
    data = urllib.parse.urlencode(payload).encode()
    request = urllib.request.Request(API.format(token=token, method=method), data=data)
    with urllib.request.urlopen(request, timeout=70) as response:
        return json.load(response)


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:48] or "site"


def parse_chat_ids(raw: str) -> set[int]:
    """Parse a comma-separated allowlist. Invalid entries are ignored loudly."""
    allowed: set[int] = set()
    for part in raw.replace(";", ",").split(","):
        part = part.strip()
        if not part:
            continue
        try:
            allowed.add(int(part))
        except ValueError:
            print(f"ignoring invalid chat id: {part!r}", flush=True)
    return allowed


def allowed_chat_ids() -> set[int]:
    """Who may use the bot: the explicit list, else the report chat id."""
    raw = os.environ.get("TELEGRAM_ALLOWED_CHAT_IDS", "").strip()
    if not raw:
        raw = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
    return parse_chat_ids(raw)


def is_authorized(message: dict, allowed: set[int]) -> bool:
    """Private chat only, and the chat id must be in the allowlist."""
    chat = message.get("chat") or {}
    if chat.get("type") != "private":
        return False
    chat_id = chat.get("id")
    return isinstance(chat_id, int) and chat_id in allowed


def handle(token: str, chat_id: int, text: str) -> None:
    parts = text.strip().split()
    command = parts[0].split("@")[0].lower() if parts else ""

    if command == "/start" or command == "/help":
        reply = HELP
    elif command == "/build":
        if len(parts) < 2:
            reply = (
                "Usage: /build <url> [name]\n"
                "Example: /build https://acme.ie Acme Wool"
            )
        else:
            wp_url = parts[1]
            name = " ".join(parts[2:]).strip() or name_from_url(wp_url)
            try:
                job = job_queue.enqueue(slugify(name), name, wp_url)
                reply = f"Queued {job['name']} ({job['slug']}) for {job['wp_url']}."
            except SystemExit as error:
                reply = f"Could not queue that: {error}"
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


def poll_once(token: str, allowed: set[int]) -> int:
    offset = job_queue.get_meta("telegram_offset")
    payload = {"timeout": 50, "allowed_updates": json.dumps(["message"])}
    if offset:
        payload["offset"] = offset

    updates = api(token, "getUpdates", **payload).get("result", [])
    for update in updates:
        job_queue.set_meta("telegram_offset", str(update["update_id"] + 1))
        message = update.get("message")
        if not message:
            continue
        if not is_authorized(message, allowed):
            chat = message.get("chat") or {}
            print(
                f"ignored message from chat {chat.get('id')} "
                f"({chat.get('type') or 'unknown'})",
                flush=True,
            )
            continue
        if "text" not in message:
            if any(key in message for key in ("document", "photo", "video", "audio")):
                api(
                    token, "sendMessage", chat_id=message["chat"]["id"],
                    text="I only take text commands. Send /build <url> [name]; "
                         "CSV import is not built yet.",
                )
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

    allowed = allowed_chat_ids()
    if not allowed:
        print(
            "TELEGRAM_CHAT_ID or TELEGRAM_ALLOWED_CHAT_IDS is not set; "
            "refusing to run an open bot"
        )
        return 1

    while True:
        try:
            poll_once(token, allowed)
        except Exception as error:  # network blips should not kill the loop
            print(f"poll failed: {error}", flush=True)
        if not args.loop:
            return 0
        time.sleep(args.interval)


if __name__ == "__main__":
    raise SystemExit(main())
