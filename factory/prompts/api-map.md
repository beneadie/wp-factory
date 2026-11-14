Continue the build for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This phase maps the site's routes and content. Load `agent-conduct` first. Read
`docs/site/00-status.md` and every file in `docs/wp-discovery/` before anything
else.

Load `wp-unknowns` and follow it, then `wp-content-seo`. Map pages, posts,
custom post types, taxonomies, menus, media, SEO, redirects and forms, and
inventory brand assets (icons, manifest, OG image, logo, fonts) in
`docs/site/06-brand-assets.md`. All probes are GET-only.

If a capability does not exist on this site, record that it was checked and is
absent. Do not invent it, and do not plan around it.

Set these exact lines:

Phase 1 Unknowns: PASS
Phase 2a Content: PASS

Then set the mode-specific lines:

- content site: `Phase 2b Commerce: SKIPPED — no Store API`,
  `Phase 3 Spikes: SKIPPED — no write path`,
  `Phase 4c Commerce: SKIPPED — no Store API`.
- store: leave 2b, 3 and 4c as `NOT STARTED`; their own runs set PASS.

If you are blocked, write `Phase 1 Unknowns: BLOCKED — <reason>` (or `Phase 2a`)
and stop. Do not guess past a blocker, and do not start the next phase.
