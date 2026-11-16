/**
 * The portfolio section barrel.
 *
 * Same six exports as every template: routes and the styleguide import
 * `sections` (or the individual components) from `@/template-sections`. Types
 * come from `@/lib/section-types`, never from a relative ./types, because a
 * generated site has no templates/ directory.
 *
 * The fixtures are re-exported so the styleguide and local development can
 * render the full portfolio without WordPress. They are copy, not data.
 */
import type { Sections } from "@/lib/section-types";
import { CtaBand } from "./cta-band";
import { FeatureGrid } from "./feature-grid";
import { Hero } from "./hero";
import { PageHead } from "./page-head";
import { QuoteBand } from "./quote-band";
import { StatBand } from "./stat-band";

export * from "@/lib/section-types";
export { CtaBand } from "./cta-band";
export { FeatureGrid } from "./feature-grid";
export { Hero } from "./hero";
export { PageHead } from "./page-head";
export { QuoteBand } from "./quote-band";
export { StatBand } from "./stat-band";
export * from "./fixtures";

export const sections: Sections = {
  Hero,
  PageHead,
  FeatureGrid,
  QuoteBand,
  CtaBand,
  StatBand,
};
