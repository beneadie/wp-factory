Build the site for {{name}} ({{slug}}) from the WordPress origin {{wp_url}}.
Niche: {{niche}}.

This is a content build. There is no commerce in this template: do not plan or
scaffold products, cart, checkout or account flows.

This is the first phase of the build. Read `docs/site/00-status.md` and any
existing `docs/wp-discovery/*` before anything else.

Load and follow the `wp-intake` skill. Use `project-orchestrator` only for its
artifact map and gates. Do not start Phase 1. Do not edit `src/`.

Work read-only against WordPress. Probe the live API and record what you find
verbatim; never invent fields or capabilities. If the origin is a shop, record
the catalogue for a later commerce pass but do not plan store UI.

When the intake exit gate is met, set this exact line in
`docs/site/00-status.md` (no bullet, status word first):

Phase 0 Intake: PASS

If something blocks you, write `Phase 0 Intake: BLOCKED — <one-line reason>` and
stop. Do not guess past a blocker.
