Build the storefront for {{name}} ({{slug}}) from the WordPress origin {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

Site mode is decided by the runner, not by you: `store` means the WooCommerce
Store API answered; `content` means it did not. Trust it.

This is the first phase of the build. Read `docs/site/00-status.md` and any existing
`docs/wp-discovery/*` before anything else.

Load and follow the `wp-intake` skill. Use `project-orchestrator` only for its
artifact map and gates. Do not start Phase 1. Do not edit `src/`.

Work read-only against WordPress. Probe the live API and record what you find
verbatim; never invent fields or capabilities.

Never invent commerce. If the mode is `content`, record the absence of
WooCommerce in the capability register and move on — do not list products,
cart, checkout, payments, accounts or bookings as capabilities to build.

When the intake exit gate is met, set this exact line in
`docs/site/00-status.md` (no bullet, status word first):

Phase 0 Intake: PASS

If something blocks you, write `Phase 0 Intake: BLOCKED — <one-line reason>`
and stop. Do not guess past a blocker.
