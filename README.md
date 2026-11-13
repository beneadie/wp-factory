# wp-factory

Telegram in, deployed storefront out.

```
wp-factory/
├─ template/   the base site every prospect is cloned from (skills live here)
├─ factory/    queue, runner, Telegram transport
├─ sites/      generated per-prospect repos (gitignored)
└─ logs/       one jsonl per build (gitignored)
```

## Setup

```bash
cp .env.example .env        # Telegram token, chat id
python3 factory/queue.py list
```

Install Node deps in the template once, so copies do not have to:

```bash
cd template && npm install && cd ..
```

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

## Evaluate a build

```bash
cd sites/acme-wool
cat docs/site/00-status.md
opencode                  # same skills, same agent, same sessions
```

## Design pass

The template ships with neutral tokens. After the base renders the real
catalogue, hand over screenshots and run:

```bash
cd sites/acme-wool
opencode run -c "Here is the design reference. Follow design-adaptation."
```

## Contract between the two halves

Anything that can enqueue a row is a valid client. Nothing else needs to know
about the runner. Job shape: `factory/job.schema.json`.
