# Practice

A trust-led template for an accountancy, solicitors' firm, architect, surveyor
or consultant: warm paper, near-black ink, one rust accent and hairlines where a
lesser template would reach for a card shadow. Its intent is quiet authority —
the page should read like a well-set annual report from a practice that has been
at the same address for thirty years, not like a startup's marketing site.

## Reference

The brief names Matheson for the link rule; nothing else is copied. **Taken:**
the 1px rule at 4px offset that thickens to the accent on hover and focus.
**Refused:** the corporate navy palette, a stock full-bleed hero for the
practice's own pages (the contract's `full` variant exists for the styleguide
but is not used here), and the dense service mega-menu. The 7/5 hero, the
three-column page index and the ruled credentials band are original to this
template.

## Signature device

Every inline link carries a **1px rule at 4px offset**, in the link's own ink.
On hover and `:focus-visible` the rule becomes **2px and takes the accent**; in
the section components the words do not change colour and nothing gains a
second underline.

It appears in:

| Where | Element |
| --- | --- |
| Hero | the secondary CTA |
| PageHead | all three sibling-link labels |
| FeatureGrid | the "Read more" label, while the whole item is the anchor |
| QuoteBand | the optional CTA on the dark band |
| Captured WordPress HTML | the prose link tokens (1px rule, 4px offset; the prose layer owns its own hover ink) |

It does **not** appear on headings, eyebrows, buttons or the site header
navigation (which is outside these sections and is not restyled by this
template). Heading emphasis comes from size and the display face, never from an
accent underline.

The second recurring device is the **hairline**: 1px, usually
`var(--rule)` (the border token), and an inverse-text alpha on the dark band. It
is used as a section top rule, a band top and bottom, and the rule under a
PageHead title. There are no shadows anywhere.

## The six sections

- **Hero** — rule, eyebrow, 7/5 split. Serif statement (54–88px) and lede on the
  left, a 4:5 photograph with a 13px muted caption on the right. Title case,
  never centred. At ≥1024px the columns are 7fr/5fr; below that they stack and
  the image caps at 30rem. Without an image the copy runs in a single 46rem
  column rather than leaving an empty slot. The contract's `full` and
  `centered` variants also render (full falls back to split without an image),
  but `heroVariant` is `split` and no practice page selects `centered`.
- **PageHead** — the thin-page archetype and the hardest one. Eyebrow, display
  title (52–76px, max 18ch), optional 21px tagline, a full-width hairline, then
  three sibling links as a ruled three-column index with 01/02/03 numerals.
  It is complete with no image, no body copy and no tagline.
- **FeatureGrid** — a ruled index, not cards. Asymmetric header (eyebrow and a
  counted meta line in a 3/12 column, title in 9/12), then items topped by
  hairlines: two-digit index, 24px serif title, one 17px paragraph capped at
  34ch, and a ruled "Read more". `href` makes the whole item the anchor.
- **QuoteBand** — the single dark moment. Inverse band, 36–48px serif quote
  left-aligned across 8/12, attribution and optional link in the remaining
  4/12, separated by an alpha hairline. No quote-mark ornament, no italic.
- **CtaBand** — a closing statement ruled above and below: 52–76px serif title
  at 7/12, body and the one filled control at 5/12, aligned to the baseline.
- **StatBand** — the credentials band. A regulator, a year, memberships and a
  partner count between two hairlines. Values are 28px display-face with
  `tabular-nums lining-nums`; labels are 11px/0.14em capitals. Four columns on
  desktop with vertical hairlines, two on mobile.

## Spacing, type and motion

- Container `1240px` (`--container`), gutter 24px, reading measure 68ch.
- Section padding **96px desktop / 56px mobile**; the StatBand section is
  tightened to **64px desktop** so its hairlines sit close to the figures, and
  the band adds 40px/32px inside those rules. Hero, PageHead and CtaBand use
  the full 96px rhythm.
- Body 17px/1.6; lede 21px/1.55; display tracking −0.02em and leading 1.04.
  Eyebrow 11px uppercase at 0.14em. Caption 13px muted.
- Hero/PageHead statement is 88px/76px at 1440, still ≥52px at 390.
- Images are square-cornered (`--radius-md: 0`); the split hero portrait is
  always a declared 4:5 crop.
