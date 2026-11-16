import type { ReactElement } from "react";
import type { StatBandProps } from "@/lib/section-types";

/**
 * Four quiet figures on the white surface. The hairline above each figure is
 * the only divider; there are no boxes and no icons. Values are already
 * formatted by the caller, and keep their tabular columns.
 */
export function StatBand({ stats }: StatBandProps): ReactElement {
  return (
    <section className="bg-surface">
      <div className="t-portfolio-shell py-12 md:py-16">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse gap-3 border-t border-border pt-5 md:pt-6"
            >
              <dt className="t-portfolio-chrome text-muted">{stat.label}</dt>
              <dd className="t-portfolio-display t-portfolio-stat-value tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
