Build the base site for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}.

This phase wires routes and data. It is not the visual or motion pass. Read
`docs/site/00-status.md`, `docs/wp-discovery/*` and `docs/site/06-brand-assets.md`
first, then load `site-base` and follow it.

This is a content site: render the pages, posts and menus the backend actually
exposes. Add the routes needed for permalink parity, drive navigation from the
WordPress page hierarchy or `site.primaryNav`, and use `/wp/v2/pages` and
`/wp/v2/posts`. Do not scaffold products, cart, checkout or account flows, and
never invent a placeholder catalogue. Commerce lives in `template/commerce/` and
is opt-in for a later pass.

Emit the brand assets captured in `docs/site/06-brand-assets.md` (icon,
apple-touch-icon, favicon, OG image, manifest) or leave them absent when
discovery recorded that the origin has none.

Put every client value in `src/config/site.ts`. Record the route map, the data
source for each route, and anything stubbed in `docs/site/base.md` — the next
session reads that file instead of your reasoning.

Before declaring the phase done run, once each:

    npm run typecheck
    npm run lint
    npm run build

Then set this exact line in `docs/site/00-status.md`:

Phase 4a Base: PASS

If a route cannot render real data, set `Phase 4a Base: BLOCKED — <reason>` and
stop rather than shipping empty or invented content.
