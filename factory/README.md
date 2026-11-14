# Factory

The automation. It never renders a page; it moves work.

| File | Purpose |
|---|---|
| `queue.py` | SQLite job queue. Add, claim, set phase, finish, requeue, remove, list. |
| `run-job.sh` | One job: preflight → copy template → `npm ci` → phases → gate → record → report. `flock`-guarded. |
| `phases.tsv` | Which agent runs a job has, which status lines each owns, and the artifacts each must leave. |
| `prompts/` | One prompt per phase run, plus the retry continuation prompt. |
| `agent.sh` | A single `opencode run` pass for one phase, kept separate so `systemd-inhibit` can wrap it. |
| `lib.sh` | Status-file parsing and prompt rendering, sourced by `run-job.sh`. |
| `telegram.sh` | Runs the bot with `.env` loaded, so the token does not have to be exported by hand. |
| `report.py` | Reads the job + `00-status.md`, sends the summary to Telegram. |
| `telegram.py` | Long-polling bot: `/build`, `/jobs`, `/status`. |
| `job.schema.json` | The contract between the transport and the runner. |

## Design decisions

- **Telegram is the UI, SQLite is the queue.** The offset and the job rows are
  persisted, so a reboot mid-build loses nothing and never double-runs.
- **Copy, not clone.** `tar` the template into `sites/<slug>` and `git init`
  there, so client repos never contain the factory, the token, or the queue.
- **Prospect data lives in the queue, secrets live in `.env`.** The WordPress
  origin is per-job (`jobs.wp_url` → `sites/<slug>/.env.local`); the factory
  `.env` holds only ops credentials and the model.
- **Mode is classified, not assumed.** Preflight sets `SITE_MODE=store` when the
  Store API answers and `content` otherwise, writes it into `.env.local`, and
  the gate follows: a non-empty catalogue for stores, real pages or posts for
  content sites. Agents are told never to scaffold commerce in content mode.
- **One job at a time.** `flock` on `.factory.lock`; a second invocation exits 0
  rather than starting a competing agent.
- **Small sessions, artifact handoffs.** `intake`, `api-map`, `commerce`,
  `spikes`, `base`, `substrate`, `verify` each get a fresh OpenCode session, 2–3
  skills at most. Handoff is `docs/site/00-status.md` plus the files in
  `prompts/`; content sites skip `commerce` and `spikes`.
- **A phase needs its artifact, not just PASS.** `phases.tsv` lists the files
  each label must leave behind; `lib.sh:artifact_ok` rejects a PASS with a
  missing or stub-sized handoff, so the next session cannot start blind.
- **Retry, then block.** A phase gets `PHASE_ATTEMPTS` tries (the second onward
  continues the same session) before the job is marked `blocked` with the
  phase as the reason.
- **No gates in the agent.** The runner checks the outcome independently: phase
  lines must be PASS/SKIPPED, `.env.local` must carry `WP_BASE_URL`, the Store
  API must return products, and `.next/BUILD_ID` must exist. Exit 0 alone is
  not success.
- **Resume is by directory, not session id.** `opencode run -c` in the site
  folder continues that site's last session, which is the phase being retried.
