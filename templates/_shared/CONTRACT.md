# Template overlay contract

Eight template overlays will be built against this file. It is binding. If an
overlay needs something that is not here, it amends this contract first and
tells the others — it does not invent a token, rename one, or fork a stylesheet.

The foundation lives in this directory (`templates/_shared/`) and is
materialised into `template/` so the neutral base compiles before any overlay
exists:

| Shared source (factory only)          | Materialised in the site (what ships)  |
| ------------------------------------- | -------------------------------------- |
| `templates/_shared/tokens.css`        | `template/src/styles/tokens.css`       |
| `templates/_shared/prose.css`         | `template/src/styles/prose.css`        |
| `templates/_shared/motion.css`        | `template/src/styles/motion.css`       |
| `templates/_shared/fonts.ts`          | `template/src/lib/fonts.ts`            |
| `templates/_shared/sections/*.tsx,ts` | `template/src/template-sections/*`     |

`template/src/styles/theme.base.css` and `template/src/styles/theme.css` exist
only in the composed site. The base ships both comment-only so the import chain
in `globals.css` is valid before any template is chosen.

A generated site never contains `templates/`. Never import from it. The only
cross-directory import that survives composition is `@/…` inside `template/`.

To re-sync the materialised copies after editing the foundation:

```bash
cp templates/_shared/tokens.css templates/_shared/prose.css \
   templates/_shared/motion.css template/src/styles/
cp templates/_shared/fonts.ts template/src/lib/fonts.ts
cp templates/_shared/sections/components.tsx \
   templates/_shared/sections/fixtures.ts \
   templates/_shared/sections/index.ts template/src/template-sections/
```

---

## 1. What an overlay is

An overlay is a **design**, not an application. It ships:

- values for the existing tokens,
- six section components,
- two fonts,
- a written record of the reference it came from.

It does **not** add routes, fetch data, add dependencies, touch
`src/app/[...slug]`, change `src/lib/wp/*`, or add commerce of any kind. Pages,
menus, products and SEO come from WordPress and from the substrate phases. If a
section needs real data, the page passes it as props.

## 2. Overlay directory layout

```
templates/<name>/
├─ theme.css            token overrides in :root, plus namespaced .t-<name>-* furniture only
├─ theme.ts             non-CSS decisions (typed; see §3)
├─ design.md            what the reference is, what we took, what we refused
├─ sections/
│  ├─ index.ts          the barrel — the only file other code imports
│  ├─ hero.tsx          (or components.tsx; file split is free)
│  ├─ page-head.tsx
│  ├─ feature-grid.tsx
│  ├─ quote-band.tsx
│  ├─ cta-band.tsx
│  ├─ stat-band.tsx
│  └─ fixtures.ts       realistic copy for the styleguide
└─ reference/
   └─ README.md         source URL(s), screenshots, date captured, licence note
```

`<name>` is the slug used by the queue (e.g. `kerry-woollen-mills`). One
directory per template; no shared files between overlays.

## 3. Composition

| Overlay file                    | Becomes                              |
| ------------------------------- | ------------------------------------ |
| `templates/<name>/theme.css`    | `src/styles/theme.base.css`          |
| `templates/<name>/theme.ts`     | `src/config/theme.ts`                |
| `templates/<name>/sections/*`   | `src/template-sections/*` (replaced wholesale) |
| `templates/<name>/design.md`    | `docs/site/template.md`              |
| `templates/<name>/reference/*`  | `docs/site/reference/*`              |

Two stylesheets, two owners:

- `src/styles/theme.base.css` is the **template skin**. Regenerated from
  `templates/<name>/theme.css` on every run; never edited by hand.
- `src/styles/theme.css` is the **client overrides**. Belongs to the site, is
  written once by the design pass and is never regenerated.

`src/app/globals.css` imports `tokens.css`, `prose.css`, `motion.css`, then
`theme.base.css`, then `theme.css`. So the template skin beats the foundation,
and a client override beats the template — without touching the import list.

### 3.1 Cascade, and why it survives bundling

