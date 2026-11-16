# Shop — reference screenshots

Three captures are enough to judge this template. Take them against the fixture
page (or the client's first real page) with the shared `.reveal` primitives
settled, at the stated viewport. Full-page height unless noted.

## 1. `01-home-1440.png` — composition and signature device

Desktop, 1440px wide. Full homepage from the header to the stat band.

Must demonstrate:

- The hero as an editorial collection header: eyebrow on a hairline, one very
  large display line, then the asymmetric 4:5 + 1:1 image pair with the detail
  dropped 48px. No full-bleed photograph.
- The 3-up product grid with consistent 4:5 crops and hairline frames. One card
  (the second is fine) should be captured in its hover/focus state so the second
  crop and inverted View pill are visible; the adjacent card must show the
  resting state with name and price visible. No shadows on either.
- The inverse quote band immediately below the grid, with the maker attribution
  and one link low on the right.
- The closing CTA band and the four-figure stat band. One green accent only.

## 2. `02-pagehead-1440.png` — the thin-page archetype

Desktop, 1440px wide. A page that has a PageHead and nothing else.

Must demonstrate:

- The PageHead looks finished with no image and no body copy: eyebrow, one
  display line, a hairline, then exactly three sibling links with tabular
  indices and arrows.
- The empty space above and below the links is deliberate. The bottom hairline
  closes the header rather than leaving it floating.
- Keyboard focus on one link shows the shared accent ring and the underline,
  without shifting the row.

## 3. `03-home-390.png` — the mobile reading

Mobile, 390px wide. Full homepage.

Must demonstrate:

- The image pair still reads as a pair, not two thumbnails: the 4:5 primary and
  the 1:1 detail keep their offset (24px at this width) and the aside drops
  below.
- The display line wraps cleanly with no clipping or orphaned word, and the
  eyebrow/hairline row does not collide.
- Product cards are a single column, with the price and View pill on the same
  baseline as on desktop. Tap targets are at least 44px; the whole card is the
  link.
- The quote band is legible at 390, the CTA button is 48px tall, and the stats
  form a 2×2 grid with no overflow.

## Capture notes

- Disable any browser chrome; capture at 1× or 2× consistently.
- For the hover state in screenshot 1, force the state in devtools and wait for
  the cross-fade to finish before capturing. The resting card beside it must
  still show the first crop, the name and the price.
- Do not add annotations over the type. If a callout is needed, put it in the
  margin outside the page.
