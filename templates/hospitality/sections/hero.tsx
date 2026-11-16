import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import type { HeroProps } from "@/lib/section-types";

/**
 * Hero — the room, photographed.
 *
 * A full-bleed 3:2 frame, a soft scrim, one display line bottom-left and at
 * most one action. `variant` is accepted for contract compatibility but
 * hospitality always composes the full-bleed frame (no split, no carousel).
 * With no photograph the hero falls back to type on paper rather than an empty
 * image slot.
 */
export function Hero({
  eyebrow,
  title,
  lede,
  primaryCta,
  secondaryCta,
  image,
}: HeroProps) {
  // One CTA only. Primary wins; a lone secondary still gets a button.
  const cta = primaryCta ?? secondaryCta;

  if (!image) {
    return (
      <section className="t-hospitality-hero-fallback t-hospitality-section">
        <div className="t-hospitality-wrap">
          <div className="reveal max-w-[46rem]">
            {eyebrow ? (
              <p className="t-hospitality-eyebrow">{eyebrow}</p>
            ) : null}
            <h1 className="t-hospitality-display t-hospitality-hero-title mt-4">
              {title}
            </h1>
            {lede ? (
              <p className="t-hospitality-hero-lede mt-6">{lede}</p>
            ) : null}
            {cta ? (
              <Link href={cta.href} className="t-hospitality-pill t-hospitality-pill-dark mt-8">
                {cta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="t-hospitality-hero">
      <div className="t-hospitality-hero-media">
        <div className="t-hospitality-hero-plate reveal-image">
          <SiteImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
            sizes="100vw"
            aspectClassName="aspect-[3/2] t-hospitality-hero-slot"
            className={`h-full w-full object-cover ${image.className ?? ""}`}
          />
          <div aria-hidden="true" className="t-hospitality-hero-scrim" />
        </div>
        <div className="t-hospitality-hero-copy t-hospitality-wrap">
          {eyebrow ? (
            <p className="t-hospitality-eyebrow t-hospitality-on-image">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="t-hospitality-display t-hospitality-hero-title mt-4">
            {title}
          </h1>
          {lede ? (
            <p className="t-hospitality-hero-lede mt-5">{lede}</p>
          ) : null}
          {cta ? (
            <Link href={cta.href} className="t-hospitality-pill mt-7">
              {cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
