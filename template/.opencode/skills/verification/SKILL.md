---
name: verification
description: Use before considering any frontend change done, or before shipping. Runs the cheap deterministic checks that catch weak attempts - data parity, accessibility, reduced motion, interaction states, performance and identity-safe caching. Do not use for backend discovery.
---

# Verification

A change is not done because it typechecks. This skill is the gate that catches
the weak attempt: missing states, broken reduced motion, data regressions,
cross-user cache leaks, and visual drift.

The point is to **run commands**, not to re-read a long rubric. Most of the bar
should be enforced by the repo (lint rules, blessed components, tests). This
skill runs those gates and does the few things a machine cannot.

## Non-negotiables

- Run the repository's check command; do not substitute a prose review.
- Test the client navigation and interaction, not only a hard reload.
- Test reduced motion and keyboard focus, not only the pointer happy path.
- Compare the new site with the original for data, not only for looks.
- Never sign off an identity-dependent page without confirming it is uncached
  across users.
- Fix or record every failure; "looks fine" is not a result.

## The check command

Prefer one entry point so the agent does not have to remember many steps:

```bash
npm run typecheck
npm run lint
npm run build
npm run check:ui      # a11y + reduced-motion + interaction-state + parity smoke
```

If `check:ui` does not exist yet, add it before shipping (see
`_shared/quality-gates.md`). Until then run the manual checks below.

## Machine checks (preferred)

- **Accessibility**: axe on home, category, PDP, cart, checkout, account. Fail on
  serious/critical.
- **Reduced motion**: emulate `prefers-reduced-motion: reduce`; assert content is
  visible (no `opacity: 0`, no stuck transforms).
- **Interaction states**: for the primary button, nav item, card, input and
  quantity control, assert hover, focus-visible, active and disabled render.
- **Client navigation**: load, paginate/filter, then assert new items are visible
  (catches stale-instance reveal bugs).
- **Parity**: for a sample covering every product type (simple, variable,
  booking, on-sale, out-of-stock, variation sharing the parent slug), compare
  name, price, gallery count/primary, breadcrumb and related products between the
  original and the new site.
- **Identity**: cart/account/wholesale responses have no shared cache; a guest
  request never sees a signed-in response.

## Manual checks (the part a machine misses)

- The page feels alive: skeletons, transitions, optimistic feedback, no dead
  clicks, no layout jump when data lands.
- Exactly one LCP image; the rest lazy with correct `sizes`.
- Long product names and long category copy do not break layout.
- Empty states (empty cart, no results, no orders) read well and offer a next step.
- Errors are visible, humanized, and actionable (409 retry, nonce refresh,
  helper unavailable fallback).
- Copy tone matches the rest of the site.
- Mobile: touch targets, safe areas, sticky elements, nav.

## Per-capability checks

For backend-driven features, the domain skill's acceptance list still applies:

- `wp-catalog-cart` — types, variations, add-to-cart, coupons.
- `wp-checkout-payments` — gateways, shipping, final total, order verification.
- `wp-bookings` — slot, add path, cart line, timezone.
- `wp-auth-wholesale` — login/logout, ownership, price parity through cart.
- `wp-content-seo` — metadata, JSON-LD, sitemap/robots, redirects, forms.

## What "done" means

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `check:ui` passes (or the manual equivalents are recorded).
- [ ] Parity sample checked against the original.
- [ ] Reduced motion and keyboard paths checked.
- [ ] No cross-user caching.
- [ ] No dead clicks, no silent errors.

## Anti-patterns

- Declaring success from a typecheck alone.
- Testing only a direct reload.
- Checking the pointer path and skipping keyboard and reduced motion.
- Screenshot-diffing everything (brittle) instead of asserting text/attributes.
- Comparing the new site to itself instead of to the original.
- Ignoring a known-open spike check because the page "looks right".
