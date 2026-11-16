import type { StatBandProps } from "@/lib/section-types";

/**
 * Three or four figures on a white band, separated by hairlines only.
 * Values keep tabular numerals so the columns stay steady.
 */
export function StatBand({ stats }: StatBandProps) {
  const isFour = stats.length === 4;

  return (
    <section className="t-appointment t-appointment-section t-appointment-section--tight border-y border-border bg-surface">
      <div className="t-appointment-shell">
        <dl
          className={`t-appointment-stats reveal ${
            isFour ? "t-appointment-stats--four" : ""
          }`}
        >
          {stats.map((stat) => (
            <div key={`${stat.label}-${stat.value}`} className="t-appointment-stat">
              <dt className="t-appointment-stat-label">{stat.label}</dt>
              <dd className="t-appointment-stat-value t-appointment-num">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
