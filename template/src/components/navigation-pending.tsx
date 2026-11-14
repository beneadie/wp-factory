"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DELAY_MS = 120;
const SAFETY_MS = 10_000;

function isTrackableAnchor(anchor: HTMLAnchorElement, event: MouseEvent): boolean {
  // Synthetic events are not navigations.
  if (!event.isTrusted) return false;
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const rawHref = anchor.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#")) return false;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  return url.pathname !== window.location.pathname ||
    url.search !== window.location.search;
}

/**
 * Page-level pending state. A route `loading.tsx` would flush the HTTP shell and
 * break real 404s, so this renders a skeleton overlay from the client after a
 * short delay, and clears it when the route commits. Without it the content area
 * sits blank while the server responds.
 */
export function NavigationPending() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    setPending(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor || !isTrackableAnchor(anchor, event)) return;
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setPending(true), DELAY_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!pending) return;
    const safety = window.setTimeout(() => setPending(false), SAFETY_MS);
    return () => window.clearTimeout(safety);
  }, [pending]);

  if (!pending) return null;

  return (
    <div
      data-navigation-pending
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-40 bg-bg/85 backdrop-blur-[1px]"
    >
      <span className="sr-only">Loading page</span>
      <div className="container-page py-16" aria-hidden="true">
        <div className="h-3 w-24 animate-pulse rounded bg-border" />
        <div className="mt-6 h-10 w-2/3 animate-pulse rounded bg-border" />
        <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-border/70" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded bg-border/60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
