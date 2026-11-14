Continue the build for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}.

This phase maps the site's routes and content. Read `docs/site/00-status.md` and
every file in `docs/wp-discovery/` first.

Load `wp-unknowns` and follow it, then `wp-content-seo`. Map pages, posts,
custom post types, taxonomies, menus, media, SEO, redirects and forms, and
inventory brand assets (icons, manifest, OG image, logo, fonts) in
`docs/site/06-brand-assets.md`. All probes are GET-only.

There is no commerce in the base build. If the origin is a shop, record the
catalogue in the discovery notes for a later commerce pass but do not plan
product, cart or checkout UI here.

Set these exact lines:

Phase 1 Unknowns: PASS
Phase 2a Content: PASS

If you are blocked, write `Phase 1 Unknowns: BLOCKED — <reason>` (or `Phase 2a`)
and stop. Do not guess past a blocker, and do not start the next phase.
