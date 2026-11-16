import type { ReactElement } from "react";
import type { StatBandProps } from "@/lib/section-types";

/**
 * The signature device: a three-column proof strip.
 *
 * Years trading / response time / areas covered, set as giant tabular
 * numerals separated by hairlines, directly under the hero and nowhere else.
 * It is a plain `<dl>`; CSS puts the value first visually (`order: -1`) while
 * the DOM still reads "Years trading, 25" to assistive tech.
 *
 * Values are pre-formatted and can be any length, but the strip is designed
 * for three short ones. Extra items stay on one row and compress rather than
 * wrapping into a second band.
 */
export function StatBand({ stats }: StatBandProps): ReactElement | null {
  if (stats.length === 0) return null;

  return (
    <section className="t-trades-statband" aria-label="Business at a glance">
      <div className="t-trades-shell">
        <dl className="t-trades-statgrid">
          {stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="t-trades-stat">
              <dt className="t-trades-stat__label">{stat.label}</dt>
              <dd className="t-trades-stat__value t-trades-num">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
