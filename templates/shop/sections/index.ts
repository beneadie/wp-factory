import type { Sections } from "@/lib/section-types";
import { CtaBand } from "./cta-band";
import { FeatureGrid } from "./feature-grid";
import { Hero } from "./hero";
import { PageHead } from "./page-head";
import { QuoteBand } from "./quote-band";
import { StatBand } from "./stat-band";

/**
 * The Shop overlay barrel.
 *
 * The base barrel exports the six components, their prop types and the
 * `*Fixture` set; the styleguide and local previews import all three. Keep
 * those exports so this directory can replace the base without breaking them,
 * and add the composed `sections` map the overlay contract requires.
 */

export * from "@/lib/section-types";
export * from "./fixtures";
export { CtaBand, FeatureGrid, Hero, PageHead, QuoteBand, StatBand };

export const sections: Sections = {
  Hero,
  PageHead,
  FeatureGrid,
  QuoteBand,
  CtaBand,
  StatBand,
};
