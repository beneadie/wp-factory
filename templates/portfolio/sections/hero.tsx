import Link from "next/link";
import type { ReactElement } from "react";
import { SiteImage } from "@/components/site-image";
import type { HeroProps } from "@/lib/section-types";

/**
 * The hero is a photograph first. `full` is the portfolio composition: a
 * full-bleed 16:9 tile, a small chrome eyebrow over it and one line of title
 * bottom-left. That tile carries `priority` and no reveal class, so the LCP
 * image paints final on the first frame.
 *
 * `split` is the quieter editorial variant for inner landing pages; `centered`
 * is used when there is no photograph at all.
 */

function Actions({
  primaryCta,
  secondaryCta,
}: Pick<HeroProps, "primaryCta" | "secondaryCta">): ReactElement | null {
  if (!primaryCta && !secondaryCta) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
      {primaryCta ? (
        <Link
          href={primaryCta.href}
          className="t-portfolio-chrome t-portfolio-textlink"
        >
          {primaryCta.label}
          <span aria-hidden="true" className="t-portfolio-arrow">
            →
          </span>
        </Link>
      ) : null}
      {secondaryCta ? (
        <Link
          href={secondaryCta.href}
          className="t-portfolio-chrome t-portfolio-textlink"
        >
          {secondaryCta.label}
          <span aria-hidden="true" className="t-portfolio-arrow">
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}

export function Hero({
  eyebrow,
  title,
  lede,
  primaryCta,
  secondaryCta,
  image,
  variant = "split",
}: HeroProps): ReactElement {
  if (variant === "full" && image) {
    return (
      <section className="bg-bg">
        <div className="t-portfolio-media relative isolate">
          <SiteImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
            sizes="100vw"
            aspectClassName="t-portfolio-ratio-16-9"
            className={image.className ?? ""}
          />
          <div
            aria-hidden="true"
            className="t-portfolio-hero-scrim absolute inset-0"
          />
          <div className="t-portfolio-on-image t-portfolio-overlay-inset absolute inset-0 flex flex-col justify-between py-5 md:py-8">
            <div className="flex items-start justify-between gap-6">
              {eyebrow ? (
                <p className="t-portfolio-chrome">{eyebrow}</p>
              ) : (
                <span aria-hidden="true" />
              )}
              <p className="t-portfolio-chrome t-portfolio-on-image-muted">
                01
              </p>
            </div>
            <h1 className="t-portfolio-display t-portfolio-hero-title max-w-3xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="t-portfolio-shell flex flex-col gap-5 py-5 md:flex-row md:items-baseline md:justify-between md:gap-16 md:py-7">
          {lede ? (
            <p className="t-portfolio-body max-w-xl text-muted">{lede}</p>
          ) : (
            <span aria-hidden="true" />
          )}
          <Actions primaryCta={primaryCta} secondaryCta={secondaryCta} />
        </div>
      </section>
    );
  }

  if (variant === "split" && image) {
    return (
      <section className="bg-bg">
        <div className="t-portfolio-shell grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            {eyebrow ? (
              <p className="t-portfolio-chrome text-muted">{eyebrow}</p>
            ) : null}
            <h1 className="t-portfolio-display t-portfolio-page-title mt-6">
              {title}
            </h1>
            {lede ? (
              <p className="t-portfolio-body mt-6 max-w-md text-muted">
                {lede}
              </p>
            ) : null}
            <div className="mt-8">
              <Actions
                primaryCta={primaryCta}
                secondaryCta={secondaryCta}
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="t-portfolio-media">
              <SiteImage
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                aspectClassName="t-portfolio-ratio-4-3"
                className={image.className ?? ""}
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-6">
              <p className="t-portfolio-chrome t-portfolio-index">01</p>
              <p className="t-portfolio-chrome text-muted">Featured</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg">
      <div className="t-portfolio-shell t-portfolio-band-bottom pt-12 md:pt-16">
        <div className="flex items-start justify-between gap-6">
          {eyebrow ? (
            <p className="t-portfolio-chrome text-muted">{eyebrow}</p>
          ) : (
            <span aria-hidden="true" />
          )}
          <p className="t-portfolio-chrome t-portfolio-index">01</p>
        </div>

        <h1 className="t-portfolio-display t-portfolio-page-title t-portfolio-text mt-14 md:mt-24">
          {title}
        </h1>

        {lede ? (
          <p className="t-portfolio-body t-portfolio-text mt-8 text-muted">
            {lede}
          </p>
        ) : null}

        <div className="mt-10">
          <Actions primaryCta={primaryCta} secondaryCta={secondaryCta} />
        </div>

        <div className="mt-16 h-px w-full bg-border md:mt-20" />
      </div>
    </section>
  );
}
