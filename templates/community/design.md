# Community

A belonging-led template for a charity, sports club, school, parish, festival or
community centre, it should read like a well-kept notice board and a club's
annual report: warm paper, near-black ink, one blue accent reserved for action,
hairlines instead of cards, real dates and named people. The page earns trust by
being specific and calm, not by decorating.

## Reference

Not one source site. A composite of Irish community-sector conventions: parish
notice boards, GAA and community-centre annual reports, and charity donation
pages. No third-party code, photograph, logo or copy is reproduced. Every string
in `sections/fixtures.ts` is fictional and written for this overlay.

## Signature device

The **notice strip**: full-bleed dated rows separated by 1px rules, with the day
in 11px capitals, the date in the display serif with tabular numerals, and the
notice title at 17px. The first dated row carries one small accent **New** flag.

It is rendered by **StatBand** and sits **immediately below the hero** on the
home page, between two hairlines on `--color-surface`. It is the first thing
after the opening statement, so the organisation feels alive before the page
starts explaining itself.

The prop mapping is deliberately simple:

```ts
{ value: "Fri 20 Nov", label: "Winter Fair · Hall doors 6pm" }
```

Rows are ordered **most recent/nearest first**; the component flags the first
dated row. If the values are figures (`"420+"`), the same band renders as a
quiet figures list with no flag. Never put the flag on more than one row.

Two supporting devices carry the same logic:

- **1px top rules, not cards.** FeatureGrid's three items each start with a
  hairline, a serif heading and a short body. No border, no fill, no shadow.
- **The document list.** Items whose `href` ends in `.pdf`, `.docx`, `.xlsx`,
  `.pptx`, `.rtf`, `.zip` or `.csv` are listed below the cards as ruled rows:
  title left, `PDF · 2.4 MB` right. `body` is the file size; the type comes from
  the extension.

## Spacing, type and motion

- Container **1200px**, gutter 20px mobile / 32px desktop (matching
  `.container-page`), reading measure 68ch.
- Section rhythm **88px desktop / 52px mobile**. The notice strip is the one
  band that is intentionally tighter: 56–72px rows inside its own hairlines.
- Display **44–72px**, leading 1.1, tracking −0.01em. Section headings 32–44px;
  the closing CTA 44–56px. Body **17px/1.65**; lede 20px/1.55.
- Eyebrow **11px uppercase at 0.16em** in the accent. Caption 12px muted.
- The hero photograph is **3:2**, radius **8px**, with a 12px caption. Buttons
  have an 8px radius, are 48px tall, and every text link and row is at least
  44px.
- `theme.ts` wires **Gelasio** (display) and **Public Sans** (sans)
  through `next/font`; `theme.css` resolves them through `--font-gelasio`
  and `--font-public-sans`, with an Inter/system fallback if the layout has not
  applied the font variables yet.
- Motion is the shared `.reveal` primitive on below-the-fold blocks
  (FeatureGrid header, QuoteBand and CtaBand inner), and nothing else. The hero,
  its LCP photograph and the PageHead title never reveal from opacity 0. No
  stagger, no parallax, no image wipe. Hover is limited to an underline, a rule
  colour and a 4px arrow nudge on token durations. Reduced motion is already a
  no-op in `motion.css`.
- Focus is always visible: the global accent ring on light bands, a white
  outline and white ring on inverse bands. Nothing is removed from the tab
  order.

**Wiring.** `theme.ts` exports `fontVariables` (and the `themeFontVariables`
alias) for the root layout's `<html>` or `<body>`, plus the default
`TemplateTheme` object (`name: "community"`, serif display, split hero, unbanded
sections, standard measure). `theme.css` is already imported last in
`globals.css`.

## Section behaviour

- **Hero** — 5/7 split, copy left, 3:2 photograph right with a caption, one
  accent button and one text link. `image.alt` is also rendered as the visible
  caption, so write it as a short caption sentence. `centered` is honoured as
  copy-only. `full` is accepted but composed as the split, because this template
  never sets text over an image.
