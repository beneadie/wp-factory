import Link from "next/link";
import type { ReactElement } from "react";
import type { CtaBandProps } from "@/lib/section-types";

/**
 * The dark closing band: a booking statement on the left, the reason and one
 * accent action on the right. Used directly under the listing grid.
 */
export function CtaBand({
  title,
  body,
  cta,
}: CtaBandProps): ReactElement {
  return (
    <section className="t-property-cta t-property-on-dark">
      <div className="t-property-container">
        <div className="t-property-cta-inner">
          <h2 className="t-property-display t-property-cta-title reveal">
            {title}
          </h2>
          <div className="t-property-cta-aside">
            {body ? <p className="t-property-cta-body">{body}</p> : null}
            <Link className="t-property-btn" href={cta.href}>
              {cta.label}
              <span className="t-property-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
