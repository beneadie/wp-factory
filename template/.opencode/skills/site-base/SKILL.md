---
name: site-base
description: Use after discovery to wire the template to this site's real routes, data and URL shapes. Owns routing, data sources, src/config/site.ts and permalink parity for a content site or a store catalogue. Does not own cart, checkout, motion, loading states, images or visual design.
---

# Site Base

Turn the neutral template into this site's real routes. Data correct, URLs
correct, nothing invented. Motion, loading behaviour and the skin are separate
passes.

Read `SITE_MODE` in `.env.local` first. It says which branch below applies.

- `content` — no Store API. Build pages, posts and menus.
- `store` — Store API proven in discovery. Build the catalogue; cart and
  checkout are `store-checkout`, a separate phase.

Never add commerce to a content site, and never leave a content site's home page
pointing at a product grid.

## Inputs

- `docs/wp-discovery/*` — the proven routes, fields and capabilities.
- `docs/site/06-brand-assets.md` — icons, manifest, OG image, logo, fonts.
- `src/lib/wp/*` — the typed client (`pages.ts`, `fetcher.ts`). Add to it; do not
  fetch ad hoc in a page.
- `docs/site/00-status.md` — what earlier phases established.

## Non-negotiables

- **Server-first.** Fetch in server components; `"use client"` only for the
  smallest interactive leaf.
- **One typed client.** A data function belongs in `src/lib/wp/`, not in a page.
- **URL parity.** Preserve the origin's permalinks, including nesting and the
  trailing-slash style. Read the shapes from discovery; do not assume
  `/shop/` or `/product/`.
- **Real 404s.** Call `notFound()` when the slug does not exist or the permalink
  does not match. Never render an empty shell.
- **No invented fields or content.** If it is not in `docs/wp-discovery/`, probe
  for it or leave it out. Never fill a page with fixtures to look finished.
- **Config in one place.** Name, description, URL and nav in
  `src/config/site.ts`; tokens stay in `src/app/globals.css`.
- **Write as you go.** `docs/site/base.md` is the handoff: route map, data source
  per route, revalidation choice, what is stubbed.

## Content mode

| Route | Source |
|---|---|
| `/` | top-level pages as the index |
| `/{page}/` and nested paths | page by slug + permalink parity check |
| posts | `/wp/v2/posts` only if discovery shows they are used |
| unknown path | `not-found.tsx` |

- Navigation comes from `site.primaryNav` when set, otherwise the page
  hierarchy. Menus are often 401 anonymously; derive from pages or the captured
  markup. Do not guess labels.
- **Page hero** comes from the page's featured image when the API exposes one,
  falling back to the captured hero asset. Never invent an image.
- **Pasted content is not markup.** Editor content pasted from another tool
  often carries wrapper classes, inline centring, fixed image dimensions and a
  duplicated hero image. Flatten the wrappers, drop the duplicate, and keep the
  images in a gallery. Record the pattern in `docs/site/content-notes.md` if it
  recurs.

## Store mode

Build the catalogue the origin actually has. Read the shapes from
`docs/wp-discovery/commerce.md` and keep the public URLs identical.

| Route | Source |
|---|---|
| `/` | featured/limited products plus real content |
| product detail | product by slug, at the origin's permalink |
| category archives | category by slug + products filtered by category |
| tag/attribute archives | only if the origin exposes them |
| search | the Store API search parameter |
| content pages | the content branch above, still |

Rules:

- **ISR for public catalogue data** (`revalidate = 300` is the template default).
  Cart, checkout and account are never cached.
- **Sold-out products stay in listings** with a badge. A catalogue is a sales
  surface; do not hide them.
- **Variable products are configured, not printed.** Render one control per
  attribute, in the parent's attribute order, taken from the parent's
  `attributes[].terms` (name plus slug). If the terms are missing, fall back to
  the variation rows' names, then SKU and `add_to_cart.url`, and record the
  degraded path. Never show a raw ID or an empty control.
- **Invalid combinations are unavailable**, not silently accepted. Open on the
  first in-stock variation.
- **Selection drives the displayed price, stock, SKU and image**, even if the
  cart is deferred. It is an availability preview, not a dead buy button.
- **Stock truth**: use the selected variation's `stock_availability`. A variable
  parent's `is_on_backorder` is unreliable — do not use it for the PDP. On cards,
  show a back-order pill only for simple products.
- **Surface API errors.** An add-to-cart or quantity failure shows the Store API
  `message`; never a dead click.
- Cache is a display convenience: the server still enforces stock at add time.

Cart, checkout and payment belong to `store-checkout`. Do not build them here.

## Brand assets

Emit what the origin has; never invent a brand:

- `src/app/icon.png` (192 or 512) and `src/app/apple-icon.png` (180);
- `public/favicon.ico` when the origin has one;
- `src/app/opengraph-image.png` (1200×630) or `metadata.openGraph.images`;
- `src/app/manifest.ts` with name, theme colour and icon;
- brand fonts in `globals.css` tokens when the origin ships them.

If the origin has no favicon or OG image, record the gap instead of generating a
placeholder brand.

## Acceptance

- Every built route renders this site's real data, not fixtures.
- Unknown paths return a real 404.
- URLs match the origin's shapes, including nesting and trailing slashes.
- Icons, apple-touch-icon and OG image are emitted when the origin has them, or
  recorded as missing.
- Store mode only: every variable product renders selectable options, and an
  invalid combination cannot be chosen.
- `npm run typecheck`, `npm run lint` and `npm run build` pass once.
- `docs/site/base.md` lists every route, its data source and anything stubbed.
- No brand, colour or origin hardcoded in a component.
- No commerce exists on a content site; no catalogue was invented.
