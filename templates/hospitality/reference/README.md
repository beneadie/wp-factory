# Hospitality — reference shots

Three screenshots define whether this template is working. Capture them from a
composed site at 1× device scale, wait ~1.2s after load so the hero wipe and
reveal have settled, and store the PNGs beside this file.

| File | Viewport | What it must demonstrate |
|---|---|---|
| `home-1440.png` | 1440 wide, full page | The hero as a single 3:2 food photograph with a soft bottom scrim, one serif line and one pill, bottom-left. Below it, the three "today" cards at 4:5 with hairline captions and no card borders. Further down, the dotted-leader menu shows dishes, descriptions and aligned euro prices in two columns. |
| `page-head-1440.png` | 1440 × 900 | A thin inner page with no image and no body copy: short rule and eyebrow, display title, full-width hairline, three numbered sibling links in one row. It must look composed, not unfinished — this is the check that the template can carry a page with almost no content. |
| `home-390.png` | 390 wide, full page | The same home page on mobile: hero headline wraps without clipping, cards stack at 4:5, menu dish/price lines and dotted leaders stay legible at 17px, and the inverse hours band emphasises today by weight. No horizontal scroll, no blank image slot. |

The signature device is the menu typography. If the dotted leaders, tabular
prices or small-caps course names are not obvious in the 1440 capture, the
screenshot fails regardless of how good the hero looks.

## Provenance

- **Source URL(s):** None. Original composition for the factory; `design.md`
  records the named influences.
- **Captured:** 17 November 2026, from the composed template at `/demo` and
  `/demo/inner`.
- **Files:** `home-1440.png`, `page-head-1440.png`, `home-390.png`.
- **Licence:** original layout and fixture copy. The captures use the template's
  demo photography (remote Picsum URLs in `sections/fixtures.ts`), which is not
  shipped as client art. Newsreader and Inter load through `next/font` under the
  SIL Open Font License.
