import { Inter, Gelasio } from "next/font/google";

/**
 * Fonts for the design system.
 *
 * The variables are the hook a template uses to swap the display family: the
 * token --font-display in tokens.css starts with var(--font-gelasio), so
 * pointing a different next/font at that variable (or overriding
 * --font-display directly in theme.css) changes every heading, section title
 * and prose h1/h2 at once.
 *
 * Both faces are server-rendered by next/font: no layout shift, no external
 * request from the browser. `display: "swap"` keeps first paint fast.
 *
 * Apply `fontVariables` to <body>:
 *
 *   <body className={`${fontVariables} flex min-h-dvh flex-col`}>
 */

/** CSS variable carrying the sans face. Consumed by --font-sans. */
export const sansVariable = "--font-inter" as const;

/** CSS variable carrying the display face. Consumed by --font-display. */
export const displayVariable = "--font-gelasio" as const;

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

export const fontDisplay = Gelasio({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-gelasio",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** Both variable classes, ready for <body className={…}>. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;
