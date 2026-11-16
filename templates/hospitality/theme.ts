import { Inter, Newsreader } from "next/font/google";

/**
 * Font wiring for the hospitality overlay.
 *
 * Newsreader carries every display line: hero, page head, section titles,
 * dish names and the pull quote. Inter does body, eyebrows, hours and the
 * tabular price column. Two families, no third.
 *
 * The display variable is `--font-newsreader`; theme.css points
 * `--font-display` at it, so replacing this file's display family is enough to
 * change every heading and menu line at once. No italic and no script face is
 * loaded, by design.
 *
 * Apply `fontVariables` to <body>:
 *
 *   <body className={`${fontVariables} …`}>
 */
export const sansVariable = "--font-inter" as const;

export const displayVariable = "--font-newsreader" as const;

export const fontSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const fontDisplay = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-newsreader",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** Both variable classes, ready for <body className={…}>. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;
