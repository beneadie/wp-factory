import type {
  CtaBandProps,
  FeatureGridProps,
  HeroProps,
  PageHeadProps,
  QuoteBandProps,
  StatBandProps,
} from "@/lib/section-types";

/**
 * Fixtures for the Shop template.
 *
 * Names follow the shared barrel (`heroFixture`, `pageHeadFixture`, …) so the
 * styleguide and local previews keep working after this directory replaces the
 * base sections. Copy is realistic Irish retail: wool, ceramics, homeware. No
 * placeholder names, no filler copy.
 *
 * The product body is a meta line whose first segment contains the price — the
 * card splits on " · " so the price can sit on the baseline row.
 *
 * The Unsplash photographs are demo art for the template preview, not client
 * assets. An adapter replaces every image with the origin's own media.
 */

export const heroFixture: HeroProps = {
  eyebrow: "Autumn Collection — 2026",
  title: "Wool, made for the weather we live in.",
  lede: "Blankets, knitwear and small pieces from Irish mills and studios — chosen to be used, repaired and kept.",
  primaryCta: { label: "Shop the collection", href: "/shop/" },
  secondaryCta: { label: "Read our story", href: "/our-story/" },
  image: {
    src: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1600&h=2000&q=80",
    alt: "A flat lay of cream knitwear, denim, tan boots and a mug on white linen.",
    width: 1600,
    height: 2000,
  },
};

export const pageHeadFixture: PageHeadProps = {
  eyebrow: "The Journal",
  title: "Notes from the workshop",
  links: [
    { label: "All notes", href: "/journal/" },
    { label: "Materials & making", href: "/journal/materials/" },
    { label: "People & places", href: "/journal/people/" },
  ],
};

export const featureGridFixture: FeatureGridProps = {
  eyebrow: "New in",
  title: "Pieces for the season",
  items: [
    {
      title: "Beaufort Lambswool Throw",
      body: "€185 · Handwoven in County Kerry · 130 × 180 cm",
      href: "/shop/beaufort-lambswool-throw/",
    },
    {
      title: "Dingle Stoneware Bowl",
      body: "€42 · Wood-fired stoneware · 24 cm diameter",
      href: "/shop/dingle-stoneware-bowl/",
    },
    {
      title: "Aran Wool Poncho",
      body: "€128 · Undyed merino · One size",
      href: "/shop/aran-wool-poncho/",
    },
  ],
};

export const quoteBandFixture: QuoteBandProps = {
  quote:
    "We make in small runs, from fleece we can trace. If a seam gives, send it back and we will mend it.",
  attribution: "Niamh Ó Conaill — Maker, West Cork",
  cta: { label: "Read our story", href: "/our-story/" },
};

export const ctaBandFixture: CtaBandProps = {
  title: "Visit the workshop",
  body: "The shop and mill are open Tuesday to Saturday, 10am to 5pm. Come for the wool; stay for the tea.",
  cta: { label: "Plan your visit", href: "/visit/" },
};

export const statBandFixture: StatBandProps = {
  stats: [
    { value: "1974", label: "Family-run since" },
    { value: "1,200", label: "Blankets woven each year" },
    { value: "48 hr", label: "Delivery across Ireland" },
    { value: "100%", label: "Natural fibres, traceable to source" },
  ],
};

export const fixtures = {
  hero: heroFixture,
  pageHead: pageHeadFixture,
  featureGrid: featureGridFixture,
  quoteBand: quoteBandFixture,
  ctaBand: ctaBandFixture,
  statBand: statBandFixture,
} as const;
