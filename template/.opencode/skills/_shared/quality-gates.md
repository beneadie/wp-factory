# Quality Gates (token-efficient)

The bar for frontend work is enforced by **code and commands**, not by an agent
re-reading a long rubric every turn. Do not memorise this file; make the repo do
the work.

## Philosophy

- **Structural beats remembered.** A blessed component with states baked in is
  cheaper and safer than an agent recalling a checklist.
- **Deterministic beats judgement.** A failing test catches a weak attempt; prose
  does not.
- **Thin skills, strong repo.** Keep `SKILL.md` short. Put the enforcement in
  lint rules, component contracts and tests.
- **Progressive disclosure.** Load a reference only when the current task needs
  it.

## The one command

Provide a single entry point and run it before any UI change is "done":

```bash
npm run check:ui
```

It should compose:

```jsonc
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "build": "next build",
    "check:ui": "npm run typecheck && npm run lint && npm run test:a11y && npm run test:motion && npm run test:states",
    "check:perf": "node scripts/check-perf.mjs",
    "test:a11y": "playwright test tests/a11y",
    "test:motion": "playwright test tests/motion",
    "test:states": "playwright test tests/states",
    "test:parity": "playwright test tests/parity"
  }
}
```

Start with a subset; add specs as pages land. The important thing is that the
command exists, is fast, and fails loudly.

## Suggested lint rules

Add these as the codebase matures. They catch the most common weak attempts
without spending model tokens.

- Ban `transition-all`; require an explicit property.
- Require `sizes` when the image component is used.
- Ban raw hex colours in `className`; use token classes.
- Restrict arbitrary values (`[...]`) in class names to an allowlist.
- Prefer blessed components (`Button`, `Link`, `Field`, `Card`) over raw elements
  that re-implement states.
- Disallow new keyframes without a matching reduced-motion entry (custom rule or
  review script).
- Flag a component file that exports a primitive with no import elsewhere (dead
  primitive).

## Test specs to own

| Spec | Asserts |
|---|---|
| `tests/a11y` | axe on home, page and index (PDP/cart/account only in a commerce build); no serious/critical |
| `tests/motion` | under `prefers-reduced-motion: reduce`, content is visible and not stuck transformed |
| `tests/states` | primary button, nav item, card, input render hover, focus-visible, active, disabled |
| `tests/parity` | sample of page types matches the original on title, content and metadata |
| `tests/nav` | client navigation: paginate/filter then new items are visible |
| `check:perf` | pending paint ≤200ms; no blank content >500ms; CLS <0.1; LCP <2.5s on Slow 3G; every image slot shows a placeholder |
| `check:brand` | `<link rel=icon>` and `og:image` exist in the built HTML and resolve 200 |
| `tests/options` | commerce builds only: variable products render selectors and valid combinations update price/stock |

## Perceived performance, brand assets, selections

These three are invisible to `typecheck`, `lint` and `build`. Enforce them by
measurement or they will regress silently.

- **Navigation:** after a click the content area must paint within **200ms** and
  must never stay blank for more than **500ms**. `loading.tsx` is optional (a
  segment fallback flushes a 200 shell, which breaks `notFound()`); a
  client-side pending skeleton driven by `useLinkStatus`/`useTransition` gives
  the same feel without that cost.
- **Media:** no image slot may be transparent or blank while loading. Render a
  placeholder (pattern, shimmer, or the client's brand asset) with
  `minVisibleMs` 600–900ms, an explicit aspect ratio, and a reduced-motion static
  fallback. Never hide the LCP image.
- **Brand assets:** icons (32/192), apple-touch-icon, `/favicon.ico`, manifest,
  `og:image`, logo and brand fonts are discovered from the origin, not invented.
  Emit them via `src/app/icon.png`, `apple-icon.png`, `opengraph-image` and
  `manifest.ts`.
- **Selections:** variable products render a control per variation attribute
  from the parent's `variations[]`, with invalid combinations unavailable. This
  applies even when purchasing is out of scope; selection still updates the
  displayed price, stock and image.

`npm run check:perf` writes `docs/verification/perf.json`; it is a required
artifact for the verify phase.

## Blessed component contract

Each blessed component owns its states so a caller cannot omit them:

- `Button` — variants + default/hover/focus-visible/active/disabled/loading.
- `Link` — default/hover/focus-visible/current.
- `Field` — default/focus/filled/disabled/invalid + message.
- `Card` — link wrapper + hover/focus/disabled/empty.
- `Loader` — `role="status"`, sized, reduced-motion safe.
- `Toast` — adding/added/error/dismiss, `aria-live`.

If a component is missing a state, fix the component once; do not patch each
call site.

## Tiny definition of done (UI)

1. `check:ui` passes.
2. The changed element satisfies the state matrix.
3. Reduced motion and keyboard paths work.
4. Parity sample checked against the original (if data changed).
5. No new easing curve, no `transition-all`, no dead primitive, no raw hex.

Return this list, not a page of rationale.
