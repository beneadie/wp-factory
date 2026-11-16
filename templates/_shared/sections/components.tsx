import Link from "next/link";
import type { ReactElement } from "react";
import { SiteImage } from "@/components/site-image";
import type {
  CtaBandProps,
  Cta,
  FeatureGridProps,
  HeroProps,
  PageHeadProps,
  QuoteBandProps,
  StatBandProps,
} from "@/lib/section-types";

/**
 * The six default sections.
 *
 * Presentational only: no fetching, no client state, no WordPress types. Every
 * one is a server component. A template overlay replaces this directory with
 * its own versions — same names, same props, different design — and may import
 * whatever it likes from `@/components` and `@/lib`.
 *
 * Colours, type and radius come from the token layer via Tailwind classes
 * (bg-bg, text-text, font-display, text-4xl, rounded-lg …). No raw values.
 */

function CtaLink({
  cta,
  kind = "primary",
}: {
  cta: Cta;
  kind?: "primary" | "outline" | "inverse" | "inverse-outline";
}): ReactElement {
  const className =
    kind === "primary"
      ? "btn-primary"
      : kind === "outline"
        ? "btn-outline"
        : kind === "inverse"
          ? "btn-inverse"
          : "btn-outline-inverse";
  return (
    <Link href={cta.href} className={className}>
      {cta.label}
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
      <div className="mt-10 flex flex-wrap items-center gap-3">
        {primaryCta ? <CtaLink cta={primaryCta} /> : null}
        {secondaryCta ? <CtaLink cta={secondaryCta} kind="outline" /> : null}
      </div>
    ) : null;

  if (variant === "centered") {
    return (
      <section className="bg-bg">
        <div className="container-page py-20 text-center md:py-28">
          <div className="mx-auto max-w-measure">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="mt-5 font-display text-5xl leading-display tracking-[-0.02em] text-text">
              {title}
            </h1>
            {lede ? (
              <p className="mx-auto mt-6 max-w-measure text-lg leading-body text-muted">
                {lede}
              </p>
            ) : null}
            {actions ? <div className="flex justify-center">{actions}</div> : null}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "full" && image) {
    return (
      <section className="relative isolate overflow-hidden bg-inverse-bg text-inverse-text">
        <div className="absolute inset-0 -z-10">
          <SiteImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
            sizes="100vw"
            aspectClassName="h-full w-full"
            className={`h-full w-full object-cover ${image.className ?? ""}`}
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-inverse-bg/70" />
        <div className="container-page py-24 md:py-36">
          <div className="max-w-measure">
            {eyebrow ? (
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-inverse-text/70">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-5 font-display text-5xl leading-display tracking-[-0.02em]">
              {title}
            </h1>
            {lede ? (
              <p className="mt-6 max-w-measure text-lg leading-body text-inverse-text/80">
                {lede}
              </p>
            ) : null}
            {primaryCta || secondaryCta ? (
              <div className="mt-10 flex flex-wrap items-center gap-3">
                {primaryCta ? <CtaLink cta={primaryCta} kind="inverse" /> : null}
                {secondaryCta ? <CtaLink cta={secondaryCta} kind="inverse-outline" /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg">
      <div className="container-page grid items-center gap-12 py-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16 md:py-24">
        <div className="max-w-measure">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="mt-5 font-display text-5xl leading-display tracking-[-0.02em] text-text">
            {title}
          </h1>
          {lede ? <p className="mt-6 text-lg leading-body text-muted">{lede}</p> : null}
          {actions}
        </div>
        {image ? (
          <div className="overflow-hidden rounded-lg">
            <SiteImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              aspectClassName="aspect-[4/3]"
              className={image.className ?? ""}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function PageHead({ eyebrow, title, tagline, links }: PageHeadProps): ReactElement {
  return (
    <header className="border-b border-border bg-bg">
      <div className="container-page py-16 md:py-24">
        <div className="max-w-measure">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="mt-5 font-display text-5xl leading-display tracking-[-0.02em] text-text">
            {title}
          </h1>
          {tagline ? (
            <p className="mt-6 max-w-measure text-lg leading-body text-muted">{tagline}</p>
          ) : null}
        </div>
        {links && links.length > 0 ? (
          <nav
            aria-label="On this page"
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-sm text-muted hover:text-text"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}

export function FeatureGrid({ eyebrow, title, items }: FeatureGridProps): ReactElement {
  return (
    <section className="bg-surface">
      <div className="container-page py-16 md:py-24">
        {eyebrow || title ? (
          <div className="max-w-measure">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className="mt-4 font-display text-3xl leading-display tracking-[-0.01em] text-text">
                {title}
              </h2>
            ) : null}
          </div>
        ) : null}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="bg-elevated p-8">
              <h3 className="text-xl font-medium leading-tight text-text">
                {item.href ? (
                  <Link href={item.href} className="link-underline">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </h3>
              <p className="mt-3 text-sm leading-body text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function QuoteBand({ quote, attribution, cta }: QuoteBandProps): ReactElement {
  return (
    <section className="bg-inverse-bg text-inverse-text">
      <div className="container-page py-16 md:py-24">
        <figure className="mx-auto max-w-measure text-center">
          <blockquote className="font-display text-3xl leading-tight tracking-[-0.01em]">
            <p>{quote}</p>
          </blockquote>
          {attribution ? (
            <figcaption className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-inverse-text/70">
              {attribution}
            </figcaption>
          ) : null}
          {cta ? (
            <div className="mt-10 flex justify-center">
              <CtaLink cta={cta} kind="inverse" />
            </div>
          ) : null}
        </figure>
      </div>
    </section>
  );
}

export function CtaBand({ title, body, cta }: CtaBandProps): ReactElement {
  return (
    <section className="border-t border-border bg-elevated">
      <div className="container-page flex flex-col items-start gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
        <div className="max-w-measure">
          <h2 className="font-display text-4xl leading-display tracking-[-0.01em] text-text">
            {title}
          </h2>
          {body ? <p className="mt-4 text-lg leading-body text-muted">{body}</p> : null}
        </div>
        <div className="shrink-0">
          <CtaLink cta={cta} />
        </div>
      </div>
    </section>
  );
}

export function StatBand({ stats }: StatBandProps): ReactElement {
  return (
    <section className="bg-bg">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-t border-border pt-6">
            <p className="font-display text-4xl leading-none tabular-nums text-text">
              {stat.value}
            </p>
            <p className="mt-3 text-sm leading-body text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
