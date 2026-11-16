import Link from "next/link";
import type { ReactElement } from "react";
import { SiteImage } from "@/components/site-image";
import type { Cta, HeroProps } from "@/lib/section-types";

/**
 * The collection header.
 *
 * One very large serif line on the left, then an asymmetric pair of images
 * below it: a 4:5 whole and a 1:1 detail, the detail dropped 48px. There is no
 * full-bleed hero photograph — the pairing is the composition.
 *
 * A single image prop is supplied by the contract. The pair is the same
 * photograph seen whole and close, so the two crops always agree; a build agent
 * can replace the detail with a second product shot when it wires real media.
 */

function TextLink({ cta, muted = false }: { cta: Cta; muted?: boolean }) {
  return (
    <Link
      href={cta.href}
      className={muted ? "t-shop-textlink t-shop-textlink--muted" : "t-shop-textlink"}
    >
      {cta.label}
      <span className="t-shop-arrow" aria-hidden="true">
        →
      </span>
    </Link>
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
  const actions =
    primaryCta || secondaryCta ? (
      <>
        {primaryCta ? <TextLink cta={primaryCta} /> : null}
        {secondaryCta ? <TextLink cta={secondaryCta} muted /> : null}
      </>
    ) : null;

  if (variant === "centered") {
    return (
      <section className="t-shop-hero">
        <div className="t-shop-container">
          <div className="mx-auto max-w-[900px] text-center">
            {eyebrow ? <p className="t-shop-eyebrow">{eyebrow}</p> : null}
            <h1 className="t-shop-display reveal mx-auto mt-8 max-w-[16ch]">{title}</h1>
            {lede ? <p className="t-shop-lede mx-auto mt-6 max-w-[46ch]">{lede}</p> : null}
            {actions ? (
              <div className="mt-8 flex flex-col items-center gap-4">{actions}</div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="t-shop-hero">
      <div className="t-shop-container">
        {eyebrow ? (
          <div className="flex items-center gap-5">
            <p className="t-shop-eyebrow">{eyebrow}</p>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
          </div>
        ) : null}

        <div className="t-shop-hero-head mt-7 md:mt-9">
          <h1 className="t-shop-display reveal max-w-[13ch]">{title}</h1>
          {lede ? (
            <p className="t-shop-lede t-shop-hero-standfirst max-w-[40ch]">
              {lede}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            {actions}
          </div>
        ) : null}

        {image ? (
          <div className="t-shop-hero-pair mt-12 md:mt-16">
            <figure className="t-shop-hero-figure reveal-image">
              <SiteImage
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority
                sizes="(min-width: 1024px) 46vw, 62vw"
                aspectClassName="aspect-[4/5]"
                className={`h-full w-full object-cover ${image.className ?? ""}`}
              />
            </figure>

            <figure className="t-shop-hero-figure t-shop-hero-detail reveal-image">
              <SiteImage
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 27vw, 34vw"
                aspectClassName="aspect-square"
                className="h-full w-full scale-150 object-cover object-[74%_26%]"
              />
            </figure>
          </div>
        ) : null}
      </div>
    </section>
  );
}