`globals.css` lists the imports after the three `@tailwind` directives, and
css-loader hoists every `@import` when it compiles. The compiled order is
therefore `tokens → prose → motion → theme.base → theme → tailwind preflight →
tailwind utilities`; the relative order of the design-system files is preserved,
so each skin still beats the one before it.

That is safe because every design-system rule is class-scoped (`.wp-prose`,
`.reveal`, `.btn`) and Tailwind's preflight is element-scoped, so specificity
keeps the layers apart. Utilities loading last is deliberate: it is the escape
hatch a section uses for a one-off (`mt-0`, `max-w-none`). The `--prose-*`
tokens are still the right way to retune prose.

`src/config/theme.ts` must export a default object with this shape (owned by the
substrate phase; do not add fields ad hoc):

```ts
export interface TemplateTheme {
  /** Must equal the templates/<name> directory name. */
  name: string;
  /** Which family drives headings: the serif or the sans. */
  displayFace: "serif" | "sans";
  /** Default hero composition for a page with no explicit variant. */
  heroVariant: "split" | "full" | "centered";
  /** Whether sections alternate bg-bg / bg-surface. */
  bandedSections: boolean;
  /** Prose measure preset; maps to a --prose-measure override. */
  proseMeasure: "narrow" | "standard" | "wide";
}
```

## 4. The token rule

**Templates may override VALUES. Templates may never rename, delete or add a
token.**

- Every token below exists in `tokens.css`, and an overlay's `theme.css` opens
  with one `:root { … }` block holding the values it changes.
- After that block an overlay may add **namespaced furniture only**: every class
  in every selector starts with `.t-<name>-` (`.t-practice-lede`). No global
  element selectors, no global utilities, no `!important`, nothing that can
  escape the namespace. Section components may use these classes; the tokens
  remain the source of truth.
- Colour tokens are space-separated sRGB channel triples, because Tailwind and
  the prose layer both read them as `rgb(var(--token))`:

  ```css
  :root {
    --color-bg: 247 244 238; /* not #F7F4EE */
    --color-accent: 30 64 52;
  }
  ```

- No raw hex, `rgb()` literal, `hsl()` or named colour anywhere outside
  `tokens.css`, `theme.base.css` and `theme.css`. No raw px in components: use
  Tailwind classes (which are token-mapped) or `var(--space-*)`.
- Do not override `--color-success`, `--color-warning` or `--color-error`;
  they are reserved for form validation.
- Do not add new `--*` names. If the design genuinely needs a value the
  contract lacks, amend this file first.

### 4.1 Colour

| Token                  | House default      | Meaning                                                |
| ---------------------- | ------------------ | ------------------------------------------------------ |
| `--color-bg`           | `250 248 244`      | Page background                                        |
| `--color-surface`      | `243 240 233`      | Recessed band: alternating sections, table heads       |
| `--color-elevated`     | `255 255 255`      | Raised card, panel, image slot                         |
| `--color-text`         | `20 20 20`         | Body copy and headings                                 |
| `--color-muted`        | `107 107 102`      | Secondary copy, captions, meta, eyebrows               |
| `--color-border`       | `230 226 218`      | Hairlines, table rules, field borders                  |
| `--color-primary`      | `20 20 20`         | Primary action fill                                    |
| `--color-accent`       | `180 85 45`        | The one brand colour; accent only, never a wash        |
| `--color-accent-ink`   | `255 255 255`      | Text and icons on `--color-accent`                     |
| `--color-inverse-bg`   | `28 28 26`         | Inverse band (quote band, full hero, footer)           |
| `--color-inverse-text` | `245 242 236`      | Text on `--color-inverse-bg`                           |
| `--color-success`      | `22 101 52`        | Reserved: valid form state                             |
| `--color-warning`      | `161 98 7`         | Reserved: warning state                                |
| `--color-error`        | `153 27 27`        | Reserved: invalid form state                           |

Tailwind aliases: `bg`, `surface`, `elevated`, `text`, `muted`, `border`,
`primary`, `accent`, `accent-ink`, `inverse-bg`, `inverse-text` (with `/alpha`).

### 4.2 Type

