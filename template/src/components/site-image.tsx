"use client";

/* eslint-disable @next/next/no-img-element -- WordPress supplies the responsive
   srcset; this component owns the placeholder/retry contract instead of
   next/image. */

import { useEffect, useRef, useState } from "react";

interface SiteImageProps {
  src: string;
  alt: string;
  className?: string;
  /** True only for the single LCP image in the viewport. */
  priority?: boolean;
  sizes?: string;
  srcSet?: string;
  /** "pattern" (default) or "none". Brand art can be layered with placeholderClassName. */
  placeholder?: "pattern" | "none";
  /** Per-client placeholder art, e.g. a mascot class. Never hardcode it here. */
  placeholderClassName?: string;
  /** Keep the placeholder up this long so it does not flash on cache hits. */
  minVisibleMs?: number;
  /** Reserve the slot, e.g. "aspect-[4/5]". Prevents layout shift. */
  aspectClassName?: string;
  width?: number;
  height?: number;
}

/**
 * The image slot contract: a visible placeholder (never a blank or transparent
 * slot), a slot that reserves its aspect ratio, the LCP image never hidden, one
 * retry on error, and a reduced-motion-safe placeholder.
 */
export function SiteImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes,
  srcSet,
  placeholder = "pattern",
  placeholderClassName = "",
  minVisibleMs = 800,
  aspectClassName = "",
  width,
  height,
}: SiteImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(placeholder !== "none");
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const mountedAt = useRef(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    if (placeholder === "none") return;
    const elapsed = Date.now() - mountedAt.current;
    const wait = Math.max(0, minVisibleMs - elapsed);
    window.setTimeout(() => setShowPlaceholder(false), wait);
  };

  /* A cached image can finish before React hydrates, and then `onLoad` never
     fires: the img stays at opacity 0 under the placeholder until some later
     re-render. Check `complete` once after mount and after each retry. */
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete || img.naturalWidth === 0) return;
    setLoaded(true);
    if (placeholder === "none") return;
    const elapsed = Date.now() - mountedAt.current;
    window.setTimeout(
      () => setShowPlaceholder(false),
      Math.max(0, minVisibleMs - elapsed),
    );
  }, [attempt, placeholder, minVisibleMs]);

  const handleError = () => {
    if (attempt === 0) {
      setAttempt(1);
      return;
    }
    setFailed(true);
    setShowPlaceholder(false);
  };

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt || "Image unavailable"}
        className={`flex items-center justify-center bg-surface text-xs text-muted ${aspectClassName} ${className}`}
      >
        <span aria-hidden="true">Image unavailable</span>
      </span>
    );
  }

  return (
    <span
      data-image-slot
      className={`relative block overflow-hidden bg-surface ${aspectClassName}`}
    >
      {showPlaceholder ? (
        <span
          data-image-placeholder
          aria-hidden="true"
          className={`image-placeholder absolute inset-0 ${
            placeholderClassName || "image-placeholder-pattern"
          }`}
        />
      ) : null}
      <img
        ref={imgRef}
        key={attempt}
        src={attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=1`}
        srcSet={attempt === 0 ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`relative ${className} ${
          priority ? "" : loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-700`}
      />
    </span>
  );
}
