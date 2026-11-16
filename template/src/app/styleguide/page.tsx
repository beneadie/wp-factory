import type { Metadata } from "next";

/**
 * Reachable alias for the styleguide.
 *
 * Next.js treats any route segment starting with `_` as a private folder, so
 * `src/app/__styleguide/page.tsx` compiles but is never served. The implementation
 * lives there (it is the path the design system documents); this three-line
 * file makes it openable at /styleguide.
 *
 * Both routes are guarded: production returns 404 unless STYLEGUIDE=1.
 */
export { default } from "../__styleguide/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};
