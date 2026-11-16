import { Instrument_Serif, Inter } from "next/font/google";

/**
 * Non-CSS decisions for the portfolio overlay, plus the two faces that
 * theme.css points its tokens at.
 *
 * `default` is the TemplateTheme the substrate reads. The named font exports
 * are the next/font wiring for this overlay: Inter 500 for 11px chrome, index
 * numerals and 400/16 body; Instrument Serif 400 for display lines, project
 * titles, pull quotes and 13px captions. Roman only, never italic.
 *
 * Apply `fontVariables` to <html> (not only <body>): theme.css declares the
 * face tokens at :root, and those var() references resolve against the
 * next/font variables where they are defined. The design pass may change
 * weights and fallbacks, but not the token names or which face owns which role.
 */

/** Shape owned by the substrate; do not add fields. */
export interface TemplateTheme {
  /** Must equal the templates/<name> directory name. */
  name: string;
  /** Which family drives headings: the serif or the sans. */
  displayFace: "serif" | "sans";
  /** Default hero composition for a page with no explicit variant. */
  heroVariant: "split" | "full" | "centered";
  /** Whether sections alternate bg-bg / bg-surface. */
  bandedSections: boolean;
  /** Prose measure preset; maps to a --prose-measure override. */
  proseMeasure: "narrow" | "standard" | "wide";
}

const templateTheme: TemplateTheme = {
  name: "portfolio",
  displayFace: "serif",
  heroVariant: "full",
  bandedSections: false,
  proseMeasure: "wide",
};

export default templateTheme;

/** CSS variable carrying the sans face. Consumed by --font-sans. */
export const sansVariable = "--font-inter" as const;

/** CSS variable carrying the display face. Consumed by --font-display. */
export const serifVariable = "--font-instrument-serif" as const;

export const fontSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-instrument-serif",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** Aliases used by the base font plumbing. */
export const displayVariable = serifVariable;
export const fontDisplay = fontSerif;

/** Both variable classes, ready for <html className={fontVariables}>. */
export const fontVariables = `${fontSans.variable} ${fontSerif.variable}`;

export const theme = {
  fonts: {
    chrome: fontSans,
    display: fontSerif,
  },
  variables: {
    sans: sansVariable,
    display: serifVariable,
  },
  classNames: fontVariables,
} as const;