| Token            | House default                                            | Meaning                            |
| ---------------- | -------------------------------------------------------- | ---------------------------------- |
| `--font-display` | `var(--font-source-serif, "Source Serif 4"), ui-serif …` | Headings, section titles, prose h1/h2 |
| `--font-sans`    | `var(--font-inter, "Inter"), ui-sans-serif …`            | Body and UI                        |
| `--font-mono`    | `ui-monospace, SFMono-Regular …`                         | Code, token names in the styleguide |
| `--text-xs`      | `0.75rem` (12px)                                         | Eyebrow, caption                   |
| `--text-sm`      | `0.875rem` (14px)                                        | Label, meta, button                |
| `--text-base`    | `1.0625rem` (17px)                                       | Body copy                          |
| `--text-lg`      | `1.25rem` (20px)                                         | Lede, h4                           |
| `--text-xl`      | `1.5rem` (24px)                                          | h3                                 |
| `--text-2xl`     | `1.75rem` (28px)                                         | Small section title                |
| `--text-3xl`     | `clamp(2rem, 1.62rem + 1.9vw, 2.75rem)`                  | h2                                 |
| `--text-4xl`     | `clamp(2.4rem, 1.9rem + 2.6vw, 3.5rem)`                  | h1                                 |
| `--text-5xl`     | `clamp(2.9rem, 2.1rem + 4vw, 4.5rem)`                    | Hero display                       |
| `--text-6xl`     | `clamp(3.4rem, 2.2rem + 6vw, 5.5rem)`                    | Statement display                  |
| `--leading-display` | `1.06`                                                | Display leading                    |
| `--leading-body` | `1.6`                                                    | Body leading                       |

Fixed sizes below `2xl`, fluid clamps above. Display faces must be serif or
sans-serif: **no cursive, no script, no italic display face, ever**. Inter and
Source Serif 4 ship in `src/lib/fonts.ts`; a template may swap the display face
by pointing `--font-display` at another `next/font` variable, and must keep a
serif or sans-serif fallback in the stack.

### 4.3 Layout

| Token         | Default  | Meaning                                                   |
| ------------- | -------- | --------------------------------------------------------- |
| `--measure`   | `68ch`   | Reading measure. The contract, not a suggestion.          |
| `--container` | `1240px` | Outer container. Tailwind `max-w-content` resolves here.  |
| `--gutter`    | `24px`   | Page gutter for sections that do not use `.container-page` |

### 4.4 Space — a strict 4px scale

`--space-N` is `N × 4px`, `1` through `20`:

| Token | px | Token | px | Token | px | Token | px |
| ----- | -- | ----- | -- | ----- | -- | ----- | -- |
| `--space-1` | 4 | `--space-6` | 24 | `--space-11` | 44 | `--space-16` | 64 |
| `--space-2` | 8 | `--space-7` | 28 | `--space-12` | 48 | `--space-17` | 68 |
| `--space-3` | 12 | `--space-8` | 32 | `--space-13` | 52 | `--space-18` | 72 |
| `--space-4` | 16 | `--space-9` | 36 | `--space-14` | 56 | `--space-19` | 76 |
| `--space-5` | 20 | `--space-10` | 40 | `--space-15` | 60 | `--space-20` | 80 |

Tailwind's default spacing scale (`p-6`, `gap-10`, …) matches this exactly up to
`space-12` and at `14`, `16`, `20`. Do not use Tailwind `[13px]`-style
arbitrary values.

### 4.5 Radius and rules

| Token           | Default | Meaning                           |
| --------------- | ------- | --------------------------------- |
| `--radius-sm`   | `4px`   | Fields, small buttons             |
| `--radius-md`   | `8px`   | Cards, images                     |
| `--radius-lg`   | `16px`  | Large panels                      |
| `--radius-pill` | `999px` | Tags, pills                       |
| `--radius`      | `var(--radius-sm)` | Legacy alias; `.btn`/`.field` use it |
| `--rule`        | `1px solid rgb(var(--color-border))` | The only divider. No shadows anywhere. |

### 4.6 Motion

