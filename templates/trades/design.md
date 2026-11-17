# Trades

## Intent

A site for an emergency-led home-services business that wins the job by
answering the phone and proving it has done the work before. The page behaves
like a well-kept job sheet: plain Inter, white paper, one hairline per idea, and
one hot accent where action or proof needs emphasis.

## Signature device

A **three-column proof strip directly under the hero**: years trading, response
time and areas covered as tabular numerals at 56–72px desktop, separated by
vertical hairlines, labelled in 11px uppercase. It appears **once**, immediately
after the hero, and is never repeated lower down the page or turned into cards.
The strip is the thing a visitor should remember: proof before persuasion.

Supporting signature: services are a **hairline ledger**, not cards. Each row
is index / service / one-line body / arrow, separated by 1px rules that run the
full container width.

Home order: Hero → StatBand → FeatureGrid (with optional evidence pair) →
QuoteBand → CtaBand. Inner pages: PageHead → FeatureGrid → QuoteBand → CtaBand.
Never place a second StatBand.

## Spacing and type

- Section padding: 72px desktop, 48px mobile (`.t-trades-section`). The hero and
  stat strip are the exceptions: the strip is compact (20px per cell on
  phones, 32–40px from 768px up) so it reads as a plinth under the photograph.
- Container: 1200px max; gutters 20px mobile / 32px desktop.
- Display 48–80px, weight 700, tracking -0.03em, leading 1.02, sentence case,
  never italic. Body 17px / 1.6. Eyebrow 11px uppercase, 0.14em, accent.
- Motion: hover colour and a 4px arrow shift use the shared `--duration-micro`
  and `--duration-fast` with `--ease-out`. No entrance animation is added to
  the hero or other above-the-fold content. If a later adapter uses an entrance
  reveal it must use the shared `.reveal` / `.reveal-image` primitives only.
- The mobile quote bar is fixed and safe-area padded; `body:has(.t-trades-mobilebar)`
  reserves its height at document end so the footer is never covered.
- No shadows anywhere. Hairlines are `--rule`. One accent, #C54F27, used for
  eyebrows on paper, ledger indices, arrows on hover, and the hero button's
  hover fill. The hero eyebrow sits on the photograph, where the accent is only
  3.96:1, so it uses inverse ink and the accent moves to its leading rule.

## What an adapter may change

- **Colour, always.** Override the channel triples in `theme.css` to the
  client's palette. Keep the role mapping: one accent, near-black primary,
  inverse band for quote, surface for the CTA band.
- **Type only if the brand demands it.** Point `--font-display` and
  `--font-sans` at the client's licensed family. Keep display weight 700,
  tracking near -0.03em and leading near 1.02; do not introduce a serif,
  script, cursive or italic display face.
- Copy, links and photography. The fixtures are a Dublin electrician; replace
  them with the client's real services, areas, prices, phone number and job
  photos. Keep the phone number as a real `tel:` link everywhere.
- The optional `evidence` prop on `FeatureGrid` (a static before/after pair of
  `SectionImage`s with labels and one caption). It is not part of the shared
  prop contract and defaults to absent. Supply it only when the client has a
  genuine pair; never fake a before/after.
- Accent hue may move, but keep exactly one accent and keep the same contrast
  relationship. If the accent gets lighter, darken the label ink rather than
  adding a second accent.

## What it must never change

- The stat strip's **placement** (once, directly under the hero) and its
  **three-column geometry** with hairline dividers and tabular numerals.
- The left-aligned hero with a bottom-left gradient scrim. No centred hero
  copy, no flat black overlay, no framed hero card. The contract's `variant`
  prop is accepted for compatibility, but this template composes the full-bleed
  treatment for every value: pass `full` or omit it.
- Hairline service rows instead of cards; no box shadows, no rounded card
  grids, no icon tiles.
- The 72/48 section rhythm, 1200px container and 11px uppercase labels.
- One accent, one primary action per view. No second accent, gradient text or
  decorative illustration.
- Real `tel:` links and honest job photography with captions. No handshake
  stock, no stock "team in a boardroom" imagery, no lorem ipsum.
- No JS slider for before/after; side-by-side images only.

## Visual self-check

1. **1440 hero:** job photograph runs edge to edge, headline sits bottom-left
   at 80px on a layered gradient (not a flat wash), quote button and real phone
   link are both visible, and no centred copy appears.
2. **Stat strip:** three numerals, 56–72px, tabular, with true hairline
   dividers and 11px uppercase labels. It sits flush under the hero and is not
   repeated anywhere on the page.
3. **390 hero:** headline is still readable at 48px, the photo is not a thin
   letterbox, the sticky quote/call bar is visible with safe-area padding, and
   the page has no horizontal scroll.
4. **Ledger:** six service rows read as rules, not cards. Indices are accent,
   bodies stay within 48ch, arrows align on one axis, and hover changes colour
   only (plus the small arrow shift).
5. **PageHead:** with no image and no body copy, the eyebrow, giant h1,
   hairline and three indexed sibling links still fill the page with intent.
   Nothing looks like a missing hero.
6. **Restraint and contrast:** one accent in use; no shadow, gradient text or
   second display face; body/muted/inverse text pass AA, and accent is kept to
   11px labels, indices and hover states (accent on white is 4.65:1, and 3.96:1
   on the inverse band, so on dark surfaces the text stays inverse and only the
   rule or underline turns accent).
