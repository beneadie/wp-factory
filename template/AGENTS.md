# AGENTS.md

Instructions for agents working in a site generated from this template.

## What this is

A Next.js (App Router, TypeScript) storefront that renders an existing
WordPress/WooCommerce backend. WordPress is the source of truth for products,
orders, customers, content and SEO. This repo is the public frontend plus a BFF.

Read `.opencode/skills/README.md` for the skill set, then load
`project-orchestrator` and follow its phase order.

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
- **Do not mutate WordPress from build/render code.** Only BFF route handlers
  may POST.
- **Keep URL parity.** Preserve `/shop/...` and `/product-category/...`.
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
    product-category/  # category archives (URL parity)
    shop/              # product detail (URL parity)
    api/               # BFF route handlers
  components/          # shared UI
  config/site.ts       # all client-specific values
  lib/
    wp/                # typed WordPress / WooCommerce client
docs/
  site/00-status.md    # build state, one line per phase
  site/                # discovered facts for this site
```

## Definition of done for a build pass

- The site renders the client's real products, categories and pages, not
  fixtures or placeholder copy.
- `npm run typecheck`, `npm run lint` and `npm run build` pass.
- `docs/site/00-status.md` states what works and what is still stubbed.
- No secret, token or credential is in the working tree.
