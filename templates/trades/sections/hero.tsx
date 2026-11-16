import Link from "next/link";
import type { ReactElement } from "react";
import { SiteImage } from "@/components/site-image";
import type { Cta, HeroProps } from "@/lib/section-types";

/**
 * Trades hero.
 *
 * The photograph is the field, not a card: a 16:9 job shot runs edge to edge,
 * a layered bottom-left scrim carries the copy, and the composition stays
 * left-aligned at every width. An adapter supplies the client's own job photo.
 *
 * The `variant` prop is accepted for the shared contract. This template always
 * composes the full-bleed, left-aligned treatment; when no image is supplied
 * the same layout becomes a plain inverse field rather than an empty slot.
 *
 * Below 640px the inline quote button is replaced by the fixed quote/call bar
 * at the bottom of the viewport, padded for the device safe area.
 */

function Action({
  cta,
  kind,
  className = "",
}: {
  cta: Cta;
  kind: "primary" | "call";
  className?: string;
}): ReactElement {
  if (kind === "call") {
    const callClass = `t-trades-call t-trades-call--inverse ${className}`;
    return cta.href.startsWith("tel:") ? (
      <a href={cta.href} className={callClass}>
        {cta.label}
      </a>
    ) : (
      <Link href={cta.href} className={callClass}>
        {cta.label}
      </Link>
    );
  }

  const buttonClass = `t-trades-btn t-trades-btn--inverse ${className}`;
  return cta.href.startsWith("tel:") ? (
    <a href={cta.href} className={buttonClass}>
      {cta.label}
    </a>
  ) : (
    <Link href={cta.href} className={buttonClass}>
      {cta.label}
    </Link>
  );
}

function MobileBar({
  primaryCta,
  secondaryCta,
}: {
  primaryCta?: Cta;
  secondaryCta?: Cta;
}): ReactElement | null {
  if (!primaryCta && !secondaryCta) return null;

  return (
    <div className="t-trades-mobilebar" role="region" aria-label="Quick contact">
      {primaryCta ? (
        primaryCta.href.startsWith("tel:") ? (
          <a
            href={primaryCta.href}
            className="t-trades-btn t-trades-btn--primary"
          >
            {primaryCta.label}
          </a>
        ) : (
          <Link
            href={primaryCta.href}
            className="t-trades-btn t-trades-btn--primary"
          >
            {primaryCta.label}
          </Link>
        )
      ) : null}

      {secondaryCta ? (
        secondaryCta.href.startsWith("tel:") ? (
          <a href={secondaryCta.href} className="t-trades-mobilebar__call">
            {secondaryCta.label}
          </a>
        ) : (
          <Link href={secondaryCta.href} className="t-trades-mobilebar__call">
            {secondaryCta.label}
          </Link>
        )
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
}: HeroProps): ReactElement {
  return (
    <>
      <section className="t-trades-hero">
        {image ? (
          <div className="absolute inset-0">
            <SiteImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              sizes="100vw"
              aspectClassName="aspect-[16/9] h-full w-full"
              className={`h-full w-full object-cover ${image.className ?? ""}`}
            />
          </div>
        ) : null}

        <div
          className="t-trades-hero-scrim absolute inset-0"
          aria-hidden="true"
        />

        <div className="t-trades-shell t-trades-hero-inner">
          <div className="t-trades-hero-copy">
            {eyebrow ? <p className="t-trades-eyebrow">{eyebrow}</p> : null}

            <h1 className="t-trades-display t-trades-h1 t-trades-hero-title">
              {title}
            </h1>

            {lede ? (
              <p className="t-trades-lede t-trades-lede--inverse t-trades-hero-lede">
                {lede}
              </p>
            ) : null}

            {primaryCta || secondaryCta ? (
              <div className="t-trades-hero-actions">
                {primaryCta ? (
                  <Action
                    cta={primaryCta}
                    kind="primary"
                    className="t-trades-hero-primary"
                  />
                ) : null}
                {secondaryCta ? <Action cta={secondaryCta} kind="call" /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <MobileBar primaryCta={primaryCta} secondaryCta={secondaryCta} />
    </>
  );
}
