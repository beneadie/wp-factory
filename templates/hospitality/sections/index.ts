import type { Sections } from "@/lib/section-types";
import { Hero } from "./hero";
import { PageHead } from "./page-head";
import { FeatureGrid } from "./feature-grid";
import { QuoteBand } from "./quote-band";
import { CtaBand } from "./cta-band";
import { StatBand } from "./stat-band";

/**
 * The hospitality section set. Same six names, same contract: a page builder
 * that only knows `Sections` can render this template without importing a
 * template-specific type.
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
export type {
  HospitalityDish,
  HospitalityFeatureGridProps,
  HospitalityFeatureItem,
  HospitalityMenuCourse,
} from "./feature-grid";
export type {
  HospitalityCtaBandProps,
  HospitalityHoursRow,
} from "./cta-band";
export * from "./fixtures";
