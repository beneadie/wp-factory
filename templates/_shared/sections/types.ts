/**
 * Canonical section prop types.
 *
 * Thin re-export so this directory reads as a complete contract. The source of
 * truth is template/src/lib/section-types.ts, which is the path every overlay
 * imports from (`@/lib/section-types`). This file is never compiled: it exists
 * only in the factory repo, never in a generated site.
 */
export * from "../../../template/src/lib/section-types";
