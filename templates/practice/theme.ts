import { Inter, Source_Serif_4 } from "next/font/google";

/**
 * Practice — typography and the non-CSS theme decisions.
 *
 * Source Serif 4 carries every heading and Inter the UI. Both are loaded here
 * (next/font, self-hosted, `display: swap`) and exposed as CSS variables, so
 * theme.css only ever names `var(--font-display)` / `var(--font-sans)`.
 *
 * Load Source Serif 4 in this module rather than relying on the substrate's
 * default: the shared `@/lib/fonts` loads Gelasio as `--font-gelasio`, so a
 * preset whose theme.css asks for `var(--font-source-serif, "Source Serif 4")`
 * without defining it falls back to Georgia (or DejaVu Serif on Linux) and the
 * page quietly loses the face the design was drawn around.
 */
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-source-serif",
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

/** The class names that put both faces on <body>. */
export const themeFontVariables = `${sourceSerif.variable} ${inter.variable}`;

/** Canonical name the composed layout imports. */
export const fontVariables = themeFontVariables;

export const themeFontClassNames = {
  display: sourceSerif.className,
  sans: inter.className,
  variables: themeFontVariables,
} as const;

export const fontDisplay = sourceSerif;
export const fontSans = inter;

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

const theme: TemplateTheme = {
  name: "practice",
  displayFace: "serif",
  heroVariant: "split",
  bandedSections: false,
  proseMeasure: "standard",
};

export default theme;

export { theme };
