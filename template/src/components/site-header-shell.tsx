"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sticky header with hysteresis: it shrinks only after 120px and expands again
 * only below 40px, so a page resting near a threshold cannot flicker.
 *
 * The scroll listener is passive and coalesced into one rAF frame; it reads
 * `window.scrollY` only, so it never forces layout. The visual state lives in
 * `data-scrolled` and is styled in src/styles/motion.css. Height changes are
 * instantaneous on purpose: animating height/padding is layout animation.
 *
 * The header markup and its links stay in src/app/layout.tsx (server
 * component); this wrapper only owns the interaction.
 */
const SHRINK_AT = 120;
const EXPAND_AT = 40;

export function SiteHeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    let scrolled = false;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;

      if (!scrolled && y > SHRINK_AT) {
        scrolled = true;
        element.dataset.scrolled = "true";
      } else if (scrolled && y < EXPAND_AT) {
        scrolled = false;
        element.dataset.scrolled = "false";
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} data-scrolled="false" className="site-header-shell">
      {children}
    </div>
  );
}
