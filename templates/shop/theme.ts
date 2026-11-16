import { Instrument_Serif, Inter } from "next/font/google";

/**
 * Fonts for the Shop template.
 *
 * The display face is Instrument Serif at its only weight, upright. It carries
 * the collection header, section titles, quotes and figures; it is never
 * italicised and never used below 20px. Inter carries everything else.
 *
 * The CSS variables are the hook theme.css expects:
 *
 *   --font-display: var(--font-instrument-serif), …
 *   --font-sans:    var(--font-inter), …
 *
 * Apply `fontVariables` to <body> (or <html>) so both faces resolve everywhere.
 */

/** CSS variable carrying the sans face. Consumed by --font-sans. */
export const sansVariable = "--font-inter" as const;

/** CSS variable carrying the display face. Consumed by --font-display. */
export const displayVariable = "--font-instrument-serif" as const;

/* next/font requires the `variable` option to be a written literal, so the
   strings below repeat the constants above. Keep them in step. */

export const fontSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const fontDisplay = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** Both variable classes, ready for <body className={…}>. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;
