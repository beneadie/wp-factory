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
npm run check          # typecheck + lint + build, one pass
bash scripts/check.sh --perf   # build once, one server, perf + brand checks
npm run check:ui       # optional: only if the repo has the Playwright suite
```

If `check:ui` does not exist yet, run the manual checks below and record that the
automated suite is deferred. Do not add a Playwright suite to a first-pass build
just to satisfy this list.

## Machine checks (preferred)

- **Accessibility**: axe on home, page and index. In a store build also PDP,
  cart, checkout and account. Fail on serious/critical.
- **Reduced motion**: emulate `prefers-reduced-motion: reduce`; assert content is
  visible (no `opacity: 0`, no stuck transforms).
- **Interaction states**: for the primary button, nav item, card, input and
  quantity control, assert hover, focus-visible, active and disabled render.
- **Client navigation**: load, paginate/filter, then assert new items are visible
  (catches stale-instance reveal bugs).
- **Parity**: for a sample covering page types (home, a nested page, an index,
  a form or contact page), compare title, content and metadata between the
  original and the new site. In a store build also cover product types (simple,
  variable, on-sale, out-of-stock, variation sharing the parent slug) on name,
  price, gallery count/primary, breadcrumb and related products.
- **Catalogue parity** (store only): total product count matches the API, and a
  sample matches on price, stock, image count and permalink.
- **Options** (store only): for variable products, assert a control exists per
  attribute, a valid combination updates price/stock/image, and invalid
  combinations are unavailable. This must hold even when no cart ships.
- **Cart** (store only): add, update, remove, coupon and shipping-rate selection
  round-trip, and totals match the API after every mutation.
- **Checkout** (store only): address → rates → final total → order creation;
  a moved total returns 409 and is handled; the payment redirect target host is
  the origin or the gateway, never arbitrary.
- **Brand assets**: the built HTML contains `<link rel="icon">`,
  `<link rel="apple-touch-icon">` and an `og:image`, and each URL resolves 200.
- **Perceived performance**: `npm run check:perf` writes
  `docs/verification/perf.json`. Navigation paints within 200ms and is never
  blank for more than 500ms; every image slot shows a placeholder; CLS < 0.1;
  LCP < 2.5s on Slow 3G where the browser measurement is available.
- **Identity** (store only): cart/account/wholesale responses have no shared
  cache; a guest request never sees a signed-in response, and the cart is
  cleared on auth transitions.

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
- [ ] `npm run check` passes (or the manual equivalents are recorded).
- [ ] `npm run check:perf` passes and `docs/verification/perf.json` exists.
- [ ] Store only: catalogue count and sample match the API; every variable
      product is configurable.
- [ ] Store only: cart, shipping and checkout round-trip against the API, and the
      payment redirect points at the origin or the gateway.
- [ ] Store only: no guest can see another guest's cart or account.
- [ ] Icons, apple-touch-icon and OG image are present and resolve.
- [ ] Navigation paints within 200ms; no blank content over 500ms.
- [ ] Every image slot shows a visible placeholder and the LCP image is never hidden.
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
- Signing off without `check:perf`; typecheck/lint/build say nothing about a
  blank screen or a missing favicon.
- Treating "no cart in this build" as "no option selection needed".