| Token                 | Default                        | Meaning                     |
| --------------------- | ------------------------------ | --------------------------- |
| `--ease-out`          | `cubic-bezier(0.22, 1, 0.36, 1)` | Standard easing           |
| `--ease-in-out`       | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetric easing          |
| `--duration-micro`    | `140ms`                        | Colour / border ticks       |
| `--duration-fast`     | `240ms`                        | Hovers, small state changes |
| `--duration-base`     | `420ms`                        | `.reveal`                   |
| `--duration-slow`     | `700ms`                        | `.reveal-image`             |
| `--duration-ambient`  | `8s`                           | Looping ambience            |

Two primitives only, in `motion.css`: `.reveal` (12px rise, 420ms, ease-out) and
`.reveal-image` (clip-path inset wipe, 700ms). Both are no-ops with content
visible under `prefers-reduced-motion: reduce`. Do not add easing curves, and do
not animate anything else.

## 5. The six sections

Types live in **`src/lib/section-types.ts`**; overlays import them from
`@/lib/section-types`. Never from `templates/`, which does not exist after
composition. (`templates/_shared/sections/types.ts` is a one-line pointer for
readers and is never compiled or imported.)

```ts
export type Cta = { label: string; href: string };
export type SectionLink = { label: string; href: string };

export interface SectionImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export interface HeroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  image?: SectionImage;
  variant?: "split" | "full" | "centered";
}

export interface PageHeadProps {
  eyebrow?: string;
  title: string;
  tagline?: string;
  links?: SectionLink[];
}

export interface FeatureGridProps {
  eyebrow?: string;
  title?: string;
  items: { title: string; body: string; href?: string }[];
}

export interface QuoteBandProps {
  quote: string;
  attribution?: string;
  cta?: Cta;
}

export interface CtaBandProps {
  title: string;
  body?: string;
  cta: Cta;
}

export interface StatBandProps {
  stats: { value: string; label: string }[];
}

export interface Sections {
  Hero: ComponentType<HeroProps>;
  PageHead: ComponentType<PageHeadProps>;
  FeatureGrid: ComponentType<FeatureGridProps>;
  QuoteBand: ComponentType<QuoteBandProps>;
  CtaBand: ComponentType<CtaBandProps>;
  StatBand: ComponentType<StatBandProps>;
}
```

Rules that apply to all six:

- **Presentational only.** No fetching, no `"use client"` unless a real
  interaction demands it, no WordPress types, no `dangerouslySetInnerHTML`.
- **Props are the API.** Overlays may not add a required prop or widen one. They
  may add an optional prop if all eight overlays agree and this file changes.
- **Server components.** They must render with JavaScript disabled.
- **Hrefs are whatever WordPress gave us.** No `/shop/` or `/services/`
  assumptions; pass through exactly.
- **`PageHead` is the thin-page archetype.** It must look deliberate with no
  body copy and no image: large title, hairline rule, optional link row. It is
  the page type that most often ends up looking broken on a captured site.
- **Images** go through `<SiteImage>` from `@/components/site-image`, so the
  slot is never blank and the ratio is reserved. Do not use `<img>` directly.

## 6. The prose layer

`prose.css` types captured WordPress HTML under `.wp-prose`. It is the highest
value file in the foundation because our pages are theme-echoed HTML with the
theme stylesheet removed. It covers `h1`–`h6`, `p`, `a`, `strong`/`em`, lists
two levels deep, stray `<li>`, `blockquote`, `figure`/`figcaption`, `img`,
`table`/`thead`/`tbody`/`th`/`td`/`caption`, `form`/`label`/`input`/`textarea`/
`select`/`button`, `hr`, `small`, `dl`/`dt`/`dd`, `code`/`pre`, and bare
`div`/`section` wrappers.

Usage from a route:

```tsx
<div className="wp-prose" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
```

Hard properties of the layer: measure `68ch`, body `17px` at `1.6`, display
serif for `h1`/`h2`, tabular numerals in tables, 1px rules and no shadows,
`max-width: 100%` images that keep their declared ratio, `24px` vertical
rhythm, no `!important`, one class of specificity.

Every value is a `--prose-*` variable. Retune these; never fork a rule.

### 6.1 Prose variables

**Scope and type**

