#!/usr/bin/env python3
"""Job queue for the site factory. SQLite, stdlib only.

Telegram is the UI. This database is the queue of record: a job exists here
before any agent starts, so a crash or a reboot never loses work.

Statuses: queued -> running -> done | failed | blocked.
`blocked` means the runner's gate refused the build (not WordPress, no Store
API, empty catalogue, no build output) or a phase used up its attempts. A
blocked job is terminal; `requeue` puts it back in the queue.
"""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "queue.db"
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")

# Columns added after the first release. `migrate` ALTERs them into older DBs
# because CREATE TABLE IF NOT EXISTS never changes an existing table.
LATE_COLUMNS = {
    "phase": "TEXT",
    "reason": "TEXT",
}

SCHEMA = """
CREATE TABLE IF NOT EXISTS jobs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  wp_url      TEXT NOT NULL,
  niche       TEXT,
  notes       TEXT,
  repo        TEXT,
  status      TEXT NOT NULL DEFAULT 'queued',
  exit_code   INTEGER,
  log_path    TEXT,
  phase       TEXT,
  reason      TEXT,
  created_at  TEXT NOT NULL,
  started_at  TEXT,
  finished_at TEXT
);
CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
"""


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def migrate(conn: sqlite3.Connection) -> None:
    existing = {row["name"] for row in conn.execute("PRAGMA table_info(jobs)")}
    for name, kind in LATE_COLUMNS.items():
        if name not in existing:
            conn.execute(f"ALTER TABLE jobs ADD COLUMN {name} {kind}")


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    migrate(conn)
    return conn


def as_dict(row: sqlite3.Row | None) -> dict | None:
    return dict(row) if row is not None else None


def enqueue(slug: str, name: str, wp_url: str, niche: str | None = None,
            notes: str | None = None, repo: str | None = None) -> dict:
    if not SLUG_RE.match(slug):
        raise SystemExit(f"invalid slug: {slug!r} (use a-z, 0-9, dashes)")
    with connect() as conn:
        existing = conn.execute("SELECT * FROM jobs WHERE slug = ?", (slug,)).fetchone()
        if existing:
            return as_dict(existing)
        conn.execute(
            "INSERT INTO jobs (slug, name, wp_url, niche, notes, repo, created_at)"
            " VALUES (?, ?, ?, ?, ?, ?, ?)",
            (slug, name, wp_url.rstrip("/"), niche, notes, repo, now()),
        )
        return as_dict(conn.execute("SELECT * FROM jobs WHERE slug = ?", (slug,)).fetchone())


def take_next() -> dict | None:
    """Atomically claim the oldest queued job."""
    with connect() as conn:
        conn.execute("BEGIN IMMEDIATE")
        row = conn.execute(
            "SELECT * FROM jobs WHERE status = 'queued' ORDER BY id LIMIT 1"
        ).fetchone()
        if row is None:
            return None
        conn.execute(
            "UPDATE jobs SET status = 'running', started_at = ?, reason = NULL, phase = NULL"
            " WHERE id = ?",
            (now(), row["id"]),
        )
        return as_dict(conn.execute("SELECT * FROM jobs WHERE id = ?", (row["id"],)).fetchone())


def finish(slug: str, exit_code: int, log_path: str | None = None,
           status: str | None = None, reason: str | None = None,
           phase: str | None = None) -> dict | None:
    """Record the outcome. `status` overrides the exit-code guess (e.g. blocked)."""
    if status is None:
        status = "done" if exit_code == 0 else "failed"
    with connect() as conn:
        conn.execute(
            "UPDATE jobs SET status = ?, exit_code = ?, log_path = ?,"
            " phase = COALESCE(?, phase), reason = ?, finished_at = ?"
            " WHERE slug = ?",
            (status, exit_code, log_path, phase, reason, now(), slug),
        )
        return as_dict(conn.execute("SELECT * FROM jobs WHERE slug = ?", (slug,)).fetchone())


def set_phase(slug: str, phase: str) -> None:
    with connect() as conn:
        conn.execute("UPDATE jobs SET phase = ? WHERE slug = ?", (phase, slug))


def requeue(slug: str) -> dict | None:
    with connect() as conn:
        conn.execute(
            "UPDATE jobs SET status = 'queued', exit_code = NULL, phase = NULL,"
            " reason = NULL, started_at = NULL, finished_at = NULL"
            " WHERE slug = ?",
            (slug,),
        )
        return as_dict(conn.execute("SELECT * FROM jobs WHERE slug = ?", (slug,)).fetchone())


