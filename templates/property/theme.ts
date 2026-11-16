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

export const theme = {
  fonts: {
    display: sourceSerif,
    sans: inter,
  },
  fontVariables: themeFontVariables,
  fontClassNames: themeFontClassNames,
} as const;

/** Canonical name the composed layout imports. */
export const fontVariables = themeFontVariables;
