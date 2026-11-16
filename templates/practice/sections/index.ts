import type { Sections } from "@/lib/section-types";
import { CtaBand } from "./cta-band";
import { FeatureGrid } from "./feature-grid";
import { Hero } from "./hero";
import { PageHead } from "./page-head";
import { QuoteBand } from "./quote-band";
import { StatBand } from "./stat-band";

export * from "@/lib/section-types";
export { CtaBand, FeatureGrid, Hero, PageHead, QuoteBand, StatBand };
export * from "./fixtures";

export const sections: Sections = {
  Hero,
  PageHead,
  FeatureGrid,
  QuoteBand,
  CtaBand,
  StatBand,
};
