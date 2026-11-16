"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * Route transition at the app-template level. Pages never add their own
 * entrance animation on top of this.
 *
 * The first paint is never animated: `hasNavigated` is false on the initial
 * mount, so hero/LCP content is painted at its final state. A client navigation
 * mounts a new template instance, which animates once. Reduced motion skips
 * even that.
 */
let hasNavigated = false;

export default function RouteTransition({
  children,
}: {
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const [animate] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  if (!animate || reducedMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
