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

| Phase | Skill | Exit gate |
|---|---|---|
| 0. Intake | `wp-intake` | Capability register has every money/inventory/identity/booking/legal row with source, auth, evidence, risk, owner. |
| 1. Unknowns | `wp-unknowns` | Every residual route has a verdict; every expected journey is mapped/manual/third-party/out-of-scope/missing; `admin-ajax`/`wc-ajax`/iframes scanned. |
| 2. Domain audit | `wp-catalog-cart`, `wp-checkout-payments`, `wp-bookings`, `wp-auth-wholesale`, `wp-content-seo` | One capability, one owner. No overlap unresolved. |
| 3. Proof | `wp-spikes` | Every money/inventory/identity/booking/legal capability is PASS or has a written accepted risk. |
| 4. Build | `site-base` then `frontend-substrate`, then `design-adaptation` | Data correct, substrate contracts in place, skin matches the reference. |
| 5. Verify | `verification` | `check:ui` passes; parity, a11y, reduced-motion, states checked. |
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
  design-tokens.md     # per-client skin
  design-brief.md      # screenshot/reference intake
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
Phase 0 Intake: PASS — register complete
Phase 1 Unknowns: IN PROGRESS — 12 residual routes unclassified
Phase 2a Content: PASS
Phase 2b Commerce: BLOCKED — wholesale owner undecided
Phase 3 Spikes: PENDING — Realex redirect, price parity
Phase 4a Base: NOT STARTED
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
- Design/screenshot handed over → `design-adaptation`.
- Any UI change finished → `verification`.
- Ready to launch → `cutover`.

## Definition of done for the project

- [ ] Capability register complete and gated.
- [ ] No unclassified residual route.
- [ ] Every money/identity/booking/legal path has a PASS or accepted risk.
- [ ] Product type census covers every type actually sold.
- [ ] Panel/cart/checkout/account/booking work through the shipped path.
- [ ] Substrate contracts (loading, optimistic cart, images, reduced motion,
      a11y) are present on every page type.
- [ ] Skin matches the reference on desktop and mobile.
- [ ] `check:ui` passes.
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
