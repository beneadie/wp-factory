import Link from "next/link";
import type { HeroProps } from "@/lib/section-types";
import { SiteImage } from "@/components/site-image";

/**
 * The practice hero is designed as a 7/5 split: serif statement and lede on the
 * left, a 4:5 photograph on the right, with a hairline above the eyebrow. The
 * contract's `full` and `centered` variants are supported for composition
 * parity, but `heroVariant` in theme.ts is `split` and this template never
 * centres a headline in its own pages.
 *
 * Extra optional props (documented in design.md):
 * - imageCaption: the small caption under the portrait/building photograph.
 * - imagePriority: mark the hero image as the LCP image (default true).
 */
export type PracticeHeroProps = HeroProps & {
  imageCaption?: string;
  imagePriority?: boolean;
};

export function Hero({
  eyebrow,
  title,
  lede,
  primaryCta,
  secondaryCta,
  image,
  variant = "split",
  imageCaption,
  imagePriority = true,
}: PracticeHeroProps) {
  const actions =
    primaryCta || secondaryCta ? (
      <div className="t-practice-actions">
        {primaryCta ? (
          <Link href={primaryCta.href} className="t-practice-btn">
            <span>{primaryCta.label}</span>
            <Arrow />
          </Link>
        ) : null}
        {secondaryCta ? (
          <Link href={secondaryCta.href} className="t-practice-link">
            {secondaryCta.label}
          </Link>
        ) : null}
      </div>
    ) : null;

  if (variant === "centered") {
    return (
      <section className="t-practice-hero t-practice-hero--centered">
        <div className="t-practice-container">
          <div className="t-practice-hero-centered">
            {eyebrow ? <p className="t-practice-eyebrow">{eyebrow}</p> : null}
            <h1 className="t-practice-display t-practice-hero-title">{title}</h1>
            {lede ? <p className="t-practice-lede">{lede}</p> : null}
            {actions}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "full" && image) {
    return (
      <section className="t-practice-hero t-practice-hero--full t-practice-on-inverse">
        <div className="t-practice-hero-full-media">
          <SiteImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={imagePriority}
            sizes="100vw"
            aspectClassName="aspect-[16/9] h-full w-full"
            className={`h-full w-full object-cover ${image.className ?? ""}`}
          />
        </div>
        <div className="t-practice-hero-full-scrim" aria-hidden="true" />
        <div className="t-practice-hero-full-inner">
          <div className="t-practice-container">
            <div className="t-practice-hero-full-copy">
              {eyebrow ? <p className="t-practice-eyebrow">{eyebrow}</p> : null}
              <h1 className="t-practice-display t-practice-hero-title">
                {title}
              </h1>
              {lede ? <p className="t-practice-lede">{lede}</p> : null}
              {actions}
              {imageCaption ? (
                <p className="t-practice-caption t-practice-hero-full-caption">
                  {imageCaption}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="t-practice-hero">
      <div className="t-practice-container">
        <div
          className="t-practice-hero-grid"
          data-has-image={image ? "true" : "false"}
        >
          <div className="t-practice-hero-copy">
            {eyebrow ? <p className="t-practice-eyebrow">{eyebrow}</p> : null}
            <h1 className="t-practice-display t-practice-hero-title">{title}</h1>
            {lede ? <p className="t-practice-lede">{lede}</p> : null}
            {actions}
          </div>

          {image ? (
            <figure className="t-practice-hero-figure">
              <SiteImage
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority={imagePriority}
                sizes="(min-width: 1024px) 38vw, 100vw"
                aspectClassName="aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5]"
                className={`h-full w-full object-cover ${image.className ?? ""}`}
              />
              {imageCaption ? (
                <figcaption className="t-practice-caption">
                  {imageCaption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      className="t-practice-arrow"
      viewBox="0 0 14 10"
      width="14"
      height="10"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 5h12.5M9 1l4 4-4 4" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