| Token | Default | Controls |
| ----- | ------- | -------- |
| `--prose-font-body` | `var(--font-sans)` | All prose text |
| `--prose-font-display` | `var(--font-display)` | h1, h2 |
| `--prose-font-mono` | `var(--font-mono)` | code, pre |
| `--prose-measure` | `var(--measure)` | Max line length of `.wp-prose` |
| `--prose-size-body` | `17px` | Body size |
| `--prose-leading-body` | `var(--leading-body)` | Body leading |
| `--prose-color-body` | `rgb(var(--color-text))` | Body ink |
| `--prose-color-muted` | `rgb(var(--color-muted))` | Captions, markers, meta |

**Headings**

| Token | Default | Controls |
| ----- | ------- | -------- |
| `--prose-size-h1` | `var(--text-4xl)` | h1 size |
| `--prose-size-h2` | `var(--text-3xl)` | h2 size |
| `--prose-size-h3` | `var(--text-xl)` | h3 size |
| `--prose-size-h4` | `var(--text-lg)` | h4 size |
| `--prose-size-h5` | `var(--text-base)` | h5 size |
| `--prose-size-h6` | `var(--text-sm)` | h6 size |
| `--prose-weight-heading` | `500` | All heading weights |
| `--prose-leading-heading` | `var(--leading-display)` | Heading leading |
| `--prose-tracking-heading` | `-0.01em` | Heading tracking |

**Rhythm and lists**

| Token | Default | Controls |
| ----- | ------- | -------- |
| `--prose-space-block` | `var(--space-6)` | Space above any block |
| `--prose-space-heading` | `var(--space-10)` | Space above a heading |
| `--prose-space-heading-gap` | `var(--space-4)` | Gap from a heading to the next block |
| `--prose-space-list` | `var(--space-2)` | Between list items |
| `--prose-space-nested` | `var(--space-1)` | Before a nested list |
| `--prose-indent` | `1.4em` | First-level list indent |
| `--prose-indent-nested` | `1.15em` | Second-level list indent |

**Rules, media, captions**

| Token | Default | Controls |
| ----- | ------- | -------- |
| `--prose-rule` | `var(--rule)` | Table, field and `hr` rules |
| `--prose-radius-media` | `var(--radius-md)` | Image and `pre` corners |
| `--prose-space-figure` | `var(--space-3)` | Gap to the caption |
| `--prose-size-caption` | `var(--text-sm)` | figcaption, table caption |
| `--prose-size-small` | `0.875rem` | `<small>` |

**Quotes**

| Token | Default | Controls |
| ----- | ------- | -------- |
| `--prose-size-quote` | `var(--text-xl)` | Blockquote text |
| `--prose-leading-quote` | `1.4` | Blockquote leading |
| `--prose-rule-quote` | `2px solid rgb(var(--color-accent))` | Left quote bar |
| `--prose-space-quote-indent` | `var(--space-6)` | Text inset from the bar |
| `--prose-space-attribution` | `var(--space-3)` | Gap to `cite`/`footer` |

**Tables**

| Token | Default | Controls |
| ----- | ------- | -------- |
| `--prose-size-table` | `0.9375rem` | Table text |
| `--prose-space-cell-y` | `var(--space-3)` | Cell padding, block |
| `--prose-space-cell-x` | `var(--space-4)` | Cell padding, inline |

**Links**

| Token | Default | Controls |
| ----- | ------- | -------- |
| `--prose-link-color` | `rgb(var(--color-text))` | Link ink |
| `--prose-link-hover` | `rgb(var(--color-accent))` | Hover/focus ink |
| `--prose-underline-offset` | `0.18em` | Underline distance |
| `--prose-underline-width` | `1px` | Underline weight |

**Fields and buttons inside captured content**

