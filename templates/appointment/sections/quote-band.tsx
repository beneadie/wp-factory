import type { QuoteBandProps } from "@/lib/section-types";

/**
 * One pulled quote on the inverse band. Quiet: a hairline, the display face
 * and nothing decorative. The CTA is optional and only appears when supplied.
 */
export function QuoteBand({ quote, attribution, cta }: QuoteBandProps) {
  return (
    <section className="t-appointment t-appointment-section t-appointment-band-inverse">
      <div className="t-appointment-shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-3">
            <p className="t-appointment-eyebrow t-appointment-eyebrow--inverse">
              In their words
            </p>
            <div
              className="t-appointment-accent-rule mt-6"
              aria-hidden="true"
            />
          </div>

          <figure className="reveal m-0 lg:col-span-8 lg:col-start-5">
            <blockquote className="m-0">
              <p className="t-appointment-quote">{quote}</p>
            </blockquote>

            {attribution || cta ? (
              <figcaption className="t-appointment-quote-foot mt-9 flex flex-wrap items-center justify-between gap-6 pt-6">
                {attribution ? (
                  <cite className="t-appointment-cite">{attribution}</cite>
                ) : null}

                {cta ? (
                  <a
                    href={cta.href}
                    className="t-appointment-btn t-appointment-btn--inverse"
                  >
                    {cta.label}
                  </a>
                ) : null}
              </figcaption>
            ) : null}
          </figure>
        </div>
      </div>
    </section>
  );
}
