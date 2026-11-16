/**
 * The trades section barrel.
 *
 * Same six names, same props as the shared contract. The compose step copies
 * this directory over `src/template-sections/`, so imports here must resolve
 * inside a generated site: `@/lib/section-types` and `@/components/site-image`,
 * never a path under `templates/`.
 *
 * `sections` is the machine-readable map a page composer reads. The individual
 * named exports exist because the styleguide and route code import them
 * directly.
 */
import type { Sections } from "@/lib/section-types";
import { CtaBand } from "./cta-band";
import { FeatureGrid } from "./feature-grid";
import { Hero } from "./hero";
import { PageHead } from "./page-head";
import { QuoteBand } from "./quote-band";
import { StatBand } from "./stat-band";

export * from "@/lib/section-types";
export * from "./fixtures";
export { CtaBand, FeatureGrid, Hero, PageHead, QuoteBand, StatBand };
export type {
  FeatureGridEvidence,
  FeatureGridExtras,
} from "./feature-grid";

export const sections: Sections = {
  Hero,
  PageHead,
  FeatureGrid,
  QuoteBand,
  CtaBand,
  StatBand,
};
