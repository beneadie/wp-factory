---
name: project-orchestrator
description: Use when starting or resuming a headless WordPress/WooCommerce frontend build, or when deciding what to do next. Owns the phase order, the gates between phases, and the artifact map. Load this before any other skill on a new site.
---

# Project Orchestrator

The front door. A headless build is a sequence with hard gates; this skill keeps
an agent from jumping to UI before the money, identity, booking and legal paths
are proven, and from calling something "done" before the substrate and the skin
are actually verified.

On a directory that has not been bootstrapped yet (no `.env.local`, no
`docs/site/site-profile` facts), run `project-bootstrap` first. It is the only
thing that turns a bare domain into a site directory this skill can route.

This skill does not discover and does not build. It routes.

## The one rule

**Discovery before build; proof before UI; verification before ship.** If an
agent is about to write a component and cannot name the route, auth mode and
write path behind it, the build is blocked.

## Phases and gates

Load `agent-conduct` before this skill and keep it in force throughout.

`SITE_MODE` narrows the table, it does not change the order. A content site skips
Phases 2b, 3 and 4c and marks them `SKIPPED — no Store API`. A store runs them.

| Phase | Skill | Exit gate |
|---|---|---|
| 0. Intake | `wp-intake` | Capability register covers every capability the site actually has — money/inventory/identity/booking/legal where present, content/SEO/forms where not — each with source, auth, evidence, risk, owner. |
| 1. Unknowns | `wp-unknowns` | Every residual route has a verdict; every expected journey is mapped/manual/third-party/out-of-scope/missing; `admin-ajax`/`wc-ajax`/iframes scanned. |
| 2a. Content audit | `wp-content-seo` | Every page, post, menu, form and metadata source is mapped. |
| 2b. Commerce audit (store only) | `wp-catalog-cart`, `wp-checkout-payments`, `wp-bookings`, `wp-auth-wholesale` | One capability, one owner. Product types, cart contract, gateway and identity paths recorded. |
| 3. Proof (when a write path exists) | `wp-spikes` | Every money/inventory/identity/booking capability the build claims is PASS or has a written accepted risk. |
| 4a. Base | `site-base` | Routes and data correct in the site's mode; catalogue selectors work in store mode. |
| 4c. Commerce build (store only) | `store-checkout` | Cart, shipping, checkout and payment handoff round-trip against the proven API. |
| 4b. Substrate | `frontend-substrate` | Pending paint, placeholders, states and reduced motion in place on every page type. |
| 5. Verify | `verification` | `npm run check` and `check:perf` pass; parity, a11y, reduced-motion, states, options and brand assets checked; `docs/verification/perf.json` exists. |
| 6. Ship | `cutover` | Redirects, callbacks, DNS, SEO, rollback verified. |

Phases 1 and 2 can run in parallel. Everything else is ordered.

## Artifact map

Site facts are durable; skills stay generic. Write discovery to:

```
docs/wp-discovery/
  site-profile.md
  capability-register.md
  route-ledger.md
  unknowns.md
  commerce.md
  bookings.md
  auth-wholesale.md
  content-seo.md
  spike-results.md
```

Build facts:

```
docs/craft/            # generic substrate docs, usually shipped once per template
  design-system.md
  motion.md
  page-archetypes.md
  interaction-states.md
docs/site/<client>/
  base.md              # route map, data source per route, what is stubbed
  commerce-build.md    # store only: cart/checkout routes, BFF, deferred work
  06-brand-assets.md   # icons, manifest, OG image, logo, fonts (or "missing")
  design-tokens.md     # per-client skin
  design-brief.md      # screenshot/reference intake
docs/verification/
  perf.json            # check:perf output; required by Phase 5
docs/checkout.md       # integration notes for this backend
docs/cutover.md        # ship runbook for this backend
```

If the repo already has equivalent files (for example `docs/integration-audit.md`
or `docs/spike-results.md`), **reuse and update them**. Do not create parallel
truth.

## Status file

Keep `docs/site/00-status.md` current. One line per phase, with the gate state
and the blocking item:

```markdown
# Build status

Site: Acme Wool
WordPress origin: https://acme.ie
Site mode: store
Phase 0 Intake: PASS — register complete
Phase 1 Unknowns: IN PROGRESS — 12 residual routes unclassified
Phase 2a Content: PASS
Phase 2b Commerce: IN PROGRESS — wholesale owner undecided
Phase 3 Spikes: PENDING — redirect gateway, price parity
Phase 4a Base: NOT STARTED
Phase 4c Commerce: NOT STARTED
Phase 4b Substrate: NOT STARTED
Phase 5 Verify: NOT STARTED
Phase 6 Ship: NOT STARTED
```

One line per phase, no bullet, status word first. That is a machine contract:
the runner greps these lines to decide whether a phase reached its gate, so do
not reword the label or bury the status in a sentence.

A new agent reads this file first, then loads only the skill for the current
phase. A phase is finished only when its line reads `PASS` or `SKIPPED`; use
`BLOCKED — <reason>` when it cannot finish, and stop.

## Routing rules

- No index / no site profile → `wp-intake`.
- Intake done but "what about this route?" → `wp-unknowns`.
- Two namespaces for one capability → stop, audit, record the owner.
- A form or mutation is about to be built → `wp-spikes` first.
- Backend proven and correct → `frontend-substrate` (build the interaction
  engineering once, generically).
- `SITE_MODE=store` and the catalogue exists → `store-checkout` for cart,
  shipping, checkout and payment handoff.
- Design/screenshot handed over → `design-adaptation`.
- Any UI change finished → `verification`.
- Ready to launch → `cutover`.

## Definition of done for the project

- [ ] Capability register complete and gated.
- [ ] No unclassified residual route.
- [ ] Every money/identity/booking/legal path the build claims is PASS or has an
      accepted risk. A site with none of those is not a failure.
- [ ] Product type census covers every type actually sold (store only).
- [ ] Panel/cart/checkout/account/booking work through the shipped path (store
      only).
- [ ] Variable products are configurable; invalid combinations unavailable
      (store only).
- [ ] Substrate contracts (loading, optimistic cart, images, reduced motion,
      a11y) are present on every page type.
- [ ] Navigation paints within 200ms; image slots never blank; LCP never hidden.
- [ ] Icons, apple-touch-icon and OG image are present (or recorded missing).
- [ ] `check:perf` passes and `docs/verification/perf.json` exists.
- [ ] Skin matches the reference on desktop and mobile.
- [ ] `npm run check` passes.
- [ ] Redirect map and SEO parity verified.
- [ ] Payment callback and order-pay reachable at cutover.
- [ ] Rollback plan written.

## Anti-patterns

- Starting the build from a screenshot before the backend contract is known.
- Treating "the index lists it" as "it is used."
- Building a booking/gift-card/subscription form like a simple add-to-cart.
- Letting `frontend-substrate` invent brand choices, or `design-adaptation`
  rewrite interaction behaviour.
- Declaring done after typecheck + lint. That is the floor, not the bar.
- Creating a second set of docs next to the existing ones.
