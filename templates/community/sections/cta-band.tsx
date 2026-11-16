import Link from "next/link";
import type { ReactElement } from "react";
import type { CtaBandProps } from "@/lib/section-types";

/**
 * The donate / join close. Inverse band, one accent control, the title at
 * 44–56px and the body at a 48ch measure. It is the second place the donation
 * path appears, and the only filled control on the dark surface.
 */
export function CtaBand({ title, body, cta }: CtaBandProps): ReactElement {
  return (
    <section className="t-community-inverse">
      <div className="t-community-container t-community-section">
        <div className="t-community-cta-inner reveal">
          <div>
            <h2 className="t-community-cta-title">{title}</h2>
            {body ? (
              <p className="t-community-body t-community-cta-body t-community-inverse-muted">
                {body}
              </p>
            ) : null}
          </div>

          <div className="t-community-cta-actions">
            <Link href={cta.href} className="t-community-btn">
              <span>{cta.label}</span>
              <span aria-hidden="true" className="t-community-arrow">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
