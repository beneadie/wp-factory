import Link from "next/link";
import type { ReactElement } from "react";
import type { Cta, QuoteBandProps } from "@/lib/section-types";

/**
 * One customer quote on the inverse band.
 *
 * The quote is set large, left-aligned and tracked tight like the display
 * headings. A short accent rule above it is the only ornament. The optional
 * CTA is a text link rather than a second button, so the closing CtaBand keeps
 * the only heavy action on the page.
 */
function QuoteCta({ cta }: { cta: Cta }): ReactElement {
  const content = (
    <>
      {cta.label}
      <span aria-hidden="true">→</span>
    </>
  );

  if (cta.href.startsWith("tel:")) {
    return (
      <a href={cta.href} className="t-trades-textlink">
        {content}
      </a>
    );
  }

  return (
    <Link href={cta.href} className="t-trades-textlink">
      {content}
    </Link>
  );
}

export function QuoteBand({
  quote,
  attribution,
  cta,
}: QuoteBandProps): ReactElement {
  return (
    <section className="t-trades-inverse t-trades-section">
      <div className="t-trades-shell">
        <div className="t-trades-quote__inner">
          <figure>
            <div className="t-trades-quote__rule" aria-hidden="true" />
            <blockquote className="t-trades-quote__text">
              <p>&ldquo;{quote}&rdquo;</p>
            </blockquote>
            {attribution ? (
              <figcaption className="t-trades-quote__cite">
                &mdash; {attribution}
              </figcaption>
            ) : null}
          </figure>

          {cta ? (
            <div className="t-trades-quote__cta">
              <QuoteCta cta={cta} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
