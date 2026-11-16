/**
 * The section contract.
 *
 * Every site template ships six section components that share these prop
 * types. The types are presentational only: no fetch, no client state, no
 * WordPress types leaking through. A template overlay imports them from
 * `@/lib/section-types` — never from `templates/`, which does not exist inside
 * a generated site.
 *
 * Overlays may change values and markup. They may not rename these exports,
 * widen a prop or add a required one.
 */

import type { ComponentType } from "react";

/** A link or a call to action: a label and an href. */
export type Cta = { label: string; href: string };

/**
 * Structural twin of {@link Cta} for navigation-ish link rows (PageHead).
 * Same shape on purpose; the name tells the reader what the link is for.
 */
export type SectionLink = { label: string; href: string };

/** An image slot. Dimensions are required so the slot reserves its ratio. */
export interface SectionImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * The hero. `variant` picks the composition, not the content:
 * - `split`    text left, image right (default)
 * - `full`     image as the field, copy on top of it
 * - `centered` copy only, centred, no image
 */
export interface HeroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  image?: SectionImage;
  variant?: "split" | "full" | "centered";
}

/**
 * The thin-page archetype: a page that has a title, maybe a tagline and a row
 * of links, and no body copy. It must look intentional with no image and no
 * paragraphs — big type, a hairline rule, generous air.
 */
export interface PageHeadProps {
  eyebrow?: string;
  title: string;
  tagline?: string;
  links?: SectionLink[];
}

/** A grid of short items. `href` makes the whole item a link. */
export interface FeatureGridProps {
  eyebrow?: string;
  title?: string;
  items: { title: string; body: string; href?: string }[];
}

/** A single pulled quote, on an inverse band, with an optional CTA. */
export interface QuoteBandProps {
  quote: string;
  attribution?: string;
  cta?: Cta;
}

/** The closing band: a title, optional body, one CTA. */
export interface CtaBandProps {
  title: string;
  body?: string;
  cta: Cta;
}

/** Three or four figures that prove something. Values are pre-formatted. */
export interface StatBandProps {
  stats: { value: string; label: string }[];
}

/** The six components every template must provide. */
export interface Sections {
  Hero: ComponentType<HeroProps>;
  PageHead: ComponentType<PageHeadProps>;
  FeatureGrid: ComponentType<FeatureGridProps>;
  QuoteBand: ComponentType<QuoteBandProps>;
  CtaBand: ComponentType<CtaBandProps>;
  StatBand: ComponentType<StatBandProps>;
}
