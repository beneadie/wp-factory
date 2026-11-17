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
  name: "hospitality",
  displayFace: "serif",
  heroVariant: "full",
  bandedSections: false,
  proseMeasure: "standard",
};

export default theme;