- **PageHead** — eyebrow, display h1 (max 20ch), optional tagline, hairline,
  then three sibling links as a three-column serif row with 1px dividers. With
  no links or tagline it is still a complete page: air, title, rule.
- **FeatureGrid** — three ruled cards, then the document list. The whole card
  is the link; "Read more" is a label, not an icon-only affordance.
- **QuoteBand** — inverse band, one 28–44px serif quote, attribution below in
  11px capitals, optional text link. Left-aligned, never italic.
- **CtaBand** — inverse band, 44–56px title, body at 48ch, one accent donate /
  join control. On mobile the button is full width.
- **StatBand** — the notice strip described above.

## What an adapter may change

- **Colour — always.** Replace the eleven `--color-*` triples in `theme.css`
  with the client's brand. Keep the roles: one accent, an inverse band, hairline
  borders, an accent-ink that passes contrast on the accent.
- **Type — only when the brand demands it.** Load the client face in `theme.ts`
  and repoint `--font-display` / `--font-sans`. Keep a serif display face, keep
  two families, keep the 44–72 display range and the 17/1.65 body.
- **Copy, links and images.** Replace every fixture, give each image real alt
  text, dimensions and a 3:2 hero crop, and point CTAs at the client's real
  donate and volunteer pages.
- **Card and document counts.** Add, remove or reorder feature cards and
  documents. A document row needs a file href and its size in `body`.
- **Section order and spacing values**, within the 88/52 rhythm and the 1200
  container. Leave more air rather than less.
- **The notice strip's rows and dates**, as long as the most recent/nearest
  stays first.

## What it must never change

- The exported names, the six props and the `@/lib/section-types` contract. No
  new required props, no widened props.
- The notice strip: dated rows, 1px separators, tabular dates, one accent New
  flag on the first (most recent) dated row. It must not become a row of
  statistic cards.
- The inverse donate / join band and the accent action. The path must remain
  findable without reading the page.
- No text over the hero photograph. No display italic, script or cursive face.
  No card shadows, no gradients, no second accent.
- No icon-only actions; every icon is decoration beside a label.
- Contrast floors: body and small text ≥ 4.5:1, large display ≥ 3:1, focus
  indicator ≥ 3:1 against its surroundings. Never muted grey below 4.5:1.
- Images outside `@/components/site-image`, or a slot without width, height and
  a declared aspect ratio. Never a blank image slot.
- Raw hex outside `theme.css`, or a colour/font/radius/duration written into a
  section file.

## Six-point visual self-check

1. **Five-second test.** At 1440 and 390, "Donate to the trust" is visible
   above the fold as a label on an accent button, and "Volunteer with us" is
   visible beside or below it. Neither is an image or an icon.
2. **Notice strip.** Directly below the hero: three dated rows, day/date/title
   aligned in columns, dates tabular, exactly one accent **New** flag on the
   first dated row, 1px rules above, between and below. It reads as a notice
   board, not a stats band.
3. **PageHead.** At 1440 with no tagline, no body and no image it still holds:
   eyebrow, display h1 at 44–72px, generous air, then one full-width hairline.
   With three links the rule opens a three-column serif row divided by 1px
   rules; at 390 the same links stack with top rules and 56px targets.
4. **FeatureGrid and documents.** Three cards with a 1px top rule, no border or
   shadow, serif headings and bodies at 38ch. The document list below reads
   title left, `PDF · size` right, every row at least 56px tall. The inverse
   CtaBand closes the page.
5. **Type and spacing.** Display 44–72px at 1440, still ≥44px at 390; body
   17/1.65; 88/52 section rhythm; 1200 container; the 3:2 photograph has an 8px
   radius and a 12px caption. No heading orphans, no horizontal scroll at 320,
   768 or 1440.
6. **Contrast and focus.** Ink on paper ≈17:1; muted on paper ≈5.8:1; accent on
   paper ≈6.5:1; white on accent ≈6.7:1; inverse text on inverse ≈17:1. Tab
   through the hero, page links, cards, documents and CTA: every stop has a
   visible ring, including the white treatment on the two inverse bands.
