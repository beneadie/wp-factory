# Portfolio — template design

## Intent

A work-led portfolio for a photographer, designer or small studio: the pictures
are the argument, and the interface is a quiet index arranged around them. It
should read as a working studio with real clients — Dublin and the west coast,
commissions and books — not as a gallery theme with the name swapped out.

## Reference

The reference is the portfolio brief issued for this factory: a work-led studio
site for an Irish photographer/designer, 100/56 section rhythm, 1320 image
column and 720 text column, index numerals as the one signature device. Taken
from it: the full-bleed 16:9 hero, the 7/5 rule-separated project index, the
paper-and-ink palette and the two-face type system. Refused: cards around
projects, gradients or scrims beyond a flat legibility wash, rounded
photographs, a second accent colour, centred testimonial cards, display italic
and any script face.

## Signature device

**Numbered index marks.** Every project carries a two-digit marker — `01`,
`02`, `03` — set in Inter 500 at 11px, uppercase, 0.18em tracked, with tabular
figures so each number has the same width and the year aligns cleanly at the
edge of its text column.

Placement:

- **Hero** — `01` at the top-right of the photograph, opposite the eyebrow.
  On the inverse image it is full paper, not accent and not faded: at 11px a
  tinted numeral disappears over a cloud.
- **FeatureGrid** — the index number sits at the top of the text column, with
  the year at that column's right edge. The row itself alternates image left /
  image right at 7/5; the text column keeps its internal order.
- **PageHead** — each of the three sibling links carries its own `01`, `02`,
  `03` before the label.

At rest every numeral is muted (`#6B6A66`). The single accent (`#7A3B2E`) is
used **only** when a numbered row or page link is hovered or focused. Nothing
else in the template is accent-coloured; the focus ring inherits the global
token.

The second half of the device is the rule. Project rows are separated by 1px
`#DFDCD5` rules, not cards: alternating 7/5 image-and-text rows, a 4:3
photograph on one side, index / serif title / one-sentence description / year
on the other.

## Layout and spacing

- Image column: 1320px. Text column: 720px. Page gutter:
  `clamp(20px, 4vw, 40px)`.
- Section rhythm: 100px desktop, 56px mobile (`.t-portfolio-band`, token-based).
  Project rows use 56px vertical padding on desktop and 36px on mobile.
- Hero photograph: full-bleed 16:9, `priority`, never wrapped in
  `.reveal-image`. Eyebrow top-left, title bottom-left at 44–96px Instrument
  Serif (44px at 320–390, 60px by 910, 96px at 1440).
  The lede and the two rule-links sit below the image, so the photograph
  stays uncrowded at 390px.
- PageHead is composed with no image and no paragraph copy: eyebrow, display
  h1 at 48–88px, a single hairline, then three numbered siblings. The optional
  tagline is a short body-sized paragraph in the right-hand columns.
- FeatureGrid alternates image left / image right at 7/5. Titles are
  Instrument Serif at 28–40px. Descriptions are 16/1.65 and capped at 40ch.
- Quote band is inverse `#121212`; the quote occupies columns 4–12 in
  Instrument Serif at 32–56px roman. The attribution and optional rule-link
  sit in the left margin.
- CtaBand is an editorial spread: 40–72px serif line left, one paragraph and
  one rule-link right.
- StatBand is the white surface, four figures with a hairline above each.
  Labels are 11px chrome; values are Instrument Serif at 36–52px.

## Motion

- `.reveal` on section headings and the pull quote; `--duration-base` is 520ms.
- `.reveal-image` on every project photograph; `--duration-slow` is 900ms, the
  longest in the system, because this is the template where the wipe should be
  seen. In browsers with scroll-driven animation the wipe is tied to
  `animation-timeline: view()` (entry 10% → cover 34%) so it uncovers the
  photograph as it arrives; elsewhere the shared primitive plays once.
- The hero/LCP photograph is never animated, never clipped and never faded.
- Reduced motion removes both primitives; no content depends on an animation
  to become visible.
- Image hover is a 1.02 scale over 900ms; the only other hover is the index
  numeral turning accent and the rule-link arrow moving 3px.

## Wiring

Apply `fontVariables` from `@/config/theme` to `<html>` (not only `<body>`):
theme.css declares `--font-display` and `--font-sans` at `:root`, and those
`var()` references resolve where the next/font variables are defined. With no
wiring the sections fall back to Georgia and system sans; they still lay out,
but the Instrument Serif voice is lost.

## What an adapter may change

- Token **values** in `theme.css`: all eleven colour channels, the two font
  stacks, the type scale, the measure, the container, the gutters, the radii
  and the two motion durations. Keep the palette roles (one accent, one inverse
  band) and the contrast ratios.
- Type wiring in `theme.ts`: weights, fallbacks and subsets, provided Inter
  stays the chrome face and Instrument Serif stays display/marginalia. Keep
  the default `TemplateTheme` truthful: `displayFace: "serif"`,
  `heroVariant: "full"`, `bandedSections: false`, `proseMeasure: "wide"`;
  `name` stays `portfolio` for this overlay.
- All copy in `fixtures.ts`; project count and order; image sources, alt text
  and captions; years supplied either as `item.year` or as a trailing
  `— 2024` in the description; hrefs.
- Hero `variant`: `full` is the composition this template ships with (the
  fixture declares it); the component default remains `split` per the contract.
  `centered`/no image gives a text-only statement. Choose a hero crop that is
  mid-to-dark in the top and bottom thirds: the flat 36% scrim is deliberately
  not a gradient and still cannot rescue a white sky behind 11px chrome.
- The section order and which sections a page uses. Optional eyebrows,
  taglines, ledes and CTAs may be dropped without breaking composition.
- Section rhythm may be tightened to 64px desktop, never below.

## What it must never change

- The six exports, their names and their prop types.
- The 16:9 full-bleed hero with `priority` and **no reveal** on the LCP image.
- The numbered index device: 11px Inter 500, uppercase, 0.18em, tabular;
  muted at rest; accent only on hover/focus of the numeral.
- The 7/5 alternating rows, 1px rules and **no card borders, no shadows, no
  gradients, no rounded photographs**.
- Captions at 13px, muted, in Instrument Serif (roman only — no display
  italic, no script/cursive anywhere).
- Body copy at 16/1.65 and the 720px text measure.
- At least three type sizes above the fold and a single accent colour.
- No blank image slots: every slot has explicit width, height and an aspect
  ratio, and the placeholder is always visible while loading.

## Visual self-check

1. At 1440, the hero photograph is 16:9, full-bleed and already final on first
   paint; the title sits bottom-left on one line and the eyebrow is small
   chrome, not a second heading.
2. Index numerals are tabular and every year sits at the right edge of its text
   column; no numeral is accent until hover/focus.
3. FeatureGrid reads as rules and photographs, not cards: no boxes, no radius,
   no shadow, image sides alternate 7/5, and each row still has one clear title.
4. PageHead has no photograph and no body copy yet feels finished: eyebrow,
   one display line, one hairline, three numbered links, and enough air above
   the rule.
5. At 390, nothing overflows; the hero chrome stays legible on the flat scrim;
   project rows stack image-first; tap targets are at least 44px high; the
   display type does not clip ascenders or descenders.
6. The only type sizes in chrome are 11px and 13px; body is 16/1.65; captions
   are serif 13px muted; accent appears nowhere at rest.
