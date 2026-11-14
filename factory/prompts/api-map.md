Continue the build for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This phase maps the site's routes and content. Read `docs/site/00-status.md` and
every file in `docs/wp-discovery/` first.

## Always

Load `wp-unknowns` and follow it, then `wp-content-seo`. Map pages, posts,
custom post types, taxonomies, menus, media, SEO, redirects and forms. All
probes are GET-only.

Set these exact lines:

Phase 1 Unknowns: PASS
Phase 2a Content: PASS

## If site mode is content

There is no WooCommerce Store API. Record that absence with the probe that
proved it, do not inventory commerce capabilities, and mark the phases that do
not apply:

Phase 2b Commerce: SKIPPED — no Store API
Phase 3 Spikes: SKIPPED — no write paths

## If you are blocked

Write `Phase 1 Unknowns: BLOCKED — <reason>` (or `Phase 2a`) and stop. Do not
guess past a blocker, and do not start the next phase.
