# Hospitality template

A warm, appetite-led skin for cafés, restaurants, pubs, bakeries and delis.

## Intent

This template should feel like a well-set menu in a room you want to sit in:
warm paper, one oxblood accent, photographs given space, and type doing the
decorating. It is deliberately brand-agnostic — no logo, no icon set, no
illustration — so a client's own food photography and voice can carry it.

## The signature device

**The menu as a typographic artifact.** Every dish and price sits on one line
with a dotted leader between them; prices are set in tabular numerals so the
column aligns; each course is introduced by a small-caps name over a hairline
rule. There is no box, card or badge around a dish — the line itself is the
design.

Placement: the lower half of `FeatureGrid`, directly beneath the three 4:5
"today at the café" cards and above the inverse `CtaBand`. Because the
six-section contract has no menu section, the device is carried by an optional
`menu` prop on `FeatureGrid` (`HospitalityMenuCourse[]`). The adapter supplies
the client's real menu there. A page that omits it still renders correctly, but
it loses the template's most recognisable moment.

The same rule language — a short rule above an eyebrow, hairlines between
regions — repeats in `PageHead`, the card captions, the stats and the hours, so
the menu does not read as a one-off.

## Type, colour, spacing

| Role | Value |
|---|---|
| Background | `#FBF7F1` warm paper |
| Surface / elevated | `#FFFFFF` |
| Text / primary / inverse bg | `#1A1613` / `#20180F` / `#20180F` |
| Muted | `#776E63` |
| Border | `#E8DFD3` |
| Accent | `#6B2F1E` oxblood, for hover and emphasis, never a wash |
| Inverse text | `#F8F3EA` |
| Display | Newsreader 400/500, 52–88px, `-0.015em`, `1.06` |
| Body | Inter 400/500/600, 17px / `1.65` |
| Eyebrow | Inter 11px uppercase, `0.16em` |
| Container / gutter | 1200px / 20px mobile, 32px desktop |
| Rhythm | 56px mobile, 96px desktop |
| Radius | 2px on shared controls; photography and cards stay square; pills only on booking buttons |

No italic or script face is loaded. `theme.ts` wires Newsreader and Inter and
exports `fontVariables`; the root layout must put that class on `<body>` so
`--font-newsreader` exists. Without it the token falls back to the base serif,
which is legible but not the template. No shadow is used. The only gradient is
the hero scrim; the dotted leader is a border, not a gradient.

## Spacing and motion

- Sections use `.t-hospitality-section`: 56px mobile, 96px desktop. `PageHead`
  opens taller — 64px top on mobile, 112px on desktop — because it has no image
  to do the work.
- Hero is a 3:2 slot, capped at `100svh − 5rem` on wide screens so the
  headline and the booking pill stay above the fold; the image crop absorbs the
  difference. Card images are 4:5. Both reserve their ratio through `SiteImage`,
  so nothing jumps.
- `.reveal-image` is used once, on the hero photograph: the wipe is the
  template's moment. `.reveal` is used on the hero fallback and the `PageHead`
  title block only. Below-the-fold sections stay still.
- Hover is colour or a 1.025 image crop. The booking pill inverts to an outline;
  the dark pill on paper fills with oxblood. Durations are 520ms base and 900ms
  for the image wipe, on the shared curves.
- Under `prefers-reduced-motion`, the wipe, the reveal and the card crop are
  inert; all content is visible.

## What an adapter may change

- Palette values, keeping the role names and one accent. The accent should stay
  dark enough for white text if it is used as a button fill.
- Display and sans families, provided the display face is a serif or a humanist
  sans with true small caps and **no italic or script**. Keep it to two families.
- Copy, dish names, descriptions, euro prices, opening hours, photography, image
  alt text and link targets. Keep the hero to one serif statement — a short
  title, not a paragraph — and at most one short lede; long introductions
  belong in `PageHead` or prose, not over the photograph.
- Section order and inclusion. A home page can run Hero → FeatureGrid →
  CtaBand → StatBand → QuoteBand; `PageHead` belongs on inner pages.
- The Hero `variant` is accepted for contract compatibility, but hospitality
  composes the full-bleed frame for `split` and `full` and type-on-paper for
  `centered` or a missing image. Do not turn it into a split or a carousel.
- The optional `menu` on `FeatureGrid`, `hours` on `CtaBand` and per-card
  `image` on `FeatureGrid` items. A caller that only knows the fixed prop types
  is still accepted; missing images and menu fall back to designed, non-blank
  compositions.
- Section rhythm within the design contract: never below 64px desktop / 40px
  mobile. The 2px radius may become 0, never a rounded card.
- Photographs may be re-cropped, but hero stays 3:2 and cards stay 4:5.

## What it must never change

- The six export names and the `Sections` shape. No required prop may be added.
- The dotted leader, tabular price column, small-caps course name and hairline
  above each course. That combination is the template.
- One accent colour, one CTA in the hero, no carousel, no centred body
  paragraphs, no icons, no shadows, no gradient except the scrim.
- Today's opening hours are emphasised by weight, never by a second colour.
- No italic or script face anywhere — including a client-supplied display face.
- Images only through `SiteImage`, always with explicit dimensions and a
  declared ratio. Never a blank or transparent slot.
- The two motion primitives (`.reveal`, `.reveal-image`) and the shared easing
  family. Do not add a scroll observer or a third reveal.

## Visual self-check

1. **Hero, 1440:** one 3:2 photograph, one display headline bottom-left, one
   action. The scrim is soft enough to read the type and light enough to see the
   food. No arrows, dots or second button.
2. **PageHead, 1440 and 390:** with no image and no tagline it still looks
   finished — eyebrow, oversized title, hairline, three numbered sibling links
   (one row on desktop, stacked on mobile).
3. **Menu:** every dish and price sits on one line with a dotted leader that
   reaches the price; names may wrap but the leader never collides; prices align
   in a column; every course has a hairline above it and a small-caps name.
4. **Hours:** the inverse band carries the week, today is heavier but the same
   colour, and the booking pill is the only filled control there.
5. **Restraint:** one accent, two families, no italic/script, body measure at
   most 62ch, no card borders, no icons, no shadows.
6. **Mobile, 390:** no clipped headline, no horizontal scroll, cards 4:5 full
   width, menu readable at 17px, hours and pill comfortably tappable, 56px
   section rhythm.
