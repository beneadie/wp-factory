# Factory

The automation. It never renders a page; it moves work.

| File | Purpose |
|---|---|
| `queue.py` | SQLite job queue. Add, claim, finish, list. |
| `run-job.sh` | One job: claim → copy template → run agent → record result → report. `flock`-guarded. |
| `agent.sh` | The `opencode run` invocation, kept separate so `systemd-inhibit` can wrap it. |
| `report.py` | Reads the job + `00-status.md`, sends the summary to Telegram. |
| `telegram.py` | Long-polling bot: `/build`, `/jobs`, `/status`. |
| `job.schema.json` | The contract between the transport and the runner. |

## Design decisions

- **Telegram is the UI, SQLite is the queue.** The offset and the job rows are
  persisted, so a reboot mid-build loses nothing and never double-runs.
- **Copy, not clone.** `tar` the template into `sites/<slug>` and `git init`
  there, so client repos never contain the factory, the token, or the queue.
- **One job at a time.** `flock` on `.factory.lock`; a second invocation exits 0
  rather than starting a competing agent.
- **No gates in the runner.** Success means the agent exited 0. The skills define
  quality; the runner only reports what happened.
- **Resume is by directory, not session id.** `opencode run -c` in the site
  folder continues that site's last session.
