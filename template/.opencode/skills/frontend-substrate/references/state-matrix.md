# Interaction State Matrix

Every interactive element must declare all of its applicable states. Missing a
state is a defect, not a detail. Prefer a blessed component that already
implements this table over a hand-rolled element.

## Universal states

| State | Rule | How to express |
|---|---|---|
| Default | Always | base classes |
| Hover | Pointer devices only; never the only affordance | `hover:` (wrapped in `@media (hover: hover)` if it can stick on touch) |
| Focus-visible | Keyboard focus must be obvious and on-brand | `focus-visible:` ring/outline offset; never remove without a replacement |
| Active/pressed | Momentary feedback | `active:` transform/colour, 100–150ms |
| Disabled | Not actionable; still readable | reduced opacity + `cursor-not-allowed`; keep contrast legible |
| Loading | Action in flight | spinner/loader, `aria-busy`, disabled while pending |
| Success | Confirmed | label/icon change, then settle |
| Error | Failed | inline message (`role="alert"`), retry affordance |
| Reduced motion | No animation | CSS reset + no JS animation |

## By element

| Element | Required states |
|---|---|
| Button (primary/accent/outline/ghost) | default, hover, focus-visible, active, disabled, loading, success/error where it performs an action |
| Link / nav item | default, hover, focus-visible, active/current |
| Card / tile | default, hover (image/label), focus-visible when the whole card is a link |
| Input / select / textarea | default, hover, focus, filled, disabled, invalid (+ message), valid where useful |
| Checkbox / radio / toggle | default, hover, focus-visible, checked, disabled, invalid |
| Quantity stepper | default, hover, focus-visible, disabled, loading, min/max bounds |
| Tab / filter chip | default, hover, focus-visible, selected (`aria-pressed`/`aria-selected`), disabled |
| Variation selector (colour, size, option) | default, hover, focus-visible, selected, available, unavailable combination (disabled), out-of-stock, partial-null fallback, keyboard/`aria-checked` for swatches, error when no combination is valid |
| Modal / drawer | open/close, enter/exit, focus trap, Escape, click-outside, scroll lock |
| Toast | adding, added, error, dismiss; persistent `aria-live="polite"` |
| Image slot | placeholder visible (never blank/transparent), decoded reveal, error fallback, no-image, explicit aspect ratio |
| Navigation pending | route pending skeleton or overlay, reduced-motion static, cleared on route commit |
| Skeleton | shape matches the incoming layout, `aria-busy`, no layout shift when data lands |
| Empty list / cart | empty state with copy + next action |
| Form submit | idle, submitting, success, error |

## Content states (not just controls)

- **Empty**: no results, empty cart, no orders, no downloads — each with a clear
  next step.
- **Partial**: missing image, missing variation attribute, unknown price range —
  degrade without crashing or showing raw ids.
- **Stale**: a 409/stale total → refresh and ask the shopper to retry.
- **Offline / failed fetch**: visible message + retry, never a spinner forever.

## Accessibility pairings

- Icon-only button → `aria-label`.
- Toggle → `aria-expanded` / `aria-pressed`.
- Loader → `role="status"`; pending region → `aria-busy="true"`.
- Dialog → `role="dialog"`, `aria-modal="true"`, labelled, focus trapped.
- Error → `role="alert"`; error text repeated inline near the action.
- Divider/decorative overlay → `aria-hidden`, `pointer-events-none`.
- Use real `<button type="button">` for actions, `<Link>` for navigation.

## Review prompt (cheap)

For each changed interactive element, answer in one line: does it have the
states marked required above? If a state is intentionally omitted, write why.
