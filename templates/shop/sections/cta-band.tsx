import Link from "next/link";
import type { ReactElement } from "react";
import type { CtaBandProps } from "@/lib/section-types";

/**
 * The closing band: a large title, a short practical line, one pill button.
 * White surface, one top hairline, and enough air that the button feels like an
 * invitation rather than a banner.
 */
export function CtaBand({ title, body, cta }: CtaBandProps): ReactElement {
  return (
    <section className="t-shop-section border-t border-border bg-surface">
      <div className="t-shop-container grid gap-10 lg:grid-cols-12 lg:items-end">
        <h2 className="t-shop-title reveal max-w-[18ch] lg:col-span-7">{title}</h2>

        <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:col-start-9">
          {body ? <p className="t-shop-lede max-w-[42ch]">{body}</p> : null}
          <Link href={cta.href} className="t-shop-button">
            {cta.label}
            <span className="t-shop-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
