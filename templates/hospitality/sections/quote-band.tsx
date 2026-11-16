import Link from "next/link";
import type { QuoteBandProps } from "@/lib/section-types";

/**
 * Quote band — one voice, on the inverse roast colour.
 *
 * A large serif mark, the quote at reading size and a rule-led attribution.
 * Left aligned, never a centred paragraph. The optional CTA is a text link,
 * not a second booking button.
 */
export function QuoteBand({ quote, attribution, cta }: QuoteBandProps) {
  return (
    <section className="t-hospitality-quote">
      <div className="t-hospitality-wrap">
        <div className="t-hospitality-quote-grid">
          <div aria-hidden="true" className="t-hospitality-quote-mark">
            “
          </div>
          <figure className="m-0">
            <blockquote className="m-0">
              <p className="t-hospitality-quote-text">{quote}</p>
            </blockquote>
            {attribution ? (
              <figcaption className="t-hospitality-quote-attribution">
                {attribution}
              </figcaption>
            ) : null}
            {cta ? (
              <div className="t-hospitality-quote-cta">
                <Link
                  href={cta.href}
                  className="t-hospitality-textlink t-hospitality-textlink-inverse"
                >
                  {cta.label}
                  <span aria-hidden="true" className="t-hospitality-arrow">
                    →
                  </span>
                </Link>
              </div>
            ) : null}
          </figure>
        </div>
      </div>
    </section>
  );
}
