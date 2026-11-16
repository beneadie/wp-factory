import type { ReactElement } from "react";
import type { StatBandProps } from "@/lib/section-types";

/**
 * Four quiet proofs. Hairline above each figure, display numerals, a plain
 * label. No boxes, no counters, no animation: the facts are the ornament.
 */
export function StatBand({ stats }: StatBandProps): ReactElement {
  return (
    <section className="t-shop-section border-t border-border bg-bg">
      <div className="t-shop-container">
        <ul className="t-shop-stats">
          {stats.map((stat, index) => (
            <li
              key={`${stat.label}-${index}`}
              className="border-t border-border pt-5"
            >
              <p className="t-shop-statvalue">{stat.value}</p>
              <p className="t-shop-statlabel mt-2">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