def reap(older_hours: float = 6.0) -> list[str]:
    """Put jobs left `running` by a crash, reboot or sleep back in the queue."""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=older_hours)
    reaped: list[str] = []
    with connect() as conn:
        rows = conn.execute("SELECT * FROM jobs WHERE status = 'running'").fetchall()
        for row in rows:
            started = row["started_at"]
            stale = True
            if started:
                try:
                    stale = datetime.fromisoformat(started) < cutoff
                except ValueError:
                    stale = True
            if stale:
                conn.execute(
                    "UPDATE jobs SET status = 'queued', started_at = NULL,"
                    " phase = NULL, reason = ? WHERE id = ?",
                    ("stale-run", row["id"]),
                )
                reaped.append(row["slug"])
    return reaped


def remove(slug: str) -> bool:
    with connect() as conn:
        return conn.execute("DELETE FROM jobs WHERE slug = ?", (slug,)).rowcount > 0


def list_jobs(status: str | None = None) -> list[dict]:
    query = "SELECT * FROM jobs"
    params: tuple = ()
    if status:
        query += " WHERE status = ?"
        params = (status,)
    query += " ORDER BY id DESC"
    with connect() as conn:
        return [dict(r) for r in conn.execute(query, params).fetchall()]


def get_job(slug: str) -> dict | None:
    with connect() as conn:
        return as_dict(conn.execute("SELECT * FROM jobs WHERE slug = ?", (slug,)).fetchone())


def set_meta(key: str, value: str) -> None:
    with connect() as conn:
        conn.execute(
            "INSERT INTO meta (key, value) VALUES (?, ?)"
            " ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (key, value),
        )


def get_meta(key: str) -> str | None:
    with connect() as conn:
        row = conn.execute("SELECT value FROM meta WHERE key = ?", (key,)).fetchone()
        return row["value"] if row else None


def main() -> int:
    parser = argparse.ArgumentParser(description="Site factory job queue")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add")
    add.add_argument("--slug", required=True)
    add.add_argument("--name", required=True)
    add.add_argument("--wp-url", required=True)
    add.add_argument("--niche")
    add.add_argument("--notes")
    add.add_argument("--repo")

    sub.add_parser("take-next")

    done = sub.add_parser("finish")
    done.add_argument("--slug", required=True)
    done.add_argument("--exit-code", type=int, required=True)
    done.add_argument("--log-path")
    done.add_argument("--status", choices=["done", "failed", "blocked"])
    done.add_argument("--reason")
    done.add_argument("--phase")

    phase = sub.add_parser("set-phase")
    phase.add_argument("--slug", required=True)
    phase.add_argument("--phase", required=True)

    again = sub.add_parser("requeue")
    again.add_argument("--slug", required=True)

    sweep = sub.add_parser("reap")
    sweep.add_argument("--older-hours", type=float, default=6.0)

    drop = sub.add_parser("remove")
    drop.add_argument("--slug", required=True)

    ls = sub.add_parser("list")
    ls.add_argument("--status")

    get = sub.add_parser("get")
    get.add_argument("--slug", required=True)

    meta_set = sub.add_parser("set-meta")
    meta_set.add_argument("--key", required=True)
    meta_set.add_argument("--value", required=True)

    meta_get = sub.add_parser("get-meta")
    meta_get.add_argument("--key", required=True)

    args = parser.parse_args()

    if args.command == "add":
        print(json.dumps(enqueue(args.slug, args.name, args.wp_url, args.niche,
                                 args.notes, args.repo)))
    elif args.command == "take-next":
        job = take_next()
        if job:
            print(json.dumps(job))
    elif args.command == "finish":
        print(json.dumps(finish(args.slug, args.exit_code, args.log_path,
                                args.status, args.reason, args.phase)))
    elif args.command == "set-phase":
        set_phase(args.slug, args.phase)
    elif args.command == "requeue":
        print(json.dumps(requeue(args.slug)))
    elif args.command == "reap":
        print(json.dumps({"reaped": reap(args.older_hours)}))
    elif args.command == "remove":
        print(json.dumps({"removed": remove(args.slug)}))
    elif args.command == "list":
        print(json.dumps(list_jobs(args.status), indent=2))
    elif args.command == "get":
        job = get_job(args.slug)
        if job:
            print(json.dumps(job))
        else:
            return 1
    elif args.command == "set-meta":
        set_meta(args.key, args.value)
    elif args.command == "get-meta":
        value = get_meta(args.key)
        if value is not None:
            print(value)
    return 0


if __name__ == "__main__":
    sys.exit(main())
