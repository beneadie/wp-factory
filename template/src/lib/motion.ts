/**
 * The JS side of the motion scale declared in src/styles/tokens.css.
 *
 * These values must stay identical to the CSS custom properties. The reveal
 * layer (src/styles/motion.css) and any preset that later reaches for
 * `motion/react` share one easing family and one set of durations — do not add
 * a curve or a duration here that is not also a token.
 *
 * CSS                         JS
 * --ease-out                  EASE_OUT
 * --ease-in-out               EASE_IN_OUT
 * --duration-micro            140ms  -> DURATION.micro
 * --duration-fast             240ms  -> DURATION.fast
 * --duration-base             420ms  -> DURATION.base
 * --duration-slow             700ms  -> DURATION.slow
 * --duration-ambient          8s     -> DURATION.ambient
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Seconds, because `motion` takes seconds. */
export const DURATION = {
  micro: 0.14,
  fast: 0.24,
  base: 0.42,
  slow: 0.7,
  ambient: 8,
} as const;
