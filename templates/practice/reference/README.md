# Reference screenshots

**Source:** original composition, drawn from the practice brief in this
repository. No third-party site was copied; the Matheson link-rule behaviour is
a named influence, not a visual reproduction.
**Captured:** 2026-11-17, from the composed template at `/demo` and `/demo/inner`.
**Licence:** the template and its CSS are original work for this factory. The
fixture photograph path is a placeholder; any photograph an adapter substitutes
must be licensed by the client (or be their own).

Three screenshots belong in this folder. They are evidence, not decoration:
each one tests a different failure mode of the template. Take them from the
rendered site at 1440px and 390px wide (no device scaling, no browser chrome),
with the fixture content from `sections/fixtures.ts`, and view the PNGs before
signing the template off.

## 1. `01-home-1440.png` — the home hero and credentials band

Full viewport at **1440 × 1100**, scrolled to the top, so the top of the
credentials band is visible beneath the hero.

Must demonstrate:

- The 7/5 split: serif statement and lede left, 4:5 portrait right, with the
  hairline running above both and the eyebrow sitting under it.
- A display headline between 76 and 88px, left-aligned, title case, tight
  leading. The lede at 21px with a measure well under 68ch.
- The filled accent primary button and the secondary inline link with its 1px
  rule at 4px offset.
- The credentials band (or its top hairline) entering the fold, with display
  values and tabular numerals.
- No card shadow, no rounded image, one accent only.

## 2. `02-pagehead-1440.png` — the thin page

Full viewport at **1440 × 900** showing a page whose only content is a title and
its three sibling links (the fixture `pageHeadProps`, which deliberately has no
tagline and no body).

Must demonstrate:

- The page looks finished rather than empty: eyebrow, 52–76px display title,
  a top rule and a hairline, then the three-column index with 01/02/03 numerals.
- The title is left-aligned and does not stretch the full container width.
- Each sibling label carries the link rule; the arrows align to the right edge
  of their columns; vertical hairlines separate the columns without forming
  cards.
- Nothing floats in an empty right column and no placeholder image appears.

## 3. `03-home-390.png` — mobile in one hand

Full-page capture at **390px** wide (or a 390 × 844 viewport over two shots if
the tool cannot capture full page).

Must demonstrate:

- No horizontal scrollbar and no clipped display type; the hero statement is
  still at least 52px and wraps cleanly, left-aligned.
- The hero image is a real 4:5 slot, full width, with the 13px muted caption
  beneath it and a visible placeholder rather than a blank box before load.
- Section padding is visibly 56px; the credentials band falls to two columns
  with labels that do not collide; the feature index is one column with the
  hairline-topped rhythm intact.
- The dark quote band still reads: 32px serif quote, attribution legible, and
  the link rule visible against the inverse background.
- Buttons are comfortable tap targets and the accent remains the only warm
  colour on the page.

If a screenshot cannot be produced, leave a one-line note here saying which one
and why. A template is not signed off on source review alone.

**Status:** captured. `01-home-1440.png`, `02-pagehead-1440.png` and
`03-home-390.png` sit beside this file and were reviewed at 1440, 390 and 320
on 17 November 2026. The composed page had no horizontal overflow at any of the
three widths.
