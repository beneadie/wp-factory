import Link from "next/link";
import type { ReactElement } from "react";
import type { QuoteBandProps } from "@/lib/section-types";

/**
 * The single dark moment: one pulled quote, left-aligned, 28–44px serif, an
 * 11px letter-spaced attribution, and an optional text link. No quotation-mark
 * ornament, no italic display, no centring. The top hairline is the inverse
 * equivalent of the page rule.
 */
export function QuoteBand({
  quote,
  attribution,
  cta,
}: QuoteBandProps): ReactElement {
  return (
    <section className="t-community-inverse">
      <div className="t-community-container t-community-section">
        <figure className="t-community-quote-inner reveal">
          <blockquote className="t-community-quote-text">
            <p>“{quote}”</p>
          </blockquote>
          {attribution ? (
            <figcaption className="t-community-quote-attribution">
              {attribution}
            </figcaption>
          ) : null}
          {cta ? (
            <div className="t-community-quote-cta">
              <Link href={cta.href} className="t-community-link-inverse">
                <span>{cta.label}</span>
                <span aria-hidden="true" className="t-community-arrow">
                  →
                </span>
              </Link>
            </div>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
