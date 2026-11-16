# Community — reference record

## Basis

This overlay is a **composite**, not a clone of one site. The references are
Irish community-sector conventions rather than a single URL: parish notice
boards, GAA and community-centre annual reports, and charity donation pages.
The design takes their dated notices, document lists, named local voices and
plain donation asks; it refuses their clip-art, stock photography, gradients and
crowded sidebars.

| Field | Value |
| --- | --- |
| Template | `community` |
| Source URL(s) | None. Composite of public community-sector conventions. |
| Capture date | **Pending** — the overlay was authored without running the app. Record the date on the first capture from the composed site. |
| Licence | Original overlay. No third-party code, image, logo or copy is reproduced. All fixture copy is fictional. |
| Fixture photograph | `public/images/fixture-community-hall.jpg` is a placeholder path, not a shipped asset. A real photograph of real people must replace it before the reference shots are taken. |

The shared image placeholder is acceptable while developing a section; it is
**not** acceptable in a reference screenshot. A placeholder pattern in one of
the three shots means the shot is rejected.

## Required screenshots

Capture the **composed site**, not the isolated styleguide, at **1× device
scale** with the shared fonts loaded. Use the template's shot script, then copy
the three relevant files into this folder with the names below.

### 1. `home-1440.png`

Viewport **1440 × 900**, full page.

Must demonstrate:

- the hero is visibly **5/7**: copy left, 3:2 photograph right, caption below;
- **Donate to the trust** is a labelled accent button, visible above the fold,
  with **Volunteer with us** beside it as a text link;
- the **notice strip** sits directly below the hero, between two hairlines:
  day, date and title in columns, tabular dates, exactly one accent **New**
  flag on the first dated row;
- three feature cards with **1px top rules and no borders or shadows**, then the
  document list (title left, `PDF · size` right);
- the inverse quote and inverse donate / join bands close the page without a
  second accent or a shadow.

Reject if the hero image is a placeholder, the strip reads as a row of
statistic cards, or more than one row carries a flag.

### 2. `page-head-1440.png`

Viewport **1440 × 900**, one inner page that uses `PageHead` and has no body
copy and no image. A title-only page is even better for this test.

Must demonstrate:

- eyebrow in 11px accent capitals, display h1 at 44–72px, generous air above
  and below;
- one full-width hairline, then **three sibling links** as a three-column serif
  row with 1px dividers and 44px+ targets;
- no empty image hole, no ghost card, no centred headline, no body copy used as
  filler;
- the page still reads as deliberate with the viewport cut just below the link
  row.

### 3. `home-390.png`

Viewport **390 × 844**, full page.

Must demonstrate:

- the display title is still at least 44px and does not clip or cause horizontal
  scroll at 390 (also spot-check 320);
- the donate button is full width and at least 48px tall; the volunteer link and
  every row remain 44px+ tap targets;
- the notice strip stacks the day above the date, keeps the title readable and
  keeps the single **New** flag on the first row;
- the three cards become one column with the same 1px top rules; the document
  list keeps title and `PDF · size` on one row without collision;
- the inverse bands keep inverse text at AA contrast and show the white focus
  treatment when tabbed.

## Capture command

With the composed site running locally:

```bash
npm run shots -- --url http://localhost:3000 --inner http://localhost:3000/about/

cp docs/verification/shots/home-desktop-full.png reference/home-1440.png
cp docs/verification/shots/inner-desktop.png      reference/page-head-1440.png
cp docs/verification/shots/home-mobile-full.png   reference/home-390.png
```

Record the date, the URL actually used and the commit SHA beside each file when
the shots are taken.
