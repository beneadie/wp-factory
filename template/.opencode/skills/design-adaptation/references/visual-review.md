# Visual Review

Use this after the site renders real content and before you call a design pass
done. The accessibility tree proves structure; it does **not** prove appearance.
Screenshots do.

## The only valid evidence

1. Run the preview server.
2. Take screenshots at 1440×900 (desktop) and 390×844 (mobile), on the home page
   and one inner page. `npm run shots -- --url http://localhost:PORT` writes
   them to `docs/verification/shots/`.
3. **View each PNG.** If you used the Playwright MCP server, call
   `browser_take_screenshot`; its default snapshot is the accessibility tree and
   omits colour, type, spacing and crop.
4. Compare against the origin at the same widths. Judge, do not just capture.

## Hard checks

| Check | Pass condition | How to see it |
|---|---|---|
| Type families | At most 2 families. No cursive or script face. | Count distinct families in a screenshot; check `theme.base.css` (template) plus `theme.css` (client). |
| Type scale | At least 3 distinct sizes above the fold. | Look at the hero: eyebrow, heading, supporting copy. |
| Measure | Body copy is at most 75 characters per line. | Screenshot at 1440px; if the paragraph runs edge to edge, it is too wide. |
| Section rhythm | At least 64px between sections on desktop, 40px on mobile. | Gaps look intentional, not cramped or random. |
| Accent | One accent colour, used for emphasis and interaction. | If three unrelated colours compete, fail it. |
| Contrast | Text meets WCAG AA (4.5:1 body, 3:1 large text). | Check the token values; do not trust taste. |
| Image ratios | Every image slot declares an aspect ratio. | No layout jump while images load; inspect the slot wrapper. |
| Image slots | No blank, transparent or broken image slot. | Screenshot with images loaded; a placeholder must still be visible. |
| Signature device | The template's one distinctive compositional device is present. | The page should be recognisable as this template, not generic cards. |
| Reduced motion | Content remains complete when animation is off. | Emulate `prefers-reduced-motion: reduce`; nothing disappears. |

## The signature device

The template's `docs/site/template.md` names the device: an oversized rule, a
split hero, a numbered list, a full-bleed crop, a bordered grid, or similar. One
device, used consistently. If the screenshot could belong to any template, the
composition was not applied.

## Two fixes, then stop

Compare home, inner and mobile. Pick the two highest-impact mismatches — usually
one in the hero and one in the section rhythm — fix them, screenshot again, and
stop. A third pass is a later job. Write what remains, and what you deliberately
did not match, in `docs/site/design-notes.md`.

## Anti-patterns

- Declaring a page done from the DOM or a passing test suite.
- Judging a screenshot you did not open.
- A palette applied as raw hex in components instead of token values.
- Three accent colours, four type sizes, or a different rhythm on every section.
- A cursive or script face standing in for personality.
- An image slot that is blank while loading, or has no declared ratio.
- Removing content to make reduced-motion look tidy.
