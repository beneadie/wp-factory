import Link from "next/link";
import type { ReactElement } from "react";
import type { QuoteBandProps } from "@/lib/section-types";

/**
 * One voice, set large in Instrument Serif roman on the inverse band. The
 * quote sits in columns 4–12; the attribution and the optional link occupy
 * the quiet left margin, which keeps the band from reading as a centred
 * testimonial card.
 */
export function QuoteBand({
  quote,
  attribution,
  cta,
}: QuoteBandProps): ReactElement {
  return (
    <section className="t-portfolio-inverse">
      <div className="t-portfolio-shell t-portfolio-band">
        <p className="t-portfolio-chrome t-portfolio-muted">On commission</p>

        <div className="mt-12 grid gap-10 md:mt-20 lg:grid-cols-12 lg:items-end lg:gap-10">
          <figure className="lg:col-span-9 lg:col-start-4 lg:row-start-1">
            <blockquote className="t-portfolio-display t-portfolio-quote reveal">
              <p>“{quote}”</p>
            </blockquote>
            {attribution ? (
              <figcaption className="t-portfolio-caption mt-8">
                {attribution}
              </figcaption>
            ) : null}
          </figure>

          {cta ? (
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:pb-1">
              <Link
                href={cta.href}
                className="t-portfolio-chrome t-portfolio-textlink t-portfolio-textlink-inverse"
              >
                {cta.label}
                <span aria-hidden="true" className="t-portfolio-arrow">
                  →
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
