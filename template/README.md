# Site template

The base that every generated storefront starts from. Next.js App Router +
TypeScript, rendering a WordPress/WooCommerce backend.

## Use it

```bash
cp -a template/. ../sites/acme-wool/
cd ../sites/acme-wool
cp .env.example .env.local     # set WP_BASE_URL, SITE_NAME, SITE_URL
npm install
npm run dev
```

To have an agent build it out, open OpenCode in the new directory. The
`site-builder` agent is configured in `opencode.json`, and the full skill set is
installed at `.opencode/skills/`. Given a domain, `project-bootstrap` normalizes
it, proves it is WordPress + WooCommerce, and writes `.env.local` before
`project-orchestrator` starts Phase 0.

## What is in the box

| Path | Purpose |
|---|---|
| `src/config/site.ts` | Every client-specific value: name, description, nav, currency |
| `src/lib/wp/` | Typed Store API + `wp/v2` client |
| `src/app/product-category/[...slug]` | Category archives, URL parity |
| `src/app/shop/[slug]` | Product detail, URL parity |
| `src/app/globals.css` | Design tokens as CSS variables (the design pass swaps values) |
| `docs/site/00-status.md` | Build state and what is stubbed |
| `.opencode/skills/` | The build skills |

## Deliberately not included yet

- Cart, checkout, accounts, wholesale — add per site once the money path is proven.
- A brand: colours are a neutral placeholder so the design pass is a token swap.
- The image CDN pipeline — `SiteImage` is a thin wrapper until `frontend-substrate` adds it.
