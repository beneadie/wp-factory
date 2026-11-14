# AGENTS.md

Instructions for agents working in a site generated from this template.

## What this is

A Next.js (App Router, TypeScript) frontend that renders an existing WordPress
backend. WordPress is the source of truth for pages, media, menus, SEO and — on a
shop — products and orders. This repo is the public frontend plus a BFF.

`SITE_MODE` in `.env.local` says what this site is: `content` or `store`. It is
decided from evidence during intake, never assumed. Both are first-class; the
template itself carries no store UI.

Read `.opencode/skills/README.md` for the skill set. **Load `agent-conduct`
first.** If this directory has no `.env.local` yet, load `project-bootstrap` — it
turns the WordPress origin into site config. Then load `project-orchestrator` and
follow its phase order.

## Commands

```bash
npm run dev        # local dev
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Test policy

Tests are the slowest part of a loop and usually repeat. Run them deliberately:

- `npm run typecheck` after a batch of edits. `tsc --incremental` is on; keep
  `tsconfig.tsbuildinfo`.
- `npm run lint` on touched files while iterating (`npx eslint src/path`).
- `npm run build` **once**, before you declare the work finished. Not after
  every edit. Not twice in a row.
- Do not `rm -rf .next`. The cache makes the next build much faster.

## Ground rules

- **Never commit secrets.** Config comes from env: `WP_BASE_URL`, `SITE_NAME`,
  `SITE_URL`. `.env.local` is gitignored.
- **WordPress is the source of truth.** Types in `src/lib/wp/types.ts` reflect
  real API responses. Do not invent fields.
- **Never invent commerce.** A content site ships no products, cart or checkout.
  A store builds the catalogue the API exposes in `site-base`, then cart and
  checkout in `store-checkout`. Never invent a placeholder catalogue, and never
  add store UI to a content site.
- **Never remove a capability to satisfy a scope.** Gate it by mode. See
  `agent-conduct`.
- **Do not mutate WordPress from build/render code.** Only BFF route handlers
  may POST.
- **Keep URL parity.** Preserve the origin's permalinks, including nesting and
  the trailing-slash style. Do not assume `/shop/` or `/product/`.
- **Site specifics live in one place.** `src/config/site.ts` for names, nav,
  domains; `src/app/globals.css` for design tokens. Never hardcode a brand name,
  colour or domain inside a component.
- Prefer server components. Add `"use client"` only to the smallest interactive
  leaf.
- **Document traps.** When you hit a non-obvious API or rendering behaviour,
  record it in `docs/site/` before moving on.

## Where things live

```
src/
  app/                 # App Router routes
    [...slug]/         # WordPress pages (permalink parity, real 404s)
    api/               # BFF route handlers (store builds)
  components/          # shared UI (image slot, navigation pending)
  config/site.ts       # all client-specific values
  lib/
    wp/                # typed WordPress client (pages, media)
docs/
  site/00-status.md    # build state, one line per phase
  site/                # discovered facts for this site
```

## Definition of done for a build pass

- The site renders the client's real content (or, on a store, its real
  catalogue), not fixtures or placeholder copy, with 404s for unknown paths.
- Site mode is honoured: no store UI on a content site, and no invented
  catalogue on either.
- Store only: variable products are configurable; cart and checkout round-trip
  against the API; the payment handoff goes to the real hosted page.
- Icons, apple-touch-icon and an OG image are emitted, or recorded as missing.
- Navigation paints within 200ms; image slots are never blank; the LCP image is
  never hidden.
- `npm run typecheck`, `npm run lint` and `npm run build` pass.
- `npm run check:perf` passes and `docs/verification/perf.json` exists.
- `docs/site/00-status.md` states what works and what is still stubbed.
- No secret, token or credential is in the working tree.
