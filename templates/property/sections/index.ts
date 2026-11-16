import type { Sections } from "@/lib/section-types";
import { Hero } from "./hero";
import { PageHead } from "./page-head";
import { FeatureGrid } from "./feature-grid";
import { QuoteBand } from "./quote-band";
import { CtaBand } from "./cta-band";
import { StatBand } from "./stat-band";

/**
 * The property section barrel.
 *
 * The exported `sections` object is the contract the page builder reads. The
 * named exports keep the styleguide and fixture imports working exactly as
 * they do for the neutral base.
 */
export const sections: Sections = {
  Hero,
  PageHead,
  FeatureGrid,
  QuoteBand,
  CtaBand,
  StatBand,
};

export { Hero, PageHead, FeatureGrid, QuoteBand, CtaBand, StatBand };
export * from "@/lib/section-types";
export * from "./fixtures";
