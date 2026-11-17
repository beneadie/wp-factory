import Link from "next/link";
import type { QuoteBandProps } from "@/lib/section-types";

/**
 * The single dark band. A serif quote at display scale, left-aligned, with the
 * attribution and optional link set in a narrow second column. No quotation
 * mark decoration, no italic.
 */
export function QuoteBand({ quote, attribution, cta }: QuoteBandProps) {
  return (
    <section className="t-practice-quote t-practice-on-inverse">
      <div className="t-practice-container">
        <figure className="t-practice-quote-inner reveal">
          <blockquote className="t-practice-quote-body">
            <p className="t-practice-quote-text">{quote}</p>
          </blockquote>

          {attribution || cta ? (
            <figcaption className="t-practice-quote-aside">
              <span className="t-practice-quote-label">Client story</span>
              {attribution ? (
                <cite className="t-practice-quote-attribution">
                  {attribution}
                </cite>
              ) : null}
              {cta ? (
                <p className="t-practice-quote-cta">
                  <Link href={cta.href} className="t-practice-link">
                    {cta.label}
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
