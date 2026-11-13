# Motion Scale

One easing family, a small set of durations, and a clear rule for CSS vs the
motion library. If a value is not on this scale, it does not ship.

## Easing

| Token | Curve | Use |
|---|---|---|
| `ease-out` (signature) | `cubic-bezier(0.22, 1, 0.36, 1)` | Enter, reveal, hover, most UI. The default. |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetric moves, carousels, loops. |
| `linear` | `linear` | Marquee, ambient loops only. |

The JS constant and the CSS token must be the same curve. Change both together.
Do not add a fourth curve for one component.

## Durations

| Token | Value | Use |
|---|---|---|
| micro | 120–160ms | press, colour/opacity toggle, small icon |
| fast | 200–300ms | hover lift, chip/select, small reveals |
| base | 350–500ms | panel open, toast, section transition |
| slow | 600–800ms | page/section entrance, image reveal |
| ambient | 6–20s | hero zoom, marquee, slow parallax |

Rules:

- Press feedback: micro. Hover: fast. Entrances: base/slow. Loops: ambient.
- Stagger between list items: 40–80ms. Total entrance under ~1s for a viewport.
- Do not use `transition-all`. Name the properties (`transition-colors`,
  `transition-transform`, `transition-opacity`) or use the motion library.
- No inline magic durations outside this scale.

## CSS vs JS

| Use CSS | Use the motion library |
|---|---|
| hover/focus colour and transform | presence (mount/unmount) |
| reveal on scroll (IntersectionObserver + class) | staggered orchestration |
| looping ambient animation | scroll-linked transforms |
| simple enter transition | layout/`layoutId` transitions |
| anything that can run off the main thread | sequence that needs state |

## Reveal and entrance

- **Hero/headline**: word-by-word rise from a clip mask, once per view.
- **Sections**: fade + small rise (12–24px), once per view.
- **Lists/grids**: staggered items; key the group by the data identity so a
  same-route filter/pagination change remounts it and re-fires the reveal.
- **Do not** reveal above-the-fold LCP content from `opacity: 0`.
- **Do not** require a large visible area; partially visible grids must reveal.

## Reduced motion

- JS: wrap the app in the motion provider with `reducedMotion="user"`.
- CSS: force-reset every new keyframe/utility in the
  `prefers-reduced-motion: reduce` block.
- Reduced motion removes motion, never content. The final state must be visible.

## Anti-patterns

- A per-component easing curve.
- `transition-all`.
- Animating width/height/top/left.
- `initial={{ opacity: 0 }}` on the LCP element.
- A scroll handler that calls `setState` on every pixel.
- A new keyframe that is not added to the reduced-motion reset.
