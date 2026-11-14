---
name: frontend-substrate
description: Use after site-base to build or change the felt experience of the headless frontend - loading and error states, motion, images, navigation progress, cart feedback, focus and accessibility. Owns the brand-agnostic engineering that makes the site feel fast, alive and reactive. Does not own routes, data sources or visual design.
---

# Frontend Substrate

The felt experience is a contract, not a side effect. This skill defines the
engineering every page must inherit: streaming and skeletons, one motion
language, optimistic feedback, the image pipeline, navigation progress, focus
and accessibility, and identity-safe caching.

It is **brand-agnostic**. Colours, type, spacing rhythm and section styling come
from `design-adaptation` and the per-client token file. If you are choosing a
palette or matching a screenshot, you are in the wrong skill.

## Scope

This skill runs **after `site-base`**. Routes, data sources and page composition
belong to `site-base`: do not add a route or a fetch here. If a page does not
render real data yet, the build is blocked in `site-base`, not something to work
around with a skeleton around an empty list.

## The two-layer rule

| Layer | Owner | May change per client? |
|---|---|---|
| Substrate: interaction, motion timing, loading, states, images, a11y, caching | this skill | **No.** It is fixed and reused. |
| Skin: palette, type, spacing, radii, section layout, imagery treatment | `design-adaptation` | Yes, from a reference. |

A restyle must never change how the cart, loading, focus, or reduced-motion
behave. A new section must never invent a second motion or loading system.

## Perceived performance (contract)

Every async transition is visible, and the content area never goes blank:

- After a click, the content area paints **within 200ms** and is **never blank
  for more than 500ms**. This is measured by `npm run check:perf`, not judged.
- `loading.tsx` is a valid tool only where the segment can never call
  `notFound()`: a segment fallback flushes the HTTP shell, so a later 404 can no
  longer return a 404 status. Where 404s matter, use a client-driven pending
  skeleton (`useLinkStatus` / `useTransition`) in the layout instead.
- Prefetch must actually work: anything that forces dynamic rendering
  (`searchParams` in a page, `cookies()`, `no-store`) silently disables it for
  every link. Audit before adding a pending overlay.
- Skeletons mirror the incoming layout so data landing causes no layout shift.

## Images (contract)

- `next/image` with explicit `sizes`; `priority` on exactly one LCP image per
  view. Everything else lazy.
- Render a placeholder until the image decodes, then cross-fade. Keep
  `minVisibleMs` 600–900ms so it does not flash on a fast cache hit.
- Retry a failed load once, then fall back to the origin URL unoptimised. A CDN
  is an optimisation, not a dependency.
- **Remote media must be allowlisted** by the image CDN (for example
  `remote_images` in the host config). Symptom when it is not: local assets
  render and every WordPress media URL 404s.
- **Cold transforms can return `202` with an empty body.** Browsers treat that
  as a broken image and do not retry. The retry above covers it; do not remove
  it, and keep the first product row eager so its transform starts early.
- Never hard-delay images to a fixed reveal time. The placeholder stays until
  decode; a fixed delay exposes blank frames whenever the origin is slow.

## Non-negotiables

- **Server-first.** Fetch and render data in server components. Add `"use client"`
  only to the smallest interactive leaf. Never convert a page to client to add
  motion.
- **One motion language.** One shared easing curve (and one in/out variant), one
  duration scale, one reveal primitive. Do not add curves or ad-hoc durations.
- **Reduced motion on both paths.** JS via the motion provider; CSS via the
  `prefers-reduced-motion` reset. A new CSS animation must be added to the reset.
- **No dead primitives.** A primitive ships only if it is used on a shipped page.
  If a design later needs one, add it then and record where it is used.
- **States are structural, not remembered.** Use blessed components that already
  contain hover, focus-visible, active, disabled, loading, success and error.
  Do not hand-roll a button and hope the agent remembers the states.
- **Every async action is visible.** Loading, success and error are all
  represented; no dead clicks, no silent failures.
- **Responses never arrive out of order.** Tag each optimistic request and
  ignore a stale completion, so a slow first click cannot overwrite a fast
  second one.
- **Animate transform and opacity.** Not layout. Respect the frame budget.
- **Identity is never cached across users.** Cart, account and role-priced
  responses are `no-store` and read through the BFF.
- **Exactly one LCP image per view.** Everything else lazy, with explicit sizes.

## Inputs

- The proven backend contract (`docs/wp-discovery/*`, `docs/checkout.md`).
- The per-client token file (`docs/site/<client>/design-tokens.md`) or the
  template defaults.
- `docs/craft/*` for the generic design system, motion scale, archetypes and
  state matrix.

## Build order

1. **Read** the current craft docs and the blessed component inventory. Reuse
   before creating.
2. **Structure** the page as server components; decide the skeleton shape.
3. **Data**: fetch with the typed client; set revalidation; keep identity data
   `no-store`.
4. **Compose** sections from archetypes/section primitives; do not build a new
   layout language for one page.
5. **Add interaction** with the smallest client component. Wire the existing
   loading/optimistic/toast/event-bus patterns.
6. **Add imagery** through the image component with `sizes`, priority only on
   LCP, and the placeholder/retry behaviour.
7. **Apply the state matrix** to every interactive element (see references).
8. **Verify** with `verification` before calling it done.

## Substrate core (always present)

These are not optional; they are the product.

- **Route transition** at the app template level. Pages do not add their own
  enter animation on top.
