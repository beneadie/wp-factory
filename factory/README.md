# Factory

The automation. It never renders a page; it moves work.

| File | Purpose |
|---|---|
| `queue.py` | SQLite job queue. Add, claim, set phase, finish, requeue, remove, list. |
| `run-job.sh` | One job: preflight → copy template → `npm ci` → phases → gate → record → report. `flock`-guarded. |
| `phases.tsv` | Which agent runs a job has, which status lines each owns, the artifacts each must leave, and the `when` mode that gates each run. |
| `prompts/` | One prompt per phase run, plus the retry prompt. Store-only prompts are listed in `phases.tsv` with `when=store`. |
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
- **Mode is classified, not assumed.** Preflight records `SITE_MODE` from a
  Store API probe. Both outcomes are normal: `store` runs the commerce phases,
  `content` marks them SKIPPED. The gate follows the mode — a non-empty catalogue
  for a store, real pages or posts for content.
- **One job at a time.** `flock` on `.factory.lock`; a second invocation exits 0
  rather than starting a competing agent.
- **Small sessions, artifact handoffs.** `intake`, `api-map`, `base`, `substrate`,
  `verify` each get a fresh OpenCode session, and `commerce`, `spikes` and
  `commerce-build` run only for a store. Handoff is `docs/site/00-status.md` plus
  the files in `prompts/`.
- **A phase needs its artifact, not just PASS.** `phases.tsv` lists the files
  each label must leave behind; `lib.sh:artifact_ok` rejects a PASS with a
  missing or stub-sized handoff, so the next session cannot start blind.
- **Retry, then block.** A phase gets `PHASE_ATTEMPTS` tries (the second onward
  continues the same session) before the job is marked `blocked` with the
  phase as the reason.
- **No gates in the agent.** The runner checks the outcome independently: phase
  lines must be PASS/SKIPPED, `.env.local` must carry `WP_BASE_URL`, the origin
  must prove the mode (products for a store, pages or posts for content), and
  `.next/BUILD_ID` must exist. Exit 0 alone is not success.
- **Capability is gated, never deleted.** `phases.tsv` has a `when` column
  (`all|store|content`); a run that does not apply is skipped for that site, not
  removed from the factory.
- **Resume is by directory, not session id.** `opencode run -c` in the site
  folder continues that site's last session, which is the phase being retried.
