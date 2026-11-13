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
| `tests/a11y` | axe on home, category, PDP, cart, checkout, account; no serious/critical |
| `tests/motion` | under `prefers-reduced-motion: reduce`, content is visible and not stuck transformed |
| `tests/states` | primary button, nav item, card, input, quantity control render hover, focus-visible, active, disabled |
| `tests/parity` | sample per product type matches the original on name, price, gallery, breadcrumb, related |
| `tests/nav` | client navigation: paginate/filter then new items are visible |
| `tests/identity` | guest request never receives a signed-in/cart response; no shared cache |

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