- **Navigation progress** for client navigations, skipping external/hash/mailto
  and clicks that go nowhere. A **query-only** change (pagination, sort) is a
  real navigation: skipping it on "same path" makes the page look frozen.
- **Route skeletons** that mirror the real layout, plus `Suspense` around slow
  sections so the page streams. Where a segment cannot 404, a `loading.tsx` is
  fine; where it can, use the navigation pending overlay instead (see above).
- **Navigation pending state**: a route-level skeleton or overlay that appears
  after ~120ms and clears on commit, so the screen is never static while the
  server responds. The link-local spinner is not enough on its own.
- **In-page pending state** for filters/sort/pagination, with scroll preserved.
- **Optimistic cart feedback**: bump the count immediately, then reconcile with
  the authoritative cart; a single toast component for add/added/error.
- **Image pipeline**: responsive `sizes`, LCP priority, a **visible** placeholder
  (never a transparent or blank slot) with `minVisibleMs` 600–900ms, one retry,
  CDN/origin fallback. Reserve the slot with an explicit aspect ratio so nothing
  shifts.
- **Sticky shell**: header shrink with hysteresis (not a single threshold),
  hover-intent nav, safe-area aware sticky controls.
- **Focus and ARIA**: visible focus, labelled icon buttons, `aria-expanded`,
  `role="status"` loaders, `aria-busy` pending regions, dialog semantics.
- **Data split**: ISR for public catalog/content; `no-store` for cart, account,
  wholesale and any identity-dependent response.

## Recipes (add only when a design needs them)

Carousel/hero slideshow, parallax media, counters, cursor-zoom gallery,
lightbox, sticky buy bar, mega-menu, testimonial marquee, disclosure. Each is a
recipe, not a tax: add it when the reference calls for it, and record where it
is used.

## Selection controls

Variable products are configured, not printed. A control per variation attribute
(colour, size, option) must exist as soon as the product is `variable`, even when
add-to-cart is out of scope — selection still drives the displayed price, stock,
SKU and image, labelled as an availability preview.

- Derive attributes and their order from the parent `variations[]`, never from
  the `type=variation` query.
- A combination that does not exist must be unavailable, not accepted silently.
- Partial-null variation attributes degrade per `wp-catalog-cart`; never show a
  raw id or an empty control.
- Swatches need `aria-checked`/`aria-pressed`, a focus ring and a text fallback;
  a `<select>` is a valid, accessible default.
- The states live in `references/state-matrix.md` (variation selector row).

## Content-only sites

When `SITE_MODE=content` there is no Store API: apply the substrate to
navigation, loading, images, focus and motion, and ship no cart, checkout,
account or product UI. Selection controls do not apply.

## Motion scale

Use the scale in `references/motion-scale.md`. In short: one easing family, a
small set of durations (micro, fast, base, slow, ambient), CSS for simple
fades/transforms, the motion library for orchestration (stagger, presence,
scroll-linked). No `transition-all`. No duration invented inline.

## Performance budget

- Animate `transform` and `opacity`; avoid animating size/position/layout.
- No scroll listeners that set state more than necessary; use passive listeners
  and thresholds/hysteresis.
- Prefer CSS for looping/ambient animation; it runs off the main thread.
- Do not animate above-the-fold LCP content from `opacity: 0` on first paint.
- Keep JS animation to small client islands.
- Test with reduced motion and a mid-tier mobile profile.

## Acceptance checklist

- [ ] Page renders server-side; only leaves are client components.
- [ ] Skeleton matches the real layout; no blank/spinner-only page.
- [ ] Navigation paints within 200ms and is never blank longer than 500ms.
- [ ] Every image slot shows a visible placeholder (min 600–900ms) and never the
      LCP image hidden.
- [ ] Variable products render a working selector; invalid combinations are
      unavailable.
- [ ] Every action has loading, success and error feedback.
- [ ] List pagination and sorting show a pending state; no silent full-page
      stall on a query-only navigation.
- [ ] Cart count updates optimistically and reconciles with the server.
- [ ] Every image has `sizes`; exactly one LCP priority; placeholder + retry.
- [ ] All interactive elements satisfy the state matrix (hover, focus-visible,
      active, disabled, keyboard).
- [ ] Reduced-motion hides motion but never content.
- [ ] Identity-dependent data is not cached across users.
- [ ] No new easing curve, no `transition-all`, no dead primitive.
- [ ] `npm run check` passes.

## Anti-patterns

- Converting a page to a client component to make one thing animate.
- A new toast, loader, easing curve, or reveal system "just for this page."
- Hover-only interaction with no focus-visible or keyboard path.
- Animating layout, or a scroll handler that re-renders the page.
- `opacity: 0` initial state on the LCP element.
- Caching a wholesale or account response in shared ISR.
- Shipping a primitive nobody uses.
- A query-only navigation (pagination, sort) with no pending state because the
  progress bar skips same-path clicks. The route segment does not remount, so no
  `loading.tsx` rescues it either — route it through the in-page pending state.
- Treating typecheck + lint as "verified".

## References

- `references/state-matrix.md` — the states every interactive element must have.
- `references/motion-scale.md` — easing, durations, and CSS-vs-JS rules.
- `docs/craft/design-system.md` — tokens, type, spacing, component classes.
- `docs/craft/page-archetypes.md` — section library and per-page composition.

`docs/craft/` is created on the first build pass. If it does not exist yet, write
`design-system.md` (tokens and component classes) and `page-archetypes.md`
(sections per page type) before adding page-level UI, so later pages reuse them.
