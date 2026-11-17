# Property — reference screenshots

Three captures are enough to judge this template. Take each one at device pixel
ratio 2, with real listing photographs loaded (the fixture paths expect files
under `public/images/`), and view the PNG — a DOM snapshot will not show the
overlap, the hairlines or the price alignment.

Store the images beside this file as `home-1440.png`, `home-390.png` and
`page-head-1440.png`.

## 1. `home-1440.png` — home, 1440px wide, full page

The hero photograph fills the width in a 16:9 frame, capped on very large
screens, with the eyebrow and display title on the lower left. The search strip
sits 40px over the photograph's bottom edge and reads as one continuous
bordered object: four labelled fields, hairline dividers, one bronze Search
button. Below it, the first row of three listing cards is visible: 3:2 crops,
status flag in the image corner, serif address, ruled spec row with the price
at the right. The dark **Book a viewing** band closes the listing grid.

**Passes when:** the search strip looks like joinery, not four widgets; the
three cards share a baseline; the bronze button is the only saturated colour
above the fold; the photograph still reads behind the copy.

**Fails when:** any field floats as a pill, the bar breaks into cards, a price
wraps, the flag covers the house, or the copy over the photo needs a heavy
black scrim to be legible.

## 2. `home-390.png` — home, 390px wide, first two viewports

The same hero, cropped rather than letterboxed. The search strip stacks into
two rows of two fields, with the accent Search button across the full width of
the strip. Listing cards are one per row; the spec row and the price still fit
on one line.

**Passes when:** no label, option or price clips; the strip remains one object;
the display title breaks into at most three lines and never sits behind the
search strip; the card meta row keeps its hairlines. The lede is intentionally
absent below 1024px — the title and the two actions carry the hero.

**Fails when:** the two-column fields collapse to a tall single column, the
button becomes a floating pill, the price wraps below the specs, or the hero
copy is obscured by the 40px overlap.

## 3. `page-head-1440.png` — an interior page head, 1440px wide

A page with no photograph and no body copy: eyebrow, one display title at
48–80px, a single hairline, and three sibling links in a ruled three-column
row. Below it, the quote or stat band supplies proof of the wider system.

**Passes when:** the composition feels deliberate with only those elements;
the three links share a top rule and generous padding; the first link aligns
with the headline's left edge; the page does not look like an unfinished
template.

**Fails when:** the header is a lonely small heading on a large white field,
the links look like a breadcrumb, the row uses four columns of uneven width,
or the hairline is missing.

## What to compare against

Open the same three widths on the origin's home and one property page. The
template is brand-agnostic, so compare **structure and restraint**, not colour:
photograph scale, strip geometry, card anatomy, type hierarchy and the amount
of air. Note any origin-specific pattern that the adapter should absorb into
token values rather than new components.

## Provenance

- **Source URL(s):** None. Original composition for the factory; `design.md`
  records the named influences.
- **Captured:** 17 November 2026, from the composed template at `/demo` and
  `/demo/inner`.
- **Files:** `home-1440.png`, `home-390.png`, `page-head-1440.png`.
- **Commit:** `8fc1dfb`.
- **Licence:** original layout and fixture copy. The captures use the template's
  demo photography (remote Picsum URLs in `sections/fixtures.ts`), which is not
  shipped as client art. Gelasio and Inter load through `next/font` under the SIL
  Open Font License.
