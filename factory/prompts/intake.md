Build the site for {{name}} ({{slug}}) from the WordPress origin {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This is the first phase of the build. Read `docs/site/00-status.md` and any
existing `docs/wp-discovery/*` before anything else.

Load `agent-conduct` first, then `wp-intake`. Use `project-orchestrator` only for
its artifact map and gates. Do not start Phase 1. Do not edit `src/`.

Classify the site from evidence, never from assumption. A Store API means it is a
shop; its absence means content. Both are normal outcomes. If the origin is a
shop, record the catalogue and its write paths for the later commerce phases; do
not plan store UI here.

Work read-only against WordPress. Probe the live API and record what you find
verbatim; never invent fields or capabilities.

When the intake exit gate is met, set this exact line in
`docs/site/00-status.md` (no bullet, status word first):

Phase 0 Intake: PASS

If something blocks you, write `Phase 0 Intake: BLOCKED — <one-line reason>` and
stop. Do not guess past a blocker.
