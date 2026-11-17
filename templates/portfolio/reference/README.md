# Portfolio — visual reference

Three screenshots are the acceptance evidence for this template. Capture them
from a rendered site (or the section styleguide), never from a mock-up, and save
them beside this file with exactly these names.

Recommended capture: Chrome, device pixel ratio 1 at 1440 and 2 at 390, no
scrollbars, `prefers-reduced-motion: no-preference` for the composition shots.
Use the home route for the hero and the studio route for PageHead.

## `home-1440.png` — 1440 × 2100

The top of the home page: hero plus the first complete project row.

Must demonstrate:

- The full-bleed 16:9 hero photograph, with no card, radius or shadow, and the
  eyebrow top-left / `01` top-right chrome.
- The hero title in Instrument Serif, bottom-left, on one line.
- The start of the project index: at least one rule-separated 7/5 row with its
  index numeral, serif title, one-sentence description, caption and year.
- The index numeral and year aligned in tabular columns; neither accent at rest.

## `page-head-1440.png` — 1440 × 900

The top of the studio/inner page, showing only PageHead.

Must demonstrate:

- A composed header with **no image and no paragraph body copy**: eyebrow, one
  display h1, at most one short tagline, one hairline, three sibling links.
- Enough air above and below the rule that the page reads intentional rather
  than unfinished.
- The three links each carrying `01` / `02` / `03` in Inter chrome, with one
  link hovered or focused to show the accent on the numeral only.

## `home-390.png` — 390 × 1200

The home page at mobile width: hero plus the first project row.

Must demonstrate:

- The 16:9 hero still legible: chrome, title, and the flat scrim, with no
  clipped descenders and no horizontal overflow.
- The lede and rule-links wrapping below the photograph rather than covering
  it.
- Project rows stacking image-first, with the index and year on one line, and
  the 720 text measure collapsing to the viewport gutter.
- Section rhythm at 56px rather than the desktop 100px.

## What is not in these shots

The image wipe is a motion state, not a still. Verify it separately by
scrolling the index at 1440 and confirming that each photograph uncovers
top-down over roughly 900ms (or tracks the viewport where scroll-driven
animation is supported), while the hero photograph never animates. Also check
`prefers-reduced-motion: reduce`: all content must be visible with no clip and
no fade.

## Reference, capture date, licence

- **Composition:** original to this factory, drawn from the portfolio template
  brief (November 2026). No third-party site layout was traced or copied;
  there is no source URL for the composition.
- **Fixture photography:** Unsplash CDN, used under the Unsplash License
  (<https://unsplash.com/license>), at
  `https://images.unsplash.com/photo-<id>`. Photo IDs:
  `1518837695005-2083093ee35b`, `1439405326854-014607f694d7`,
  `1469474968028-56623f02e42e`, `1472214103451-9374bd1c798e`,
  `1441974231531-c6227db76b6e`, `1500375592092-40eb2168fd21`,
  `1444927714506-8492d94b4e3d`. These are fixture slots only; a client build
  replaces them with the origin's licensed media.
- **Capture date:** 17 November 2026, from the composed template at `/demo`
  and `/demo/inner`.
- **Files:** `home-1440.png`, `page-head-1440.png`, `home-390.png`.
- **Type licence:** Inter and Instrument Serif are served through
  `next/font/google` under the SIL Open Font License.
