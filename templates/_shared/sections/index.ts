/**
 * The section barrel.
 *
 * A template overlay replaces this whole directory (src/template-sections/).
 * The names below are the contract: the page builder, the styleguide and the
 * overlay authors all import `{ Hero, PageHead, FeatureGrid, QuoteBand, CtaBand,
 * StatBand }` from `@/template-sections`.
 *
 * Types are re-exported from `@/lib/section-types`, never from a relative
 * `./types`, because that file only exists in the factory repo. A generated
 * site has no templates/ directory.
 */
export * from "@/lib/section-types";
export * from "./components";
export * from "./fixtures";
