Build the base site for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This phase wires routes and data. It is not the visual or motion pass. Load
`agent-conduct` first. Read `docs/site/00-status.md`, `docs/wp-discovery/*` and
`docs/site/06-brand-assets.md`, then load `site-base` and follow the branch for
`SITE_MODE`.

## Work

Content site:
render the pages, posts and menus the backend actually exposes. Add the routes
needed for permalink parity, drive navigation from the WordPress page hierarchy
or `site.primaryNav`, and use `/wp/v2/pages` and `/wp/v2/posts`. Do not scaffold
products, cart, checkout or account flows, and never invent a placeholder
catalogue.

Store:
build the catalogue on the routes the origin actually uses — product permalinks,
category and attribute archives, search, and a product page with a working
variation selector per `wp-catalog-cart`. Sold-out products stay listed with a
badge. Do not build cart, checkout or payment here; `Phase 4c Commerce` owns
them.

Both: emit the brand assets captured in `docs/site/06-brand-assets.md` (icon,
apple-touch-icon, favicon, OG image, manifest) or leave them absent when
discovery recorded that the origin has none.

Put every client value in `src/config/site.ts`. Record the route map, the data
source for each route, and anything stubbed in `docs/site/base.md`.

## How to work

- Plan the files first, then write them. Batch related writes in one turn.
- Do not re-read a file you just wrote, and do not re-read unchanged discovery
  docs; they are already in this conversation.
- Aim for at most 60 tool calls. If you are exploring instead of building, stop
  and use what discovery already proved.

## Check

Run the batched check once after your last edit:

    bash scripts/check.sh

It runs typecheck, lint and build in one pass. If it fails, fix the cause and run
it again. Do not run the three commands separately, and do not build more than
twice.

Then set this exact line in `docs/site/00-status.md`:

Phase 4a Base: PASS

If a route cannot render real data, set `Phase 4a Base: BLOCKED — <reason>` and
stop rather than shipping empty or invented content.
