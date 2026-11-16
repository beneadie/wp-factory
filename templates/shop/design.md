# Shop — template intent

Shop is an editorial retail template for product-led Irish businesses: wool, ceramics, homeware, books, flowers and makers. It treats a collection like a magazine spread — one very large serif line, generous air, and framed 4:5 product crops — so the objects and their prices carry the page instead of badges or decoration.

## Signature device

The product card in `FeatureGrid`, and its placement immediately above the inverse `QuoteBand`.

- A 1px hairline frame, no shadow, near-square 2px corners.
- A 4:5 media area. The first crop is always visible; on hover or keyboard focus a second crop of the same photograph cross-fades in. The interaction is an enhancement, never the only way to see the product.
- The name and descriptor sit above a baseline row. The price (15px, tabular numerals) is always visible on the left of that row; the `View` pill sits on the right. The whole card is one link, so the pill is a span, not a nested link.
- The card's second crop is a tighter crop of the same source photograph, not a different asset: the template's art set supplies one source per card. When real product media is wired, give each product a true second shot and keep the cross-fade.

`FeatureGridProps` carries no image field, so the template ships three brand-neutral product photographs in `PRODUCT_ART` (folded wool, stoneware, a knitted poncho), keyed by card position and cropped to 4:5. They are demo art, not content: replace the array with the client's own crops. The copy, names, prices and links remain props.

The item body is the product's meta line. The first segment is the price when it contains a euro figure:

```
€185 · Handwoven in County Kerry · 130 × 180 cm
```

The card splits on ` · `, puts `€185` on the baseline and the rest under the name. If a body has no price, it is all descriptor and the price slot is simply absent. Keep the convention when adapting copy if prices should remain visible.

## Spacing and motion

- Container 1240px, 24px gutters. Sections 88px desktop / 52px mobile.
- Hero: title to CTA row 32px; CTA row to image pair 48–64px (and 48–64px from title when there are no CTAs). Pair columns 1.45 / 0.85 / 0.7 with 32px gaps at 1024+, 24px below. The 1:1 detail is offset 48px on desktop, 24px on mobile. The lede sits as a caption at the bottom of the third column.
- Cards: 4:5 media, 20/24px body padding, 16px baseline rule, 24–32px grid gaps.
- PageHead: 96/56px top, 88/52px bottom, one 56–64px gap before the link hairline.
- Motion uses only the shared `.reveal` (420ms rise) and `.reveal-image` (700ms clip) primitives. The card cross-fade is 700ms `--duration-slow`; hover ticks are 240ms `--duration-fast`; pill ticks are 140ms `--duration-micro`. All of it collapses to an instant state under `prefers-reduced-motion`.
- No parallax, no scroll-jacking, no entrance animation on every card.
- Font wiring: `theme.ts` exports `fontVariables` (Inter + Instrument Serif). Apply it to `<body>` or `<html>` so `--font-inter` and `--font-instrument-serif` resolve; `theme.css` already points `--font-sans` and `--font-display` at them.

## What an adapter may change

- In a generated site, write the client's palette and type into the client-owned `src/styles/theme.css` as one `:root` block. The template's own `theme.css` is composed to `theme.base.css` and regenerated, so never edit it for a client. Keep one accent and the inverse band.
- Content, links and images come from the site's pages and section props. The `*Fixture` strings and `PRODUCT_ART` are demo copy and demo art for the styleguide, not client content; do not present them as the origin's own assets.
- Section order on a page, and whether optional props (tagline, lede, secondary CTA, attribution, body) are present.
- When adapting the template itself: replace `PRODUCT_ART` with the client's four-by-five crops, replace the hero image and its detail crop, rewrite the fixture copy, and tune spacing within roughly 80–96px desktop / 48–56px mobile and radii between 0 and 4px. The pill stays a pill.
- The display/sans pairing, either in the template's `theme.ts` or by overriding `--font-display` / `--font-sans` in a client stylesheet, provided the display face is a serif with no italic and the scale stays in the 56–92px display range.
- The hero detail's `object-position`, as long as the 4:5 + 1:1 framing and the offset remain.

## What it must never change

- The six section exports, their names, props and `sections/index.ts` shape.
- The one-accent rule, the hairline-only surface treatment and the absence of drop shadows (the shared focus ring is the only box-shadow).
- 4:5 product crops; name and price visible without hover; the second crop revealed by cross-fade, not by replacing the first.
- The hero as an asymmetric 4:5 + 1:1 pair, the detail offset, and no full-bleed hero photograph. `HeroProps.variant` is honoured for `centered` (text only); `full` deliberately resolves to the same framed pair rather than a full-bleed image.
- PageHead as eyebrow + display title + hairline + three sibling links, with no image and no body copy.
- The inverse QuoteBand carrying the maker's story.
- Body 17/1.6, display 56–92px at −0.01em/1.02, eyebrows 11px/0.16em, prices 15px tabular.
- `.reveal` and `.reveal-image` as the only entrance primitives; no display italic, script or cursive.

## Visual self-check

1. **Hero, 1440.** An eyebrow on a hairline, a three-line display statement, then a 4:5 whole and a 1:1 detail offset by 48px. It reads as a collection header, not a hero banner; nothing is full-bleed.
2. **Card at rest and on focus.** One hairline frame, no shadow, 4:5 crop. Name and price are legible before any interaction. Hovering or tabbing cross-fades a closer crop in, the View pill inverts, and the card shows a 2px accent focus outline.
3. **PageHead, no image, no body.** The eyebrow, display line, hairline and three numbered links are enough. The empty space is composed, not accidental.
4. **Mobile, 390.** The image pair stays a pair rather than collapsing to one; the title never clips; cards are a single column with the baseline row aligned; the quote is readable; stats form a clean 2×2.
5. **Type and rhythm.** Display is 56–92px at −0.01em/1.02, body 17/1.6, eyebrows 11px/0.16em, prices 15px tabular. Section rhythm is 88/52. No italic anywhere.
6. **Restraint.** One green accent, used for hover/action and focus. The inverse band carries the only dark surface. No badges, no drop shadows, no second accent, no decorative quotation marks.
