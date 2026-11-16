import Link from "next/link";
import type { ReactElement } from "react";
import type { QuoteBandProps } from "@/lib/section-types";

/**
 * One pulled quote on the inverse band. The serif sits upright and large; the
 * attribution and the optional link are quiet furniture underneath it.
 */
export function QuoteBand({
  quote,
  attribution,
  cta,
}: QuoteBandProps): ReactElement {
  return (
    <section className="t-property-quote t-property-on-dark">
      <div className="t-property-container">
        <figure className="t-property-quote-inner">
          <blockquote className="t-property-quote-text">
            <p>{quote}</p>
          </blockquote>

          {attribution || cta ? (
            <figcaption className="t-property-quote-aside">
              {attribution ? (
                <p className="t-property-quote-attribution">{attribution}</p>
              ) : null}
              {cta ? (
                <p className="t-property-quote-cta">
                  <Link
                    className="t-property-link t-property-link-on-dark"
                    href={cta.href}
                  >
                    {cta.label}
                    <span className="t-property-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </p>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
