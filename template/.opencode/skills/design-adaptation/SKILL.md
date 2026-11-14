---
name: design-adaptation
description: Use when applying a design to the headless site from screenshots or references - a new client skin, a restyle, "match this screenshot", or adapting the template to a different brand. Extracts tokens and restyles the skin without changing the interaction substrate.
---

# Design Adaptation

Turn a visual reference into a per-client skin. The substrate (loading, motion,
cart feedback, images, focus, a11y) is already built and must not change. This
skill changes the **look and composition**, not the **behaviour**.

The usual workflow: build structural parity first, then hand over a screenshot
of the desired design and adapt. This skill owns that second pass.

## Non-negotiables

- **Substrate is frozen.** Do not alter interaction contracts, loading states,
  motion timing/easing, focus behaviour, reduced-motion, or caching while
  restyling.
- **Tokens only.** Colours, spacing, radii, shadows and type come from the
  theme. No raw hex, no arbitrary one-off values in components.
- **No new motion language.** Use the existing easing/duration scale. If the
  reference implies a different feel, change the per-client duration within the
  scale, not the curve.
- **Adapt, do not clone.** Reuse the section library and blessed components.
  Reshape layout and content order; do not rebuild primitives.
- **Match desktop and mobile.** A reference that only covers desktop is
  incomplete; define the responsive behaviour.
- **Keep content real.** Use the client's content and data, not lorem ipsum, so
  spacing and truncation reflect reality.
- **Use the client's assets.** The logo, icons, OG image and fonts come from
  `06-brand-assets.md`; never draw or invent a logo, and keep the favicon
  consistent with the palette. Note which assets are licensed before embedding
  them.
- **Breadcrumbs follow the original, not habit.** Render them where the original
  does, never with a leading "Home" crumb when the header already links home, and
  hide them when there is only one crumb.

## Inputs

- Screenshots or reference URLs: home, a category, a product, a content page, and
  mobile.
- Brand assets from `docs/site/06-brand-assets.md`: logo, fonts, icons, OG image.
- Brand notes (what must stay, what may change).
- The current site and its content source.
- `docs/craft/design-system.md` and `docs/craft/page-archetypes.md`.

## Pipeline

### 1. Intake
Collect references and write `docs/site/<client>/design-brief.md` using
`_shared/design-brief-template.md`. If the reference is missing mobile or a key
page, state the assumption explicitly and proceed; do not silently guess.

### 2. Extract the token sheet
Fill `docs/site/<client>/design-tokens.md` (template in `references/`). Extract:

- **Palette by role**: background, surface, text, muted, border, primary, accent,
  success, warning, error, on-dark. Not just a list of colours.
- **Type**: families, weights, and a scale (display, h1–h3, body, small,
  eyebrow). Include line-height and tracking.
- **Spacing rhythm**: base unit and section spacing steps.
- **Radii and borders**: the reference's shape language.
- **Elevation**: shadow levels (keep it to 2–3).
- **Imagery**: crop ratio, treatment (full-bleed, framed, duotone), overlay.
- **Motion personality**: calm, snappy, editorial, playful. Map it onto the
  existing scale; do not introduce new curves.
- **Density**: airy vs compact; choose spacing tokens accordingly.

### 3. Map to the theme
Apply tokens in the theme file and CSS variables. Keep the role names; swap the
values. Restrict arbitrary values.

### 4. Restyle by section
Go section by section in the order they appear. For each:

1. Match layout and spacing to the reference.
2. Apply type and colour tokens.
3. Apply imagery treatment and crop.
4. Verify states and responsive behaviour still hold.
5. Compare against the screenshot; iterate.

Do not pause to redesign the whole site at once. One section, one comparison.

### 5. State and behaviour audit
Confirm the restyle did not break the state matrix, loading, cart feedback,
focus, reduced motion, or image behaviour. Restyling a button must not remove its
focus ring.

### 6. Verify
Run `verification`. A skin is not done until it passes.

## What is skin vs substrate

| Skin (change freely for the client) | Substrate (do not change) |
|---|---|
| Palette, type, spacing, radii, shadows | Motion curves and duration scale |
| Section order, layout, image crops | Loading/skeleton behaviour |
| Hero treatment, card style | Cart optimistic feedback and toast |
| Nav visual treatment | Nav hover-intent timing and keyboard path |
| Motion *personality* within the scale | Focus-visible, ARIA, reduced motion |
| Copy tone for local content | Data fetching, caching, identity isolation |

## Acceptance checklist

- [ ] `design-brief.md` and `design-tokens.md` written.
- [ ] Desktop and mobile match the reference.
- [ ] Every page archetype is covered (home, category, PDP, content, plus
      cart/checkout/account if in scope).
- [ ] No raw hex or arbitrary values in components.
- [ ] No new easing curve or duration outside the scale.
- [ ] Substrate behaviours verified unchanged.
- [ ] States, focus and reduced motion intact.
- [ ] Content is real; truncation and long names checked.
- [ ] `verification` passes.

## Anti-patterns

- Copying the previous client's skin as "the template."
- Hardcoding colours in components instead of tokens.
- Rebuilding the cart/loading/motion system to match a screenshot.
- Building only the desktop reference.
- Redesigning all pages before checking one against the reference.
- Using placeholder text that hides overflow and spacing problems.
- Adding a new primitive because the screenshot has one unusual element; extend
  an existing section or add a recipe deliberately.

## References

- `references/design-tokens-template.md` — the token sheet to fill.
- `_shared/design-brief-template.md` — intake questions.
- `docs/craft/page-archetypes.md` — what each page needs.

If `docs/craft/` does not exist, create `design-tokens.md` and
`design-brief.md` under `docs/site/<client>/` first and use the repo's
`src/app/globals.css` token block as the design system. Do not block the
restyle on missing craft docs.
