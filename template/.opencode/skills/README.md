# Skills — shipped set

This folder is the complete, reviewable set of skills for building a modern
headless frontend on an existing WordPress/WooCommerce site.

It lives at `.opencode/skills/` inside the site template, so every cloned site
carries it automatically. Keep this README as the index.

## The shape of the set

Two halves:

1. **Discovery** — prove what the WordPress site actually is and can do.
   Read-only, evidence-first, gate before build.
2. **Build & ship** — reproduce the smooth, reactive substrate, adapt the skin
   from a design reference, verify it, and cut over.

The split matters. **Discovery skills never build UI.** Build skills never
re-discover the backend. `project-orchestrator` is the only entry point and is
responsible for the order.

## Order

```
project-bootstrap             <- domain in, site directory out (once per site)
project-orchestrator          <- start here for any new site
  wp-intake                   <- capture index, capability matrix, gate
    wp-unknowns               <- residual routes, journeys, outside-REST
    wp-catalog-cart           \
    wp-checkout-payments       |  domain audits (parallel, GET-only)
    wp-bookings                |
    wp-auth-wholesale          |
    wp-content-seo            /
  wp-spikes                   <- only skill allowed to mutate; prove write paths
  site-base                   <- wire real routes and data (no motion, no skin)
  frontend-substrate          <- build the smooth/reactive engineering (generic)
  design-adaptation           <- screenshot/reference -> skin (per client)
  verification                <- machine-checkable quality gate
  cutover                     <- domain, redirects, DNS, rollback
```

## Files

| Skill | Use when | Writes |
|---|---|---|
| `project-bootstrap` | given a domain, before anything else | `.env.local`, `docs/site/`, `docs/wp-discovery/site-profile.md` |
| `project-orchestrator` | starting a new site or a new phase | `docs/site/00-status.md` |
| `wp-intake` | given a wp-json index or a new site | `docs/wp-discovery/*` |
| `wp-unknowns` | after intake; residual routes/journeys | `docs/wp-discovery/unknowns.md` |
| `wp-catalog-cart` | catalog, types, variations, cart, coupons | `docs/wp-discovery/commerce.md` |
| `wp-checkout-payments` | checkout, gateways, shipping, tax, order-pay | `docs/wp-discovery/commerce.md`, `docs/checkout.md` |
| `wp-bookings` | bookings/appointments/tours/rentals | `docs/wp-discovery/bookings.md` |
| `wp-auth-wholesale` | accounts, auth, wholesale pricing/ordering | `docs/wp-discovery/auth-wholesale.md` |
| `wp-content-seo` | pages, Divi, menus, media, SEO, redirects, forms | `docs/wp-discovery/content-seo.md` |
| `wp-spikes` | an integration is unproven and needs an end-to-end test | `docs/wp-discovery/spike-results.md` |
| `frontend-substrate` | any UI/interaction/animation/loading work | `docs/craft/*`, components |
| `site-base` | after discovery; wire routes, data and URL parity | `docs/site/base.md`, routes, `src/config/site.ts` |
| `design-adaptation` | "match this screenshot", new brand, restyle | `docs/site/<client>/design-tokens.md` |
| `verification` | before considering any UI done | test output |
| `cutover` | moving to production / new domain | `docs/cutover.md` |

## Shared references

`_shared/` holds cross-skill material. Load the specific file, not the folder.

- `probe-commands.md` — read-only curl/node probes.
- `plugin-fingerprints.md` — route/script → plugin map.
- `risk-rubric.md` — how to score residual routes.
- `route-ledger-template.md`, `capability-register-template.md`.
- `field-notes.md` — per-site lessons.
- `design-brief-template.md` — screenshot/reference intake.
- `quality-gates.md` — the exact commands and DoD for UI work.

## Rules for editing this set

- A skill is a procedure, not an essay. Keep `SKILL.md` short; push detail into
  `references/` and load it only when needed.
- Stay generic. Site facts live in `docs/wp-discovery/` and `docs/site/`.
- No skill except `wp-spikes` may mutate the WordPress backend.
- No skill may invent a capability the backend does not expose.
- If a lesson generalises, promote it into the relevant skill or `_shared/`.
- Delete unused procedures. A skill that is never needed is token debt.
