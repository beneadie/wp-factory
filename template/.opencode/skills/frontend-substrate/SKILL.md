---
name: frontend-substrate
description: Use when building or changing frontend UI on the headless storefront - pages, sections, components, interactions, animations, loading states, images, navigation, cart feedback, or forms. Owns the brand-agnostic engineering that makes the site feel fast, alive and reactive. Do not use for backend discovery.
---

# Frontend Substrate

The felt experience is a contract, not a side effect. This skill defines the
engineering every page must inherit: streaming and skeletons, one motion
language, optimistic feedback, the image pipeline, navigation progress, focus
and accessibility, and identity-safe caching.

It is **brand-agnostic**. Colours, type, spacing rhythm and section styling come
from `design-adaptation` and the per-client token file. If you are choosing a
palette or matching a screenshot, you are in the wrong skill.

## The two-layer rule

| Layer | Owner | May change per client? |
|---|---|---|
| Substrate: interaction, motion timing, loading, states, images, a11y, caching | this skill | **No.** It is fixed and reused. |
| Skin: palette, type, spacing, radii, section layout, imagery treatment | `design-adaptation` | Yes, from a reference. |

A restyle must never change how the cart, loading, focus, or reduced-motion
behave. A new section must never invent a second motion or loading system.

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
  and same-path clicks.
- **Route skeletons** that mirror the real layout, plus `Suspense` around slow
  sections so the page streams.
- **In-page pending state** for filters/sort/pagination, with scroll preserved.
- **Optimistic cart feedback**: bump the count immediately, then reconcile with
  the authoritative cart; a single toast component for add/added/error.
- **Image pipeline**: responsive `sizes`, LCP priority, placeholder until
  decode, one retry, CDN fallback to the origin URL.
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
- [ ] Every action has loading, success and error feedback.
- [ ] Cart count updates optimistically and reconciles with the server.
- [ ] Every image has `sizes`; exactly one LCP priority; placeholder + retry.
- [ ] All interactive elements satisfy the state matrix (hover, focus-visible,
      active, disabled, keyboard).
- [ ] Reduced-motion hides motion but never content.
- [ ] Identity-dependent data is not cached across users.
- [ ] No new easing curve, no `transition-all`, no dead primitive.
- [ ] `check:ui` passes.

## Anti-patterns

- Converting a page to a client component to make one thing animate.
- A new toast, loader, easing curve, or reveal system "just for this page."
- Hover-only interaction with no focus-visible or keyboard path.
- Animating layout, or a scroll handler that re-renders the page.
- `opacity: 0` initial state on the LCP element.
- Caching a wholesale or account response in shared ISR.
- Shipping a primitive nobody uses.
- Treating typecheck + lint as "verified".

## References

- `references/state-matrix.md` — the states every interactive element must have.
- `references/motion-scale.md` — easing, durations, and CSS-vs-JS rules.
- `docs/craft/design-system.md` — tokens, type, spacing, component classes.
- `docs/craft/page-archetypes.md` — section library and per-page composition.

`docs/craft/` is created on the first build pass. If it does not exist yet, write
`design-system.md` (tokens and component classes) and `page-archetypes.md`
(sections per page type) before adding page-level UI, so later pages reuse them.
