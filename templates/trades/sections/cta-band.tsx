import Link from "next/link";
import type { ReactElement } from "react";
import type { Cta, CtaBandProps } from "@/lib/section-types";

/**
 * Closing band.
 *
 * Surface tone, a heavy display title on the left and a hairline-ruled action
 * column on the right. The button is the only filled primary action outside
 * the hero; photograph or illustration is deliberately absent so the phone
 * number (or quote route) is the last thing read.
 */
function CtaAction({ cta }: { cta: Cta }): ReactElement {
  const content = (
    <>
      {cta.label}
      <span className="t-trades-btn__arrow" aria-hidden="true">
        →
      </span>
    </>
  );

  if (cta.href.startsWith("tel:")) {
    return (
      <a
        href={cta.href}
        className="t-trades-btn t-trades-btn--primary t-trades-num"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={cta.href}
      className="t-trades-btn t-trades-btn--primary t-trades-num"
    >
      {content}
    </Link>
  );
}

export function CtaBand({ title, body, cta }: CtaBandProps): ReactElement {
  return (
    <section className="t-trades-section t-trades-cta">
      <div className="t-trades-shell">
        <div className="t-trades-cta__inner">
          <h2 className="t-trades-display t-trades-h2 t-trades-cta__title">
            {title}
          </h2>

          <div className="t-trades-cta__side">
            {body ? <p className="t-trades-cta__body">{body}</p> : null}
            <div className="t-trades-cta__action">
              <CtaAction cta={cta} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
