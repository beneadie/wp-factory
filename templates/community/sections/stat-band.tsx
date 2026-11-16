import type { ReactElement } from "react";
import type { StatBandProps } from "@/lib/section-types";

const DATE_HINT =
  /\b(mon|tue|tues|wed|weds|thu|thur|thurs|fri|sat|sun|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i;

/**
 * Split "Fri 20 Nov" into a day column and a date column. Values that are not
 * dated ("420+") keep the whole value in the date column and simply omit the
 * day label, so the same component can still carry a figures band.
 */
function splitValue(value: string): { lead: string | null; rest: string } {
  const parts = value.trim().split(/\s+/);
  if (parts.length > 1 && DATE_HINT.test(parts[0])) {
    return { lead: parts[0], rest: parts.slice(1).join(" ") };
  }
  return { lead: null, rest: value };
}

/**
 * The notice strip — this template's signature device.
 *
 * It is a full-bleed strip of dated rows separated by 1px rules: day, date,
 * title. The most recent (nearest) dated row — the first one, because rows are
 * ordered nearest-first — carries a small accent "New" flag. Dates use tabular
 * numerals.
 *
 * Pass dated notices as { value: "Fri 20 Nov", label: "Winter Fair · Hall" }.
 * The same shape still renders as a quiet figures band when values are numbers.
 */
export function StatBand({ stats }: StatBandProps): ReactElement {
  const flagIndex = stats.findIndex((stat) => DATE_HINT.test(stat.value));
  const hasDates = flagIndex !== -1;

  return (
    <section
      aria-label={hasDates ? "Upcoming notices" : "Figures"}
      className="t-community-notice"
    >
      <div className="t-community-container">
        <ul className="t-community-notice-list">
          {stats.map((stat, index) => {
            const { lead, rest } = splitValue(stat.value);
            return (
              <li
                key={`${stat.value}-${stat.label}-${index}`}
                className="t-community-notice-row"
              >
                <span className="t-community-notice-date">
                  {lead ? (
                    <span className="t-community-notice-day">{lead}</span>
                  ) : null}
                  <span className="t-community-notice-datevalue">{rest}</span>
                </span>
                <span className="t-community-notice-title">{stat.label}</span>
                {hasDates && index === flagIndex ? (
                  <span className="t-community-flag">New</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
