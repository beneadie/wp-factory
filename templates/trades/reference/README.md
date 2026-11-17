# Trades reference screens

Three screenshots are the acceptance evidence for this template. Capture them
from a page composed with the fixtures in `../sections/fixtures.ts` (or with
real client content of the same length), then **open each PNG and judge it**.
An accessibility tree or a passing build is not evidence of appearance.

Suggested capture: the repo's `npm run shots -- --url http://localhost:PORT`
or Playwright at the exact viewports below. Keep the originals in this folder.

## 1. `home-1440.png` — desktop home, 1440 × 900

Must demonstrate:

- A full-bleed 16:9 job photograph with the headline and lede bottom-left on a
  layered dark scrim. The scrim must read as a gradient, not a flat black slab.
- At least three type sizes above the fold: 11px accent eyebrow, 80px display
  h1, 19px lede, plus the button label.
- A visible quote button and a **real phone number** as a secondary link.
- The signature proof strip immediately beneath the hero: three 56–72px
  tabular numerals, hairline dividers, 11px uppercase labels. It must not be
  repeated further down the page.
- Below the strip, the services ledger begins as hairline rows (index, title,
  one-line body, arrow) — not cards.

## 2. `inner-1440.png` — desktop inner page, 1440 × 900

Must demonstrate:

- `PageHead` with **no image and no body copy**: 11px accent eyebrow, display
  h1 at 48–80px, generous air, a hairline, and three sibling links as an
  indexed strip.
- The page still feels composed and expensive with that little content. No
  empty media slot, no placeholder box.
- The service ledger continues below with consistent 72px section rhythm.
- Body measure stays at or under 68ch, and every row arrow aligns on one axis.

## 3. `home-390.png` — mobile home, 390 × 844

Must demonstrate:

- The hero headline is readable at 48px, copy remains left-aligned, and the
  photo is a useful crop (not a letterbox strip).
- The fixed quote/call bar sits at the bottom with safe-area padding, a clear
  primary action, and the phone number still tappable.
- The stat strip keeps three columns with 11px labels; nothing clips or
  overflows horizontally.
- Service rows stack into number / title / arrow with the body underneath, and
  the arrows stay aligned.
- The CTA band and footer remain clear of the sticky bar; links and copyright
  are readable. The bar is the only fixed element, and it should not obscure
  the last line of the page.

If a screenshot differs from these notes, fix at most the two highest-impact
mismatches (usually the hero crop and the section rhythm), re-capture, and
stop. Record what remains in `docs/site/design-notes.md`.

## Provenance

- **Source URL(s):** None. Original composition for the factory; `design.md`
  records the named influences.
- **Captured:** 17 November 2026, from the composed template at `/demo` and
  `/demo/inner`; recaptured the same day after the demo phone-number cleanup.
- **Files:** `home-1440.png`, `inner-1440.png`, `home-390.png`.
- **Licence:** original layout and fixture copy. The captures use the template's
  demo photography (remote Unsplash and Pexels URLs in `sections/fixtures.ts`),
  which is not shipped as client art. Inter loads through `next/font` under the
  SIL Open Font License.
