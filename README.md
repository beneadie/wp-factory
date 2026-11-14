# wp-factory

Telegram in, built site out. Content sites and shops, from one neutral base.

```
wp-factory/
├─ template/   neutral base every prospect is cloned from (skills live here)
├─ factory/    queue, runner, Telegram transport
├─ sites/      generated per-prospect repos (gitignored)
└─ logs/       one jsonl per build (gitignored)
```

## Setup

```bash
cp .env.example .env        # Telegram token, chat id
python3 factory/queue.py list
```

Install Node deps in each generated site, not in the template. The runner copies
the template without `node_modules` and runs `npm ci` in the copy, so the first
build of a site is slower and later ones reuse the npm cache.

## Run a build

```bash
python3 factory/telegram.py --loop      # terminal 1: listens for /build
bash factory/run-job.sh                 # terminal 2 (or cron): one job
```

Or bypass Telegram:

```bash
python3 factory/queue.py add --slug acme-wool --name "Acme Wool" --wp-url https://acme.ie
bash factory/run-job.sh
```

`run-job.sh` is idempotent and guarded by `flock`, so it is safe to call from a
timer:

```cron
*/5 * * * * cd /home/you/wp-factory && ./factory/run-job.sh >> logs/cron.log 2>&1
```

Each job classifies the origin first: a Store API means `store`, otherwise
`content`. Then it runs the site in separate agent sessions — `intake`,
`api-map`, `base`, `substrate`, `verify`, plus `commerce`, `spikes` and
`commerce-build` for a store. Each phase must reach PASS (or SKIPPED) *and* leave
its handoff artifact, otherwise it retries up to `PHASE_ATTEMPTS` times and then
blocks.

The runner then gates the result independently: phase lines must read PASS or
SKIPPED, `.env.local` must carry `WP_BASE_URL`, proof must match the mode (real
pages or posts for content, a non-empty catalogue for a store), and
`.next/BUILD_ID` must exist. Anything less is recorded as `blocked` with a
reason, not `done`. Retry a blocked site with
`python3 factory/queue.py requeue --slug <slug>`.

For a dry run that sets the site up without spending tokens:

```bash
DRY_RUN=1 bash factory/run-job.sh
```

## Evaluate a build

```bash
cd sites/acme-wool
cat docs/site/00-status.md
opencode                  # same skills, same agent, same sessions
```

## Design pass

The template ships with neutral tokens. After the base renders the real pages,
hand over screenshots and run:

```bash
cd sites/acme-wool
opencode run -c "Here is the design reference. Follow design-adaptation."
```

## Contract between the two halves

Anything that can enqueue a row is a valid client. Nothing else needs to know
about the runner. Job shape: `factory/job.schema.json`.