| Token | Default | Controls |
| ----- | ------- | -------- |
| `--prose-color-field-bg` | `rgb(var(--color-elevated))` | Field fill |
| `--prose-color-field-text` | `rgb(var(--color-text))` | Field ink |
| `--prose-color-check` | `rgb(var(--color-accent))` | Checkbox/radio accent |
| `--prose-size-label` | `var(--text-sm)` | Label size |
| `--prose-size-field` | `var(--text-sm)` | Field text |
| `--prose-space-field-y` | `var(--space-3)` | Field padding, block |
| `--prose-space-field-x` | `var(--space-4)` | Field padding, inline |
| `--prose-space-field-gap` | `var(--space-2)` | Label to field |
| `--prose-space-field-group` | `var(--space-4)` | Between field groups |
| `--prose-radius-field` | `var(--radius-sm)` | Field corners |
| `--prose-textarea-min-height` | `8rem` | Textarea floor |
| `--prose-space-button-y` | `var(--space-3)` | Button padding, block |
| `--prose-space-button-x` | `var(--space-5)` | Button padding, inline |
| `--prose-radius-button` | `var(--radius-sm)` | Button corners |
| `--prose-color-button-bg` | `rgb(var(--color-primary))` | Button fill |
| `--prose-color-button-text` | `rgb(var(--color-bg))` | Button ink |

**Code**

| Token | Default | Controls |
| ----- | ------- | -------- |
| `--prose-size-code` | `0.9em` | Inline and block code size |
| `--prose-color-code-bg` | `rgb(var(--color-surface))` | Code fill |
| `--prose-space-code-y` | `0.15em` | Inline code padding, block |
| `--prose-space-code-x` | `0.35em` | Inline code padding, inline |
| `--prose-space-pre` | `var(--space-4)` | `pre` padding |
| `--prose-radius-code` | `var(--radius-sm)` | Inline code corners |

## 7. The styleguide

`src/app/__styleguide/page.tsx` is the acceptance surface: every token, every
prose element, all six sections, buttons in every state, and two snippets of
real theme HTML.

Next.js ignores folders prefixed with `_`, so the full page also has a routable
alias at `src/app/styleguide/page.tsx`. Open **`/styleguide`** in development, or
run with `STYLEGUIDE=1` against a production build. Without that flag the route
returns 404.

## 8. Done / not done

A template overlay is **done** when all of these are true:

- [ ] `theme.css` opens with one `:root` block of values; any rule after it is
      namespaced `.t-<name>-*`; no token renamed or removed, no hex outside this
      file.
- [ ] `theme.ts` matches `TemplateTheme` and its `name` equals the directory.
- [ ] All six sections exist and are exported from `sections/index.ts` with the
      exact names `Hero`, `PageHead`, `FeatureGrid`, `QuoteBand`, `CtaBand`,
      `StatBand`.
- [ ] They import types from `@/lib/section-types` — no import path contains
      `templates/`.
- [ ] All six are server components; no `"use client"` unless a real
      interaction needs it.
- [ ] `PageHead` reads as intentional with only a title (no tagline, no links).
- [ ] Hero renders in all three variants; `full` works with and without an
      image; `split` degrades to one column when there is no image.
- [ ] Images use `<SiteImage>`; no bare `<img>`; no blank slots.
- [ ] Every section works at 320px, 768px and 1440px without horizontal scroll.
- [ ] `.wp-prose` reads well on captured theme HTML: bare `<li>`, empty `<p>`,
      wrapper divs, a table with sentence-length cells, an image with no
      dimensions.
- [ ] Contrast: body text ≥ 4.5:1 against its background; accent used for
      emphasis, not body copy.
- [ ] Focus is visible on every interactive element; nothing removed from the
      tab order.
- [ ] `.reveal` / `.reveal-image` are the only animations used, and everything
      is visible under `prefers-reduced-motion: reduce`.
- [ ] No cursive, script or italic display face.
- [ ] `fixtures.ts` holds realistic copy for this client — never lorem ipsum,
      never "Lorem", never `Primary CTA`.
- [ ] `design.md` names the reference, what was taken and what was refused.
- [ ] `reference/README.md` records URL(s), capture date and licence note.
- [ ] `npx tsc --noEmit` and `npx eslint src` pass in the composed site.
- [ ] `/styleguide` has been opened and read at all three widths.

It is **not done** if:

- [ ] a route, a fetch, a dependency or a store feature was added;
- [ ] a token was renamed "for clarity";
- [ ] a shadow, gradient, cursive face or third easing curve appeared;
- [ ] the skin only looks right with the styleguide fixtures and breaks on the
      real captured pages;
- [ ] hover states exist but focus states do not;
- [ ] `!important` was used to beat the prose layer (override the `--prose-*`
      variable instead);
- [ ] the section components import from `templates/_shared`.
