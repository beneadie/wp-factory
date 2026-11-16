# Factory

The automation. It never renders a page; it moves work.

| File | Purpose |
|---|---|
| `queue.py` | SQLite job queue. Add, claim, set phase, set template, finish, requeue, remove, list. |
| `run-job.sh` | One job: preflight → choose template → compose overlay → `npm ci` → sync skills → phases → gate → record → report. `flock`-guarded. |
| `template_choice.py` | Scores discovery evidence and picks a template; writes `docs/site/template-choice.md`. Defaults to `practice` only when evidence is weak, and says so. |
| `phases.tsv` | Which agent runs a job has, which status lines each owns, the artifacts each must leave, and the `when` mode that gates each run. |
| `prompts/` | One prompt per phase run, plus the retry prompt and the design sub-step appended to `base`. Store-only prompts are listed in `phases.tsv` with `when=store`. Discovery is one run (`intake`, phases 0/1/2a). |
| `agent.sh` | A single `opencode run` pass for one phase, kept separate so `systemd-inhibit` can wrap it. |
| `lib.sh` | Status-file parsing and prompt rendering, sourced by `run-job.sh`. |
| `telegram.sh` | Runs the bot with `.env` loaded, so the token does not have to be exported by hand. |
| `report.py` | Reads the job + `00-status.md`, sends the summary to Telegram. |
| `telegram.py` | Long-polling bot: `/build`, `/jobs`, `/status`. |
| `job.schema.json` | The contract between the transport and the runner. |

## Design decisions

- **Telegram is the UI, SQLite is the queue.** The offset and the job rows are
  persisted, so a reboot mid-build loses nothing and never double-runs.
- **Copy, not clone, then compose.** `tar` the template into `sites/<slug>`,
  overlay `templates/<name>/`, and `git init` there, so client repos never
  contain the factory, the token, or the queue.
- **Prospect data lives in the queue, secrets live in `.env`.** The WordPress
  origin is per-job (`jobs.wp_url` → `sites/<slug>/.env.local`); the factory
  `.env` holds only ops credentials and the model.
- **Mode is classified, not assumed.** Preflight records `SITE_MODE` from a
  Store API probe. Both outcomes are normal: `store` runs the commerce phases,
  `content` marks them SKIPPED. The gate follows the mode — a non-empty catalogue
  for a store, real pages or posts for content.
- **One job at a time.** `flock` on `.factory.lock`; a second invocation exits 0
  rather than starting a competing agent.
- **Small sessions, artifact handoffs.** `intake` covers discovery (0/1/2a) in one
  session so the same facts are read once; `base`, `commerce-build`, `substrate`
  and `verify` each get a fresh session. Handoff is `docs/site/00-status.md` plus
  the files in `prompts/`.
- **Sites live on fast storage.** `SITES_ROOT` defaults to
  `~/wp-factory-sites` (ext4), not the repo, because `node_modules` and `.next`
  on a Windows mount dominate build time. Jobs created under `sites/` keep that
  path.
- **One check per batch.** Every site ships `scripts/check.sh` (typecheck + lint
  + build in one pass, `--perf` adds one server and the perf gate) and
  `scripts/wp-probe.sh` (batched read-only probes). The prompts call these once
  instead of running three commands, or thirty curls, in a row.
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
- **Skills are synced before every attempt.** `.opencode/` and `opencode.json`
  are re-copied from `template/` before each agent pass, so a template edit made
  mid-build reaches the next attempt. Only those two paths are touched; the
  site's `docs/` and `src/` are never overwritten by the sync.
- **Template choice is evidence, not a guess.** An explicit job `template` wins;
  otherwise `TEMPLATE` in `.env.local` stays authoritative. If it is absent, the
  runner scores `site-profile.md` and `capability-register.md` and writes
  `docs/site/template-choice.md`. Weak evidence defaults to `practice`, loudly.
- **The overlay is re-composed, not frozen.** A new site gets
  `templates/<name>/theme.css` copied to `src/styles/theme.base.css`, plus
  `src/config/theme.ts`, `src/template-sections/`, `docs/site/template.md` and
  `docs/site/reference/`. Those are **regenerated artifacts**: every run
  overwrites them. `src/styles/theme.css` is **client-owned**: the factory
  creates it once with a header and never writes it again, so the design pass's
  values survive a resume. Client decisions live in `theme.css` and
  `docs/site/design-notes.md`, never in a regenerated file.
- **Regenerated and client artifacts are separate.** This is the same bug class
  as stale skills: never let a resume overwrite work the client owns. The
  stylesheet load order is `theme.base.css` (template) then `theme.css`
  (client), so the client wins.
- **Design is a sub-step, not a phase.** The `design` prompt is appended to the
  `base` prompt in the same agent session: about 15 minutes, screenshots, two
  fixes, stop. It has no row in `phases.tsv`; `Phase 4a Base` owns the result.
- **Resume is by directory, not session id.** `opencode run -c` in the site
  folder continues that site's last session, which is the phase being retried.
