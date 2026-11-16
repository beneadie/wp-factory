import { Inter } from "next/font/google";

/**
 * Trades type: one family, two jobs.
 *
 * Inter carries both display and body so the site reads like a working
 * document, not a brochure. Display is set to 700 with -0.03em tracking in
 * theme.css (`.t-trades-display`); body stays at 400/500.
 *
 * One Inter instance is loaded on purpose. Using two next/font instances for
 * the same family would create two CSS variables and could leave 400-weight
 * body text resolving to a 700-only file. `display` and `sans` are aliases so
 * an adapter can wire either name without loading the family twice.
 *
 * Apply `themeClassName` to <html> or <body>:
 *
 *   <body className={`${themeClassName} …`}>
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

/** Body and UI face. */
export const sans = inter;

/** Display face. Same family and file as `sans`; weight comes from CSS. */
export const display = inter;

/** Both roles point at the one variable that theme.css consumes. */
export const themeClassName = inter.variable;

/** Aliases matching the neutral template's font module. */
export const fontSans = inter;
export const fontDisplay = inter;
export const fontVariables = inter.variable;
export const sansVariable = "--font-inter" as const;
export const displayVariable = "--font-inter" as const;
