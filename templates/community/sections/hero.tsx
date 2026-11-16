import Link from "next/link";
import type { ReactElement } from "react";
import { SiteImage } from "@/components/site-image";
import type { HeroProps } from "@/lib/section-types";

/**
 * The community hero: 5/7, headline left, one accent action and one text link,
 * then a 3:2 photograph of real people with a small caption. Nothing is set
 * over the photograph.
 *
 * `centered` is honoured as a copy-only composition. `full` is accepted but
 * composed as the split: this template never lays text over an image, so a
 * full-bleed overlay would be a different template's hero rather than a
 * quiet reinterpretation of this one.
 */
export function Hero({
  eyebrow,
  title,
  lede,
  primaryCta,
  secondaryCta,
  image,
  variant = "split",
}: HeroProps): ReactElement {
  const copy = (
    <>
      {eyebrow ? <p className="t-community-eyebrow">{eyebrow}</p> : null}
      <h1 className="t-community-display t-community-hero-title">{title}</h1>
      {lede ? <p className="t-community-lede t-community-hero-lede">{lede}</p> : null}
      {primaryCta || secondaryCta ? (
        <div className="t-community-hero-actions">
          {primaryCta ? (
            <Link href={primaryCta.href} className="t-community-btn">
              <span>{primaryCta.label}</span>
              <span aria-hidden="true" className="t-community-arrow">
                →
              </span>
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="t-community-link">
              <span>{secondaryCta.label}</span>
              <span aria-hidden="true" className="t-community-arrow">
                →
              </span>
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );

  if (variant === "centered") {
    return (
      <section className="t-community-section">
        <div className="t-community-container">
          <div className="t-community-hero-centered">{copy}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="t-community-section">
      <div className="t-community-container">
        <div
          className="t-community-hero-grid"
          data-has-image={image ? "true" : "false"}
        >
          <div className="t-community-hero-copy">{copy}</div>

          {image ? (
            <figure className="t-community-hero-figure">
              <div className="t-community-photo">
                <SiteImage
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  aspectClassName="aspect-[3/2]"
                  className={`h-full w-full object-cover ${image.className ?? ""}`}
                />
              </div>
              <figcaption className="t-community-caption">{image.alt}</figcaption>
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}
