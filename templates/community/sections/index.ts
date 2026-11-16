import type { Sections } from "@/lib/section-types";
import { CtaBand } from "./cta-band";
import { FeatureGrid } from "./feature-grid";
import { Hero } from "./hero";
import { PageHead } from "./page-head";
import { QuoteBand } from "./quote-band";
import { StatBand } from "./stat-band";

/**
 * The only file other code imports. Names are the contract; the props come
 * from @/lib/section-types and are re-exported here for convenience.
 */
export const sections: Sections = {
  Hero,
  PageHead,
  FeatureGrid,
  QuoteBand,
  CtaBand,
  StatBand,
};

export { CtaBand, FeatureGrid, Hero, PageHead, QuoteBand, StatBand };
export * from "@/lib/section-types";
export * from "./fixtures";
