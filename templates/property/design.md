# Property — template design

## Intent

A listing-led auctioneer site where the photograph does the selling and the
card supplies the facts; the page should feel like a well-kept auctioneer's
window rather than a portal. White walls, one bronze accent, serif addresses
and figures that line up on the right.

## The signature device

The listing card is the template. Every card has the same five parts, in this
order:

1. a 3:2 photograph, cropped consistently, with no rounding;
2. a status flag in the top-left corner of the photograph — 10px uppercase,
   white ground, one line: `New to Market`, `Sale Agreed`, `Under Offer`;
3. the address in Gelasio at 24px;
4. one ruled meta row: `4 beds │ 2 baths │ 168 m²` on the left in 13px tabular
   figures, hairlines between the cells, and the guide price at the right in
   18px semibold tabular figures;
5. a two-line blurb at 14px.

The card is used three-up in **FeatureGrid** on the recessed `surface` band,
and a **dark CtaBand for “Book a viewing.” sits directly below it**. That pair
is the signature section: the listing grid and the booking band are one
composition and should stay adjacent.

If an item has no image, the card becomes text-first — the status moves above
the address as an eyebrow. It never renders an empty photo slot.

## Search strip

The hero is a full-bleed 16:9 photograph (capped by a max height on very large
screens, cropped rather than letterboxed). A real GET form overlaps its bottom
edge by 40px: four labelled fields — Location, Property type, Price, Bedrooms —
and one accent **Search** button. Desktop is a single bordered strip with
hairline dividers; mobile is the same strip in two rows with the button across
the foot. The strip is one object: no gaps, no floating pills, no floating
labels. The property template has one photographic hero: `split` and `full`
resolve to the same full-bleed frame; `centered` drops the photograph and
centres the copy above the same strip.

## Spacing and motion

- Container: 1240px, 20px gutter on mobile and 32px from 640px.
- Section rhythm: 48px mobile, 80px desktop. PageHead is 80/56 to feel
  slightly more architectural.
- Type: display 48–80px at −0.015em / 1.08; body 17px / 1.6; eyebrow 11px
  uppercase at 0.14em; prices 18px semibold tabular.
- Motion comes only from the shared tokens. The card photograph scales to
  1.025 over `--duration-slow`; arrows travel 4px over `--duration-fast`;
  links move their rule to the accent over `--duration-micro`.
- `.reveal` is used on the hero, PageHead and section titles only. Images use
  no reveal wipe: the hero photograph is the LCP and must paint immediately.
- Below 1024px the image hero drops the lede so the photograph still reads;
  the title, the two actions and the search strip carry that viewport.

## What an adapter may change

- Every token **value** in `theme.css` — palette, display face, type ramp,
  radius, prose settings — while keeping the token names.
- `theme.ts` font choices, as long as a display face and a sans face remain and
  the display face is upright (no italic, script or cursive).
- All copy, photographs and routes in the fixtures.
- The number of listings. Two or three per row are both composed; six items
  make two clean rows at desktop.
- The first-line listing convention in `body` (status · specs · price, then a
  newline and the blurb), provided the first line still carries the status,
  spec and € price tokens and the blurb stays after the newline.
- Whether listing images are supplied at all; the text-first fallback is
  designed, not an error state.

## What it must never change

- Token names, section export names or the fixed section prop types.
- The one-accent rule: bronze `--color-accent` is the only chromatic colour.
  No second accent, no tinted panels.
- No box shadows. Depth is hairlines and the inverse band.
- No display italic, no script or cursive face.
- The hero search strip: four labelled fields plus one accent button, one
  bordered object, 40px overlap. It must not become a carousel or pills.
- The listing card’s anatomy: flag on the image corner, serif address, ruled
  spec row, tabular price at the right.
- No fake map embeds. A static map image is acceptable; an embedded map is not.

## Six-point visual self-check

1. At 1440, the search strip reads as a single piece of joinery, its top 40px
   over the photograph, with four labels legible at arm's length.
2. At 390, no field label or guide price clips; the strip stacks to two rows
   with a full-width accent button.
3. Three listing cards align on one baseline: images all 3:2, meta rows level,
   prices right-aligned and never wrapping.
4. The status flag is legible on both a pale sky and a dark hedge, and never
   covers the building.
5. PageHead with no image and no body copy still feels finished: eyebrow,
   two-line display title, hairline, three generous sibling links.
6. The only chromatic moment on the page is the bronze button and its matching
   link rule. Everything else is ink, white, surface grey or the inverse band.
