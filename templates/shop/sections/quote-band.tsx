import Link from "next/link";
import type { ReactElement } from "react";
import type { QuoteBandProps } from "@/lib/section-types";

/**
 * The maker's story on the inverse band.
 *
 * A short hairline, the quote in the display face, and the attribution and one
 * link set low on the right. No quotation-mark decoration, no portrait, no
 * second accent. It is the exhale after the product grid.
 */
export function QuoteBand({
  quote,
  attribution,
  cta,
}: QuoteBandProps): ReactElement {
  return (
    <section className="t-shop-inverse t-shop-section">
      <figure className="t-shop-container grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <span aria-hidden="true" className="t-shop-quote-rule" />
          <blockquote className="t-shop-quote mt-8 max-w-[24ch]">
            <p>{quote}</p>
          </blockquote>
        </div>

        {attribution || cta ? (
          <figcaption className="flex flex-col justify-end lg:col-span-3 lg:col-start-10">
            {attribution ? (
              <p className="t-shop-attribution max-w-[30ch]">{attribution}</p>
            ) : null}
            {cta ? (
              <div className="t-shop-rule-inverse mt-8 pt-6">
                <Link href={cta.href} className="t-shop-linkrow">
                  <span className="t-shop-linklabel">{cta.label}</span>
                  <span className="t-shop-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            ) : null}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
