Build the base site for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This phase wires routes and data. It is not the visual or motion pass. Read
`docs/site/00-status.md` and `docs/wp-discovery/*` first, then load `site-base`
and follow it.

## If site mode is content

Render the pages, posts and menus the backend actually exposes. Add the routes
needed for permalink parity, drive navigation from menus or page hierarchy, and
use `/wp/v2/pages` and `/wp/v2/posts`. Do not scaffold products, cart, checkout
or account flows, and never invent a placeholder catalogue.

## If site mode is store

Render the real products, categories and product pages, with URL parity for
`/shop/...` and `/product-category/...`.

## Both modes

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
stop rather than shipping an empty or invented catalogue.
