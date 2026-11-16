import { Inter, Petrona } from "next/font/google";

/**
 * Appointment type wiring.
 *
 * Petrona carries the display lines — hero, page head, section titles, card
 * date, treatment names, timetable sessions and the quote. Inter does body,
 * eyebrows, prices, times and labels. Two families, no third, no italic
 * display face.
 *
 * Apply `fontVariables` to <body> (or <html>):
 *
 *   <body className={`${fontVariables} …`}>
 *
 * theme.css points --font-display and --font-sans at the two variables below,
 * so swapping a family here changes every heading and body line at once.
 */
export const sansVariable = "--font-inter" as const;
export const displayVariable = "--font-petrona" as const;

export const fontSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  adjustFontFallback: true,
});

export const fontDisplay = Petrona({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-petrona",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

/** Both variable classes, ready for <body className={…}>. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;

/** Alias used by some layouts. */
export const themeFontVariables = fontVariables;

/** Clear aliases for the two families, per the design language. */
export const sans = fontSans;
export const display = fontDisplay;
export const themeClassName = fontVariables;

export const themeFontClassNames = {
  display: fontDisplay.className,
  sans: fontSans.className,
  variables: fontVariables,
} as const;

/**
 * The non-CSS decisions the substrate reads. Mirrors `TemplateTheme` in
 * templates/_shared/CONTRACT.md; do not add fields here.
 */
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

export const theme: TemplateTheme = {
  name: "appointment",
  displayFace: "serif",
  heroVariant: "split",
  bandedSections: false,
  proseMeasure: "standard",
};

export default theme;
