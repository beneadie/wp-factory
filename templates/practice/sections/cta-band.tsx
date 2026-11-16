import Link from "next/link";
import type { CtaBandProps } from "@/lib/section-types";

/**
 * The closing band. Ruled above and below, an oversized serif statement on the
 * left and the single filled control on the right. No background wash.
 */
export function CtaBand({ title, body, cta }: CtaBandProps) {
  return (
    <section className="t-practice-cta">
      <div className="t-practice-container">
        <div className="t-practice-cta-inner reveal">
          <h2 className="t-practice-display t-practice-cta-title">{title}</h2>
          <div className="t-practice-cta-copy">
            {body ? <p className="t-practice-cta-body">{body}</p> : null}
            <div className="t-practice-cta-actions">
              <Link href={cta.href} className="t-practice-btn">
                <span>{cta.label}</span>
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      className="t-practice-arrow"
      viewBox="0 0 14 10"
      width="14"
      height="10"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 5h12.5M9 1l4 4-4 4" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
