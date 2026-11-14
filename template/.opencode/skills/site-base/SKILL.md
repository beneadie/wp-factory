---
name: site-base
description: Use after discovery to wire the template to this site's real pages, routes and content. Owns routing, data sources, src/config/site.ts and URL parity for a content site. Does not own motion, loading states, images, commerce or visual design.
---

# Site Base

Turn the generic template into this site's real pages. Data correct, routes
correct, nothing invented. The felt experience and the skin are separate
sessions; if you find yourself adding easing curves or a palette, stop.

This template is **content-first**. Commerce is parked in `template/commerce/`
and is not part of a base build. Do not add products, cart, checkout or account
flows.

## Inputs

- `docs/wp-discovery/*` — the proven routes, fields and content model.
- `docs/site/06-brand-assets.md` — icons, manifest, OG image, logo, fonts.
- `src/lib/wp/*` — the typed WordPress client (`pages.ts`, `fetcher.ts`).
- `docs/site/00-status.md` — what earlier phases established.

## Non-negotiables

- **Server-first.** Fetch in server components; `"use client"` only for the
  smallest interactive leaf.
- **One typed client.** Add a function to `src/lib/wp/pages.ts` rather than
  fetching ad hoc in a page.
- **URL parity.** Preserve WordPress permalinks, including nesting and the
  trailing-slash style. `pagePath()` and the catch-all route are the pattern.
- **Real 404s.** The catch-all page route must call `notFound()` when the slug
  does not exist or the permalink does not match; never render an empty shell.
- **No invented fields or content.** If it is not in `docs/wp-discovery/`, probe
  for it or leave it out. Never fill a page with fixtures to look finished.
- **Config in one place.** Name, description, URL and nav in
  `src/config/site.ts`; tokens stay in `src/app/globals.css`.
- **Write as you go.** `docs/site/base.md` is the handoff: route map, data source
  per route, revalidation choice, what is stubbed.

## Routes

| Route | Source |
|---|---|
| `/` | `getPages()` — top-level pages as the index |
| `/{page}/` and nested paths | `getPageBySlug` + `pagePath` parity check |
| optional posts | `/wp/v2/posts` only if discovery shows posts are used |
| unknown path | `not-found.tsx` |

Navigation comes from `site.primaryNav` when set, otherwise the top-level page
tree. Do not guess menu labels; menus are often 401 anonymously, so derive from
pages or the captured markup in `docs/site/`.

## Brand assets

Discovery captures the origin's icons, manifest, OG image, logo and fonts into
`docs/site/06-brand-assets.md`. Emit what exists; never invent a brand:

- `src/app/icon.png` (192 or 512) and `src/app/apple-icon.png` (180);
- `public/favicon.ico` when the origin has one;
- `src/app/opengraph-image.png` (1200×630) or `metadata.openGraph.images`;
- `src/app/manifest.ts` with name, theme colour and icon;
- brand fonts in `globals.css` tokens when the origin ships them.

If the origin has no favicon or OG image, record the gap instead of generating a
placeholder brand.

## Commerce (opt-in, not in this pass)

A shop prospect is out of scope for the base. The store client, product routes
and product components live in `template/commerce/` with a README explaining how
to reinstate them. Do not copy them into `src/` unless the operator asks for a
commerce build.

## Acceptance

- Every built route renders this site's real content (or a real page), not
  fixtures.
- Unknown paths return a real 404.
- Icons, apple-touch-icon and OG image are emitted when the origin has them, or
  recorded as missing.
- `npm run typecheck`, `npm run lint` and `npm run build` pass once.
- `docs/site/base.md` lists every route, its data source and anything stubbed.
- No brand, colour or origin hardcoded in a component.
- No commerce UI exists unless this was explicitly a commerce build.