- Motion is limited to token durations on the link rule, arrow nudge (4px) and
  colour, plus the shared `.reveal` primitive on below-the-fold blocks
  (FeatureGrid header/items, QuoteBand, CtaBand, StatBand). The hero and its
  LCP image never reveal from `opacity: 0`. No new easing.
- `theme.ts` default-exports the `TemplateTheme` record
  (`name: "practice"`, `displayFace: "serif"`, `heroVariant: "split"`,
  `bandedSections: false`, `proseMeasure: "standard"`) and re-exports the
  Gelasio / Inter wiring from `@/lib/fonts` as `--font-gelasio` /
  `--font-inter`. `theme.css` only references those variables.
- `theme.css` holds one `:root` block of overridden values plus namespaced
  `.t-practice-*` component classes. No global element selectors, no global
  utilities, no second accent and no token renamed.

## Cosmetic props added (all optional, with defaults)

| Section | Prop | Default | Effect |
| --- | --- | --- | --- |
| Hero | `imageCaption?: string` | none | 13px muted caption under the 4:5 image |
| Hero | `imagePriority?: boolean` | `true` | marks the hero image as the LCP image |
| FeatureGrid | `columns?: 2 \| 3` | `3` | desktop column count (mobile stays 1-up, tablet 2-up) |
| StatBand | `eyebrow?: string` | none | short label above the figures, e.g. "Credentials" |

`HeroProps.variant` is supported for all three contract compositions. The
practice's own composition is split (`heroVariant: "split"`); `centered` exists
only so the shared styleguide can exercise the contract and is never used on a
practice page, because the brief forbids centred headlines. `full` falls back to
split when no image is supplied.

## What an adapter may change

- **Colour — always.** Replace the eleven `--color-*` channel triples in
  `theme.css` with the client's brand. Keep the roles: one accent, an inverse
  band, hairline borders. Do not add a second accent or tint the background
  washes with the accent.
- **Type — only if the brand demands it.** Load the client face in `theme.ts`,
  then update `--font-display` / `--font-sans`. Keep the sizes, tracking and
  leading unless the script or x-height makes them unreadable.
- **Copy, links and images.** Replace every fixture with the client's real
  content, giving each image a real alt, dimensions and 4:5 crop. Add or drop
  sections to match the page.
- **The four cosmetic props above** and section-level spacing values, when a
  client's content needs more room.
- The `imageCaption` should describe the place, not repeat the alt text.

## What it must never change

- The exported names and prop contract in `sections/index.ts`, or the
  `@/lib/section-types` types.
- The link rule: 1px at 4px offset, 2px accent on hover/focus, no second
  underline, no accent on headings or the site header navigation.
- The hairline discipline: no card shadows, no rounded image masks, no filled
  section washes except the single inverse band.
- Left-aligned display type in the practice's own pages; title case; no italic,
  script or cursive display. (`centered` exists for the contract styleguide,
  not for a practice page.)
- Images outside `@/components/site-image`, or an image slot without dimensions
  and a declared aspect ratio.
- Client-side fetching, global state or a `"use client"` section. These are
  props-in components.
- Raw hex outside `theme.css`.

## Six-point visual self-check

1. At 100%, an inline link shows a 1px rule 4px below the baseline; on hover or
   keyboard focus it is 2px and rust, with no second underline and no colour
   change in the words.
2. At 1440 the hero is visibly 7/5, the headline is left-aligned at 76–88px,
   and the 4:5 photograph has a 13px muted caption. Nothing is centred.
3. PageHead with no tagline, no body and no image still reads as a composed
   page: eyebrow, large title, a top rule and a hairline, three ruled links with
   01/02/03.
4. The accent appears only in link hover/focus rules, focus rings and the
   filled primary button. There is no rust heading, border or background wash.
5. The credentials band sits between two hairlines; values are display-face
   with tabular numerals; four columns at desktop, two at 390 with no clipping.
6. At 390 the page has no horizontal scroll, the display title remains ≥52px,
   body copy is 17/1.6, and the hero image still occupies a real 4:5 slot with a
   visible placeholder before load — never a blank rectangle.
