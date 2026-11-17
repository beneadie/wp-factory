import type { StatBandProps } from "@/lib/section-types";

export type HospitalityStatBandProps = StatBandProps & {
  /** Small-caps label above the strip, e.g. "The room in numbers". */
  label?: string;
  /** Right-hand meta, e.g. "Bridge Street · since 2016". */
  note?: string;
};

/**
 * Stat band — figures as proof, not decoration.
 *
 * Four rules, four serif numerals, labels in small caps. Values are
 * pre-formatted by the caller and set in tabular figures so a column of
 * numbers lines up. The optional label row gives the strip a masthead instead
 * of letting four figures float on the page.
 */
export function StatBand({ stats, label, note }: HospitalityStatBandProps) {
  return (
    <section className="t-hospitality-stats t-hospitality-section">
      <div className="t-hospitality-wrap">
        {label || note ? (
          <div className="t-hospitality-stats-head">
            {label ? <p className="t-hospitality-eyebrow">{label}</p> : null}
            {note ? <p className="t-hospitality-stats-note">{note}</p> : null}
          </div>
        ) : null}
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
