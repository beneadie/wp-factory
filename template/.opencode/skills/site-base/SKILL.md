---
name: site-base
description: Use after discovery to wire the template to this site's real routes and data — products and categories for a store, pages, posts and menus for a content site. Owns routing, data sources, src/config/site.ts and URL parity. Does not own motion, loading states, images or visual design.
---

# Site Base

Turn the generic template into this site's real pages. Data correct, routes
correct, nothing invented. The felt experience and the skin are separate
sessions; if you find yourself adding easing curves or a palette, stop.

## Inputs

- `SITE_MODE` in `.env.local`: `store` or `content`.
- `docs/wp-discovery/*` — the proven routes, fields and capabilities.
- `src/lib/wp/*` — the typed WordPress/Store API client.
- `docs/site/00-status.md` — what earlier phases established.

## Non-negotiables

- **Server-first.** Fetch in server components; `"use client"` only for the
  smallest interactive leaf.
- **One typed client.** Add a function to `src/lib/wp/store.ts` rather than
  fetching ad hoc in a page.
- **URL parity.** Preserve the WordPress permalinks for the routes you build.
- **No invented fields or data.** If it is not in `docs/wp-discovery/`, probe for
  it or leave it out. Never fill a page with fixtures to look finished.
- **Config in one place.** Names, nav and domains in `src/config/site.ts`;
  tokens stay in `src/app/globals.css`.
- **Write as you go.** `docs/site/base.md` is the handoff: route map, data source
  per route, revalidation choice, what is stubbed.

## Store mode

| Route | Source |
|---|---|
| `/` | `getProducts` (featured/limited) |
| `/product-category/[...slug]` | `getCategoryBySlug` + `getProducts({ category })` |
| `/shop/[slug]` | `getProductBySlug` |
| `/about/`, `/contact/` | `getPageBySlug` |

Keep category/product URL shapes identical to the current public site. Use ISR
for public catalogue data (`revalidate = 300` is the template default).

## Content mode

There is no Store API. Build what exists:

- a catch-all page route that resolves top-level and nested permalinks through
  `getPageBySlug`, with `notFound()` for misses;
- post routes only if the discovery docs show posts are used;
- navigation from the site's menus or page hierarchy, not from a guessed list;
- the same `getPageBySlug` client, extended for the fields the site actually
  returns.

Do not add a product grid, cart, checkout or account flow. If the template's
home page still calls `getProducts`, replace that with real content rather than
leaving an empty shop.

## Acceptance

- Every built route renders this site's real data (or a real page), not fixtures.
- `npm run typecheck`, `npm run lint` and `npm run build` pass once.
- `docs/site/base.md` lists every route, its data source and anything stubbed.
- No brand, colour or origin hardcoded in a component.
- Commerce exists only if `SITE_MODE=store`.
