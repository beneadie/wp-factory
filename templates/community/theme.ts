import { Public_Sans, Gelasio } from "next/font/google";

/**
 * Community type wiring.
 *
 * Gelasio carries every display line — hero, page head, section titles,
 * card headings, CTA and the dates in the notice strip. Public Sans does body,
 * eyebrows, captions, labels and buttons. Two families, no third, no italic
 * display face.
 *
 * Apply `fontVariables` (or `themeFontVariables`) to <html> or <body>:
 *
 *   <body className={`${fontVariables} flex min-h-dvh flex-col`}>
 *
 * theme.css points --font-display and --font-sans at these two variables, so
 * swapping a family here changes every heading and body line at once.
 */

export const sansVariable = "--font-public-sans" as const;
export const displayVariable = "--font-gelasio" as const;

export const fontSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-public-sans",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  adjustFontFallback: true,
});

export const fontDisplay = Gelasio({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-gelasio",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

/** Both variable classes, ready for <body className={…}>. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;

/** Alias used by the other overlays' layouts. */
export const themeFontVariables = fontVariables;

export const themeFontClassNames = {
  display: fontDisplay.className,
  sans: fontSans.className,
  variables: fontVariables,
} as const;

/**
 * The non-CSS decisions the substrate reads. Mirrors the TemplateTheme
 * contract; do not add fields here.
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
  name: "community",
  displayFace: "serif",
  heroVariant: "split",
  bandedSections: false,
  proseMeasure: "standard",
};

export default theme;
