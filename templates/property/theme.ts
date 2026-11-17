import { Inter, Gelasio } from "next/font/google";

/**
 * Property type wiring.
 *
 * Gelasio is the display face: addresses, page titles, prices' companion
 * headings. Inter carries labels, body copy, buttons and the figures. Both are
 * loaded here as CSS variables so theme.css never names a webfont itself.
 *
 * Apply `themeFontVariables` to <html> or <body>:
 *
 *   <body className={`${themeFontVariables} …`}>
 */
export const sourceSerif = Gelasio({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-gelasio",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
  preload: true,
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  adjustFontFallback: true,
  preload: true,
});

/** Both variable class names, for the root <html> element. */
export const themeFontVariables = `${sourceSerif.variable} ${inter.variable}`;

export const themeFontClassNames = {
  display: sourceSerif.className,
  sans: inter.className,
  variables: themeFontVariables,
} as const;

/** Font choices for adapters that want the families, not just the CSS vars. */
export const themeFonts = {
  fonts: {
    display: sourceSerif,
    sans: inter,
  },
  fontVariables: themeFontVariables,
  fontClassNames: themeFontClassNames,
} as const;

/** Canonical name the composed layout imports. */
export const fontVariables = themeFontVariables;

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
  name: "property",
  displayFace: "serif",
  heroVariant: "full",
  bandedSections: false,
  proseMeasure: "standard",
};

export default theme;
