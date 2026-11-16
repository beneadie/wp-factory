import { SiteImage } from "@/components/site-image";
import type { HeroProps } from "@/lib/section-types";

/**
 * Demo schedule for the next-available card. An adapter replaces these values
 * with the client's real next appointment; the card is presentational and has
 * no fetching or client state.
 */
const NEXT_AVAILABLE = {
  iso: "2026-11-16",
  short: "Mon 16 Nov",
  long: "Monday 16 November",
  note: "Two times left on Monday",
  times: ["08:40", "11:20"],
} as const;

type HeroActionProps = {
  primaryCta?: HeroProps["primaryCta"];
  secondaryCta?: HeroProps["secondaryCta"];
  align?: "start" | "center";
  inverse?: boolean;
};

function HeroActions({
  primaryCta,
  secondaryCta,
  align = "start",
  inverse = false,
}: HeroActionProps) {
  if (!primaryCta && !secondaryCta) return null;

  const rowClass =
    align === "center"
      ? "mt-9 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-7"
      : "mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7";

  return (
    <div className={rowClass}>
      {primaryCta ? (
        <a
          href={primaryCta.href}
          className={`t-appointment-btn ${
            inverse
              ? "t-appointment-btn--inverse-solid"
              : "t-appointment-btn--primary"
          } w-full sm:w-auto`}
        >
          {primaryCta.label}
        </a>
      ) : null}

      {secondaryCta ? (
        <a
          href={secondaryCta.href}
          className={`t-appointment-call ${
            inverse ? "t-appointment-call--inverse" : ""
          }`}
        >
          <span className="t-appointment-call__lead">or</span>
          <span>{secondaryCta.label}</span>
        </a>
      ) : null}
    </div>
  );
}

function NextAvailableCard({ cta }: { cta?: HeroProps["primaryCta"] }) {
  const bookHref = cta?.href ?? "#timetable";

  return (
    <aside
      className="t-appointment-card reveal max-w-[28rem] lg:max-w-none"
      aria-label="Next available appointment"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="t-appointment-eyebrow">Next available</p>
        <p className="t-appointment-status">
          <span className="t-appointment-dot" aria-hidden="true" />
          Taking bookings
        </p>
      </div>

      <p className="t-appointment-display t-appointment-card-date t-appointment-num mt-6">
        <time dateTime={NEXT_AVAILABLE.iso}>{NEXT_AVAILABLE.short}</time>
      </p>
      <p className="t-appointment-card-meta mt-2">{NEXT_AVAILABLE.note}</p>

      <div className="t-appointment-rule my-6" aria-hidden="true" />

      <p className="t-appointment-eyebrow">Choose a time</p>
      <div
        className="mt-3 grid grid-cols-2 gap-3"
        role="group"
        aria-label={`Available times on ${NEXT_AVAILABLE.long}`}
      >
        {NEXT_AVAILABLE.times.map((time) => (
          <a
            key={time}
            href={bookHref}
            className="t-appointment-chip"
            aria-label={`Book ${NEXT_AVAILABLE.long} at ${time}`}
          >
            {time}
          </a>
        ))}
      </div>

      {cta ? (
        <a
          href={cta.href}
          className="t-appointment-btn t-appointment-btn--accent mt-4 w-full"
        >
          {cta.label}
        </a>
      ) : null}

      <div className="t-appointment-rule my-5" aria-hidden="true" />

      <a href="#timetable" className="t-appointment-card-link">
        See the full week
        <span aria-hidden="true">→</span>
      </a>
    </aside>
  );
}

/**
 * Three compositions share one API:
 *
 * - `split` (default) is the appointment signature: six parts copy, four parts
 *   next-available card. No photograph is required; the card is the visual.
 *   If an image is supplied it lands below the split as a 21:9 band.
 * - `centered` is copy only: no card and no image, for statement pages.
 * - `full` puts the copy on the inverse field, over a supplied image. Without
 *   an image it is a plain inverse band, so the variant never breaks.
 */
export function Hero({
  eyebrow,
  title,
  lede,
  primaryCta,
  secondaryCta,
  image,
  variant = "split",
}: HeroProps) {
  if (variant === "centered") {
    return (
      <section className="t-appointment border-b border-border">
        <div className="t-appointment-shell">
          <div className="reveal mx-auto max-w-[46rem] py-16 text-center lg:py-24">
            {eyebrow ? (
              <p className="t-appointment-eyebrow">{eyebrow}</p>
            ) : null}

            <h1 className="t-appointment-display t-appointment-h1 mt-5 text-text">
              {title}
            </h1>

            {lede ? (
              <p className="t-appointment-lede mx-auto mt-6">{lede}</p>
            ) : null}

            <HeroActions
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
              align="center"
            />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "full") {
    return (
      <section className="t-appointment-hero-full">
        {image ? (
          <>
            <div className="t-appointment-hero-media">
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
            <div className="t-appointment-hero-scrim" aria-hidden="true" />
          </>
        ) : null}

        <div className="t-appointment-shell">
          <div className="t-appointment-hero-copy reveal">
            {eyebrow ? (
              <p className="t-appointment-eyebrow t-appointment-eyebrow--inverse">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="t-appointment-display t-appointment-h1 mt-5">
              {title}
            </h1>

            {lede ? (
              <p className="t-appointment-lede t-appointment-lede--inverse mt-6">
                {lede}
              </p>
            ) : null}

            <HeroActions
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
              inverse
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="t-appointment border-b border-border">
      <div className="t-appointment-shell">
        <div className="grid items-start gap-12 pb-14 pt-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="reveal max-w-[36rem]">
            {eyebrow ? (
              <p className="t-appointment-eyebrow">{eyebrow}</p>
            ) : null}

            <h1 className="t-appointment-display t-appointment-h1 mt-5 text-text">
              {title}
            </h1>

            {lede ? <p className="t-appointment-lede mt-6">{lede}</p> : null}

            <HeroActions
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
            />
          </div>

          <NextAvailableCard cta={primaryCta} />
        </div>

        {image ? (
          <div className="reveal border-t border-border pb-14 pt-8">
            <SiteImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              aspectClassName="aspect-[21/9]"
              className={`h-full w-full object-cover ${image.className ?? ""}`}
              sizes="(min-width: 1180px) 1180px, 100vw"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
