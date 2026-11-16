import Link from "next/link";
import type { CtaBandProps } from "@/lib/section-types";

/**
 * Closing band — hours and the booking pill, on the inverse roast colour.
 *
 * The title and body sit left, the week's hours right. Today is heavier, never
 * a different colour. `hours` is an optional extension for this template; a
 * caller that only knows CtaBandProps still gets title, body and one CTA.
 */

export type HospitalityHoursRow = {
  day: string;
  time: string;
  today?: boolean;
};

export type HospitalityCtaBandProps = CtaBandProps & {
  hours?: HospitalityHoursRow[];
  hoursLabel?: string;
  hoursNote?: string;
};

export function CtaBand({
  title,
  body,
  cta,
  hours,
  hoursLabel = "Opening hours",
  hoursNote,
}: HospitalityCtaBandProps) {
  return (
    <section className="t-hospitality-cta">
      <div className="t-hospitality-wrap">
        <div className="t-hospitality-cta-grid">
          <div>
            <h2 className="t-hospitality-display t-hospitality-cta-title">
              {title}
            </h2>
            {body ? <p className="t-hospitality-cta-body">{body}</p> : null}
            <Link href={cta.href} className="t-hospitality-pill mt-8">
              {cta.label}
            </Link>
          </div>

          {hours && hours.length > 0 ? (
            <div>
              <p className="t-hospitality-eyebrow t-hospitality-eyebrow-inverse">
                {hoursLabel}
              </p>
              <dl className="t-hospitality-hours">
                {hours.map((row) => (
                  <div
                    key={row.day}
                    className={`t-hospitality-hours-row${row.today ? " is-today" : ""}`}
                  >
                    <dt aria-current={row.today ? "date" : undefined}>
                      {row.day}
                    </dt>
                    <dd className="t-hospitality-hours-time">{row.time}</dd>
                  </div>
                ))}
              </dl>
              {hoursNote ? (
                <p className="t-hospitality-hours-note">{hoursNote}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
