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
npm run check      # typecheck + lint + build, one pass
npm run check:fast # typecheck + lint only
bash scripts/check.sh --perf   # the above plus one server + check:perf
npm run shots -- --url http://localhost:3000   # home/inner/mobile screenshots
npm run probe -- https://origin.example /tmp/wp-probe all
```

## Test policy

Tests are the slowest part of a loop and usually repeat. Run them deliberately:

- Batch edits, then run **one** check: `npm run check`. A check per file wastes
  minutes per phase.
- `npm run check:fast` while iterating; the full build once before you claim the
  phase is done.
- Do not `rm -rf .next`. The cache makes the next build much faster.
- Probe the backend in batches (`npm run probe`), not one `curl` per endpoint.

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
- **Judge appearance from a screenshot, not the accessibility tree.** The
  Playwright MCP server is accessibility-tree based by default and does **not**
  show appearance. Before declaring a page done, call `browser_take_screenshot`,
  view the image, and check it against
  `.opencode/skills/design-adaptation/references/visual-review.md`. A passing
  DOM/ARIA tree is not visual evidence.
- **Do not mutate WordPress from build/render code.** Only BFF route handlers
  may POST.
- **Keep URL parity.** Preserve the origin's permalinks, including nesting and
  the trailing-slash style. Do not assume `/shop/` or `/product/`.
- **Site specifics live in one place.** `src/config/site.ts` for names, nav,
  domains; `src/styles/theme.css` for client brand token values. Never hardcode a
  brand name, colour or domain inside a component. `src/styles/theme.base.css`,
  `src/config/theme.ts` and `src/template-sections/` are regenerated from the
  template: never edit them for a client look.
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
  components/          # shared UI (image slot, motion, sticky header)
  config/site.ts       # all client-specific values
  config/theme.ts      # template theme values (regenerated)
  styles/theme.base.css # template skin (regenerated; never edit)
  styles/theme.css     # client brand token values (never regenerated)
  template-sections/   # section components (regenerated from the template)
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
- `npm run check` passes (typecheck, lint and build in one pass).
- `npm run check:perf` passes and `docs/verification/perf.json` exists.
- Home, an inner page and mobile were screenshotted, viewed, and judged against
  the visual rubric; `docs/site/design-notes.md` records what was applied and
  what was deliberately not matched.
- `docs/site/00-status.md` states what works and what is still stubbed.
- No secret, token or credential is in the working tree.
