/**
 * The section barrel — default (neutral) implementation.
 *
 * This directory is a materialised copy of templates/_shared/sections/. The
 * compose step for a template overlay replaces it wholesale, so edit the
 * shared source, not these files. The names below are the contract: routes,
 * the styleguide and overlay authors all import
 * `{ Hero, PageHead, FeatureGrid, QuoteBand, CtaBand, StatBand }` from
 * `@/template-sections`.
 *
 * Types are re-exported from `@/lib/section-types`, never from a relative
 * `./types`, because that file only exists in the factory repo. A generated
 * site has no templates/ directory.
 */
export * from "@/lib/section-types";
export * from "./components";
export * from "./fixtures";
