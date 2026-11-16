import type { ReactElement } from "react";
import type { StatBandProps } from "@/lib/section-types";

/**
 * Four figures, ruled top and bottom, in the display face with tabular
 * numerals. Values arrive pre-formatted, so the band never guesses a suffix.
 */
export function StatBand({ stats }: StatBandProps): ReactElement {
  return (
    <section className="t-property-stat">
      <div className="t-property-container">
        <dl className="t-property-stat-inner">
          {stats.map((stat) => (
            <div key={stat.label} className="t-property-stat-cell">
              <dt className="t-property-stat-label">{stat.label}</dt>
              <dd className="t-property-stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
