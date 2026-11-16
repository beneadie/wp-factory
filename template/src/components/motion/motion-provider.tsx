"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * The JS half of the reduced-motion contract. MotionConfig makes every
 * `motion` component beneath it honour the OS preference; CSS motion is handled
 * by the media queries in src/styles/motion.css. Wrap the app once, in the root
 * layout — never per page.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
