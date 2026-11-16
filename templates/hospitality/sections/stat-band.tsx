import type { StatBandProps } from "@/lib/section-types";

/**
 * Stat band — figures as proof, not decoration.
 *
 * Four rules, four serif numerals, labels in small caps. Values are
 * pre-formatted by the caller and set in tabular figures so a column of
 * numbers lines up.
 */
export function StatBand({ stats }: StatBandProps) {
  return (
    <section className="t-hospitality-stats t-hospitality-section">
      <div className="t-hospitality-wrap">
        <ul className="t-hospitality-stats-grid">
          {stats.map((stat) => (
            <li key={stat.label} className="t-hospitality-stat">
              <p className="t-hospitality-stat-value">{stat.value}</p>
              <p className="t-hospitality-stat-label">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
