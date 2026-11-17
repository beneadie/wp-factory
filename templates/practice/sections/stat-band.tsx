import type { StatBandProps } from "@/lib/section-types";

/**
 * The credentials band: regulator, year established, memberships. It sits
 * between two hairlines, values in the display face with tabular numerals and
 * labels in 11px letter-spaced capitals.
 *
 * Extra optional prop (documented in design.md):
 * - eyebrow: a short label above the figures, e.g. "Credentials".
 */
export type PracticeStatBandProps = StatBandProps & {
  eyebrow?: string;
};

export function StatBand({ stats, eyebrow }: PracticeStatBandProps) {
  return (
    <section className="t-practice-stat">
      <div className="t-practice-container">
        <div className="t-practice-stat-band reveal">
          {eyebrow ? (
            <p className="t-practice-eyebrow t-practice-stat-eyebrow">
              {eyebrow}
            </p>
          ) : null}

          <dl className="t-practice-stats">
            {stats.map((stat, index) => (
              <div
                key={`${stat.label}-${stat.value}-${index}`}
                className="t-practice-stat-cell"
              >
                <dt className="t-practice-stat-label">
                  <span className="t-practice-stat-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {stat.label}
                </dt>
                <dd className="t-practice-stat-value">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
