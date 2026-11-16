"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * One reveal primitive for the whole site.
 *
 * Server components opt in with the existing preset classes `.reveal` and
 * `.reveal-image`, or with a `data-reveal` attribute. This observer owns the
 * timing, the stagger and the reduced-motion path; the CSS only styles the two
 * states (`src/styles/motion.css`).
 *
 * Guarantees:
 *  - No JavaScript -> `reveal-ready` is never added -> everything is visible.
 *  - prefers-reduced-motion -> we return before arming -> everything visible.
 *  - First viewport -> elements in or above the viewport are revealed in the
 *    same synchronous pass, *before* `reveal-ready` is added. The gate is armed
 *    afterwards, so the LCP region can never paint at opacity 0 / clip 100%.
 *  - Client navigation / streaming -> a mutation observer plus a pathname
 *    effect re-scan new nodes on the next frame (one scan per frame).
 *
 * Stagger: `--reveal-delay` is a step count. Set it inline
 * (`style={{ "--reveal-delay": index }}`) or as `data-reveal-delay={index}`,
 * which is copied onto the inline custom property so CSS owns the timing.
 */
const SELECTOR = ".reveal, .reveal-image, [data-reveal]";
const CLIPPED_SELECTOR = '.reveal-image, [data-reveal="image"]';
const READY_CLASS = "reveal-ready";
const REVEALED_CLASS = "is-revealed";

/** Elements that must never be gated, e.g. a possible LCP hero image. */
const OPT_OUT = '.no-reveal, [data-reveal="instant"]';

function pending(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
    (element) =>
      !element.classList.contains(REVEALED_CLASS) &&
      !element.matches(OPT_OUT),
  );
}

function applyStagger(element: HTMLElement) {
  if (element.style.getPropertyValue("--reveal-delay").trim()) return;
  const delay = element.dataset.revealDelay?.trim();
  if (delay) element.style.setProperty("--reveal-delay", delay);
}

/**
 * A target fully hidden by its own `clip-path` reports a zero-area intersection
 * rectangle in Chromium, so an IntersectionObserver entry for it never becomes
 * `isIntersecting`. Watch the nearest ancestor that actually has a box instead;
 * when that ancestor enters, the clipped element wipes in. Falls back to the
 * element itself when nothing up the tree has layout.
 */
function clipSafeTarget(element: HTMLElement): HTMLElement {
  let node = element.parentElement;
  while (node) {
    const rect = node.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return node;
    node = node.parentElement;
  }
  return element;
}

export function RevealObserver() {
  const pathname = usePathname();
  const scanRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown: (() => void) | null = null;

    const arm = () => {
      /** observer target -> elements waiting on it (a clipped image may share
       *  its parent with a sibling reveal). */
      const groups = new WeakMap<Element, HTMLElement[]>();
      const watchedBy = new WeakMap<HTMLElement, Element>();

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer.unobserve(entry.target);
            const group = groups.get(entry.target) ?? [];
            groups.delete(entry.target);
            for (const element of group) {
              element.classList.add(REVEALED_CLASS);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );

      const observe = (element: HTMLElement) => {
        const target = element.matches(CLIPPED_SELECTOR)
          ? clipSafeTarget(element)
          : element;

        watchedBy.set(element, target);

        const group = groups.get(target);
        if (group) {
          if (!group.includes(element)) group.push(element);
          return;
        }

        groups.set(target, [element]);
        observer.observe(target);
      };

      const settle = (element: HTMLElement) => {
        const target = watchedBy.get(element);
        if (!target) return;
        const group = groups.get(target);
        if (!group) return;
        if (group.every((item) => item.classList.contains(REVEALED_CLASS))) {
          observer.unobserve(target);
          groups.delete(target);
        }
      };

      const reveal = (element: HTMLElement, instant: boolean) => {
        if (!instant) {
          element.classList.add(REVEALED_CLASS);
          settle(element);
          return;
        }

        // The gate is already armed (client navigation, a streamed node, a
        // late mutation). Suppress the transition for the one frame in which
        // `is-revealed` lands so above-the-fold content paints at its final
        // state instead of fading in from opacity 0.
        const previousTransition = element.style.transition;
        const previousDelay = element.style.transitionDelay;
        element.style.transition = "none";
        element.style.transitionDelay = "0ms";
        element.classList.add(REVEALED_CLASS);
        settle(element);
        window.requestAnimationFrame(() => {
          element.style.transition = previousTransition;
          element.style.transitionDelay = previousDelay;
        });
      };

      const scan = () => {
        const viewportHeight = window.innerHeight;
        const armed = root.classList.contains(READY_CLASS);

        for (const element of pending()) {
          applyStagger(element);
          // Above the viewport (negative top) and inside it both count.
          if (element.getBoundingClientRect().top < viewportHeight) {
            reveal(element, armed);
          } else {
            observe(element);
          }
        }
      };

      scanRef.current = scan;

      // Pass 1: reveal everything in the first viewport while the page is
      // still ungated. This happens before `reveal-ready` exists, so there is
      // no frame in which above-the-fold content is hidden.
      scan();

      // Pass 2: only now may CSS hide what is still below the fold.
      root.classList.add(READY_CLASS);

      let frame = 0;
      const schedule = () => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          scan();
        });
      };

      // Streaming and client navigation add nodes after mount. Observe the
      // DOM, not scroll: the IntersectionObserver already handles scrolling.
      const mutations = new MutationObserver(schedule);
      mutations.observe(document.body, { childList: true, subtree: true });

      return () => {
        scanRef.current = null;
        if (frame) window.cancelAnimationFrame(frame);
        observer.disconnect();
        mutations.disconnect();
        root.classList.remove(READY_CLASS);
      };
    };

    const sync = () => {
      teardown?.();
      teardown = null;
      // Reduced motion: never arm the gate, which leaves the no-JS stylesheet
      // path in charge — everything fully visible, no transitions.
      if (!media.matches) teardown = arm();
    };

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);

  // The observer lives in the root layout, so a client navigation does not
  // unmount it. New route markup is already committed by the time this effect
  // runs; scanning here closes the gap before the mutation observer's frame.
  useEffect(() => {
    scanRef.current?.();
  }, [pathname]);

  return null;
}
