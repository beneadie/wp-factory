# Site template

The neutral base every generated site starts from: Next.js App Router +
TypeScript, rendering an existing WordPress site. It is deliberately unstyled and
carries no store UI; content and shop sites both start here, and the build
creates what the origin actually has.

## Use it

```bash
mkdir -p sites/acme && cp -a template/. sites/acme/
cd sites/acme
cp .env.example .env.local     # set WP_BASE_URL, SITE_MODE, SITE_NAME, SITE_URL
npm install
npm run dev
```

To have an agent build it out, open OpenCode in the new directory. The
`site-builder` agent is configured in `opencode.json`, and the full skill set is
installed at `.opencode/skills/`. Given a domain, `project-bootstrap` normalizes
it, proves it is WordPress, and writes `.env.local` before
`project-orchestrator` starts Phase 0.

## What is in the box

| Path | Purpose |
|---|---|
| `src/config/site.ts` | Client values: name, description, URL, optional nav override |
| `src/lib/wp/` | Typed WordPress client: pages, media, fetcher |
| `src/app/[...slug]` | Page routes with permalink parity and real 404s |
| `src/app/page.tsx` | Neutral home: site name and top-level pages |
| `src/styles/theme.base.css` | Template skin, regenerated from `templates/<name>/theme.css`; never edit |
| `src/styles/theme.css` | Client brand token values; created once, edited by the design pass, never regenerated |
| `src/template-sections/` | Section components regenerated from the chosen template |
| `src/config/theme.ts` | The chosen template's theme values, regenerated |
| `src/app/globals.css` | Base primitives and neutral fallbacks |
| `src/components/site-image.tsx` | Image slot: visible placeholder, aspect ratio, retry |
| `src/components/motion/` | Reveal observer, route progress and reduced-motion provider |
| `src/components/site-header-shell.tsx` | Sticky header shell with scroll hysteresis |
| `docs/site/00-status.md` | Build state and what is stubbed |
| `.opencode/skills/` | The build skills |

## Deliberately not included

- Store UI: no product page, cart, checkout or account. A shop build creates the
  ones its origin supports; a content site creates none.
- A brand: colours and fonts are neutral so the design pass is a token swap.
- The image CDN pipeline — `SiteImage` is the contract, not the CDN.

## Checks

```bash
npm run check          # typecheck + lint + build, one pass
npm run check:fast     # typecheck + lint
bash scripts/check.sh --perf   # adds one server + the perf/brand gate
npm run shots -- --url http://localhost:3000   # home/inner/mobile screenshots
npm run probe -- https://origin.example /tmp/wp-probe all   # batched probes
```
