"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const SAFETY_MS = 12_000;
const SETTLE_MS = 220;

function isTrackableAnchor(anchor: HTMLAnchorElement, event: MouseEvent): boolean {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const rawHref = anchor.getAttribute("href");
  // In-page anchors are not navigations.
  if (!rawHref || rawHref.startsWith("#")) return false;

  const url = new URL(anchor.href, window.location.href);
  // External, mailto:, tel:, data: and friends are not client navigations.
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.origin !== window.location.origin) return false;

  // Same document (including hash-only links) is not a navigation.
  if (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  ) {
    return false;
  }

  return true;
}

/**
 * Navigation progress for every client navigation, including query-only
 * changes (pagination, search) that never remount a route segment and therefore
 * never show a route-level loading boundary.
 *
 * The element carries `data-navigation-pending` because this *is* the pending
 * indicator: the old full-page `NavigationPending` overlay was removed so the
 * app ships one signal, not two. Decorative, hence aria-hidden — pending state
 * is announced by the link that was activated.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);

  const activeRef = useRef(false);
  const safetyTimer = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (safetyTimer.current !== null) {
      window.clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
    if (settleTimer.current !== null) {
      window.clearTimeout(settleTimer.current);
      settleTimer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimers();
    activeRef.current = true;
    setActive(true);
    setDone(false);
    safetyTimer.current = window.setTimeout(() => {
      activeRef.current = false;
      setActive(false);
      setDone(false);
    }, SAFETY_MS);
  }, [clearTimers]);

  const finish = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    clearTimers();
    setDone(true);
    settleTimer.current = window.setTimeout(() => {
      setActive(false);
      setDone(false);
    }, SETTLE_MS);
  }, [clearTimers]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (isTrackableAnchor(anchor, event)) start();
    };

    const onPopState = () => start();

    const onSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      // Search is a GET navigation; its feedback is this bar. POST forms go
      // through a BFF route handler and are not client navigations.
      if (form.method.toLowerCase() === "get") start();
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  }, [start, clearTimers]);

  const locationKey = `${pathname}?${searchParams.toString()}`;
  const previousKey = useRef(locationKey);

  useEffect(() => {
    if (previousKey.current === locationKey) return;
    previousKey.current = locationKey;
    finish();
  }, [locationKey, finish]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!active) return null;

  return (
    <div
      className="route-progress"
      data-navigation-pending
      data-route-progress
      data-done={done ? "true" : "false"}
      aria-hidden="true"
    >
      <div className="route-progress-bar" />
    </div>
  );
}
