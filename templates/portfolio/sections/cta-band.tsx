import Link from "next/link";
import type { ReactElement } from "react";
import type { CtaBandProps } from "@/lib/section-types";

/**
 * The closing band is an editorial spread, not a button panel: a large
 * Instrument Serif line on the left, the one paragraph and the one rule-link
 * on the right, both sitting on the baseline of the page.
 */
export function CtaBand({
  title,
  body,
  cta,
}: CtaBandProps): ReactElement {
  return (
    <section className="border-t border-border bg-bg">
      <div className="t-portfolio-shell t-portfolio-band grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-8">
          <p className="t-portfolio-chrome text-muted">Enquiries</p>
          <h2 className="t-portfolio-display t-portfolio-band-title reveal mt-8 md:mt-12">
            {title}
          </h2>
        </div>

        <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-end">
          {body ? (
            <p className="t-portfolio-body max-w-lg text-muted">{body}</p>
          ) : null}
          <Link
            href={cta.href}
            className="t-portfolio-chrome t-portfolio-textlink mt-8 self-start"
          >
            {cta.label}
            <span aria-hidden="true" className="t-portfolio-arrow">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
