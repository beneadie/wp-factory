# Appointment

## Intent

A calm, schedule-led clinic template for services people book in advance — dental, physiotherapy, GP, vet, salon, studio. It should read as competent and unhurried: the appointment itself, not the marketing, is the main character.

## Reference

There is no single captured site. The reference is the appointment card and the printed clinic timetable: a real date, two times, a fee list you can read before you arrive. Taken from that world: the tabular date, the fixed fee column, the day-by-day timetable, the plain-spoken tone. Refused: stock smiles, icon rows, gradient buttons, urgency badges and decorative "book now" arrows.

## Signature device

**The timetable.** A real table with sticky day headers, 1px rules, times in tabular numerals, treatment names in Petrona, and availability expressed as a solid filled pill (`Book`) versus a plain outlined pill (`Full`). Sticky positioning is pure CSS; there is no JavaScript.

It is placed inside `FeatureGrid`, directly below the treatment ledger: first the price (what it costs), then the week (when you can have it). The hero's "Next available" card is the entry point into the same system and links down to `#timetable`.

The treatment ledger is a two-column ruled list: name and duration on the left, fee in tabular numerals aligned right. A fixed fee column is a trust device; it must never turn into free-flowing price text.

## Layout and spacing

- Container 1180px, 24px gutter.
- Section rhythm 88px desktop / 52px mobile; the stat band uses a slightly tighter 72px / 44px.
- Hairlines carry all structure. No card shadows, no panels inside panels, no icon per treatment.
- Hero is a 6/4 split: copy at 3fr, the next-available card at 2fr. The card is white on the warm page ground, with a 1px border and an internal 1px rule.
- `centered` exists for contract parity: copy only, no card, no image. `full` puts the same copy on the inverse field, optionally over a supplied image; without an image it is a plain dark band. The split remains the signature.
- Display sizes: hero 44–72px, page head and closing CTA 44–64px, section titles 30–40px. Tracking −0.015em, leading 1.08.
- Body: 17px/1.6. Eyebrow: 11px, uppercase, 0.14em. All figures — prices, times, dates, stats — use tabular numerals.
- PageHead is deliberately empty of images and paragraphs: eyebrow, large title, one hairline, a numbered row of sibling links (three in the fixture).

## Motion

Shared `.reveal` only. Colour and border transitions use the token durations. No image wipe, no parallax, no bouncy easing, no hover transforms that move layout. Reduced motion is handled by the shared motion layer.

## What an adapter may change

- Every string in `sections/fixtures.ts`, and the `body` format that feeds the fee/duration columns: `"from €145 · 50 min"`.
- The demo date and two chips in `sections/hero.tsx` ("Mon 16 Nov", 08:40, 11:20), and `WEEK` in `sections/feature-grid.tsx` — replace with the client's real schedule.
- Token values in `theme.css` to match the client's brand; the relationships (bg / surface / text / muted / border / accent / inverse) must survive.
- `theme.ts` font choices, provided the pairing stays display + sans, never italic or script.
- Optional hero photography via the `Hero` image prop; it lands as a 21:9 band below the split, never inside the card.
- Section order on a page, and whether `SecondaryCta` is a phone number.

## What it must never change

- The six named exports, their prop types, and the `sections` object in `sections/index.ts`.
- The timetable mechanism: sticky `<th>` day header, CSS-only, 1px separators, tabular times, display-face treatment names, filled versus outlined availability pills.
- The fixed, right-aligned fee column and tabular numerals.
- The split hero composition: copy plus a bordered next-available card; the card is the visual, not a photograph.
- The restraint rules: no shadows, no display italic, no third typeface, no icon-per-treatment clutter, no bouncy motion.

## Visual self-check

1. At 1440 the hero reads as 6/4, the card's top aligns with the eyebrow, and the primary CTA and the call link sit on one calm line.
2. At 390 the hero stacks without clipping, the card keeps its 1px frame, and the call alternative remains visible below the button.
3. Every fee sits in the same right-hand column, digits are tabular, and no price wraps away from its treatment name.
4. Scrolling the timetable reveals a day header pinned to the top of the panel; only hairlines separate rows; Book is filled and Full is outlined.
5. PageHead with no image, no tagline and three links looks finished rather than empty at both widths.
6. There are no shadows, no more than the three core colours plus inverse, focus rings are visible, and the text/background pairs meet contrast at body size.

## Wiring notes

- Load `tokens.css`, then the shared prose/motion layers, then `theme.css`.
- Put `fontVariables` from `theme.ts` on `<body>` so `--font-petrona` and `--font-inter` exist when the token file resolves `--font-display` / `--font-sans`. `themeClassName` is an alias.
- `FeatureGrid` anchors `#timetable`; the hero card links to it. Keep the id if the timetable stays on the same page.
- `FeatureGrid` derives sessions from its own items, cycling them across the week. With a different treatment count the rotation still works; with zero items the section renders nothing.
