Design pass for {{name}} ({{slug}}) — the last sub-step of Phase 4a Base.
Template: {{template}}. Site mode: {{site_mode}}.

This is part of the same base pass, not a new phase. Do it after the base routes
render real data and `bash scripts/check.sh` has passed. Load `design-adaptation`
and read its `references/visual-review.md` before you judge anything.

## Read

- `docs/site/06-brand-assets.md` — the origin's real colours, type, logo and
  assets.
- `docs/site/template.md` — the composition this site was built from.
- `docs/site/reference/README.md` — the template's own reference, when present.
- `src/template-sections/index.ts` — the sections you may compose.

Do not re-read discovery docs that are already in this conversation. If
`docs/site/design-notes.md` already exists and the screenshots are current, do
not repeat the pass; fix only what the retry asks.

## Apply the brand

- Write the origin's palette and type into `src/styles/theme.css` as token
  **values only**. Keep it to a single `:root` block: no new selectors, no
  layout rules. Never rename, add or remove a token. This file loads after
  `theme.base.css`, so it only needs the origin's overrides, not a copy of the
  template values.
- `src/styles/theme.base.css`, `src/config/theme.ts` and
  `src/template-sections/` are regenerated from the template on every run.
  Never edit them; client decisions belong in `src/styles/theme.css` and
  `docs/site/design-notes.md`. If `src/app/globals.css` does not import
  `../styles/theme.base.css` before `../styles/theme.css`, add those two imports
  in that order. That is wiring, not redesign.
- Apply the template's section composition. Use the existing section components
  and their props; do not rebuild primitives or add routes.
- Keep one accent colour. At least three type sizes above the fold. Body measure
  at most 75ch. Section rhythm at least 64px on desktop and 40px on mobile.
- Declared image ratios on every slot; never leave a blank image slot.

## Look at the real page

1. Start a preview server on a free port (`npm run dev`, or `npm run start` after
   a build).
2. Take screenshots of home, one inner page and mobile:

       npm run shots -- --url http://localhost:PORT

   or use the Playwright MCP tools.
3. **View the PNGs.** The Playwright MCP server is accessibility-tree based by
   default and does **not** show appearance. Call `browser_take_screenshot` and
   open the image before you judge a page.
4. Compare against the origin's home and one inner page at the same widths.

Fix at most two things, then stop. A third pass is a later job.

## Budget

About 15 minutes, screenshot, two fixes, stop. The base pass's 60-call budget
covers construction; the screenshots and comparisons are this sub-step's own
work, roughly a dozen calls.

## Never

- Invent a logo, icon, photograph, illustration or copy. Use only assets and text
  the origin actually has; if an asset is missing, record it as missing.
- Rename tokens, edit components, add routes or change data.
- Edit `src/styles/theme.base.css`, `src/config/theme.ts` or
  `src/template-sections/`; they are regenerated and your changes would be lost.
- Declare the page done without viewing a screenshot.

## Write

`docs/site/design-notes.md` with three sections:

- **Template given** — `{{template}}` and what came from `docs/site/template.md`.
- **Brand applied** — the palette, type and spacing values written and where.
- **Deliberately not matched** — what differs from the origin, and why.

Do not add a status line for this sub-step: `Phase 4a Base: PASS` covers it.
If time runs out, record what remains in `design-notes.md` rather than blocking.
