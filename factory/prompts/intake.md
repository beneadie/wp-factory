Discover the site {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This run covers Phase 0 Intake, Phase 1 Unknowns and Phase 2a Content in one
session, so the same facts are read once. Read `docs/site/00-status.md` and any
existing `docs/wp-discovery/*` before anything else.

Load `agent-conduct` first. Then `wp-intake`, `wp-unknowns` and `wp-content-seo`,
in that order. Use `project-orchestrator` only for its artifact map and gates.
Do not start a build phase. Do not edit `src/`.

## Probes

Batch every read-only probe into one call instead of one curl per endpoint:

    bash scripts/wp-probe.sh {{wp_url}} /tmp/wp-probe all

It writes JSON, headers and status codes per endpoint and prints a summary. Read
those files. Probe an extra path only when the batch does not answer the
question. All probes are GET-only.

## Work

Classify the site from evidence, never from assumption. A Store API means it is a
shop; its absence means content. Both are normal outcomes.

Map pages, posts, custom post types, taxonomies, menus, media, SEO, redirects and
forms. Inventory brand assets (icons, manifest, OG image, logo, fonts) in
`docs/site/06-brand-assets.md`. Record every capability the site does **not**
have as absent, with the evidence.

If the origin is a shop, record the catalogue and its write paths for the later
commerce phases; do not plan store UI here.

## Budget

Aim for at most 120 tool calls. Write artifacts as you go instead of re-reading
files, and batch related writes in one turn. If a label cannot be finished,
record why and stop rather than exploring.

## Gates

Set these exact lines in `docs/site/00-status.md` (no bullet, status word first):

Phase 0 Intake: PASS
Phase 1 Unknowns: PASS
Phase 2a Content: PASS

Then set the mode-specific lines:

- content site: `Phase 2b Commerce: SKIPPED — no Store API`,
  `Phase 3 Spikes: SKIPPED — no write path`,
  `Phase 4c Commerce: SKIPPED — no Store API`.
- store: leave 2b, 3 and 4c as `NOT STARTED`; their own runs set PASS.

A label is only PASS when its artifacts exist:
`docs/wp-discovery/site-profile.md`, `docs/wp-discovery/unknowns.md`,
`docs/wp-discovery/content-seo.md`, `docs/site/06-brand-assets.md`.

If something blocks you, write `Phase 0 Intake: BLOCKED — <one-line reason>` and
stop. Do not guess past a blocker.
