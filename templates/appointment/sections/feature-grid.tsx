import type { FeatureGridProps } from "@/lib/section-types";

const PRICE_PATTERN = /(?:from\s+)?[€£$]\s?\d[\d,]*(?:\.\d{2})?/i;
const DURATION_PATTERN =
  /\b\d+\s*(?:min|mins|minutes|hr|hrs|hour|hours)\b/i;

type TreatmentMeta = {
  price: string | null;
  duration: string | null;
  note: string | null;
};

/**
 * A treatment body is a compact fee line, e.g. "from €145 · 50 min". The fee
 * and duration are lifted into their own columns; any remaining sentence is
 * shown quietly under the treatment name.
 */
function parseTreatment(body: string): TreatmentMeta {
  const price = body.match(PRICE_PATTERN)?.[0] ?? null;
  const duration = body.match(DURATION_PATTERN)?.[0] ?? null;

  let note = body;
  if (price) note = note.replace(price, " ");
  if (duration) note = note.replace(duration, " ");
  note = note
    .replace(/^[\s·|,;–—-]+|[\s·|,;–—-]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return { price, duration, note: note.length > 0 ? note : null };
}

const WEEK = [
  {
    day: "Monday",
    date: "16 November",
    iso: "2026-11-16",
    times: ["08:40", "11:20", "16:00"],
    full: [false, false, true],
  },
  {
    day: "Tuesday",
    date: "17 November",
    iso: "2026-11-17",
    times: ["09:20", "12:40", "16:40"],
    full: [false, true, false],
  },
  {
    day: "Wednesday",
    date: "18 November",
    iso: "2026-11-18",
    times: ["08:20", "10:40", "15:20"],
    full: [true, false, false],
  },
  {
    day: "Thursday",
    date: "19 November",
    iso: "2026-11-19",
    times: ["09:00", "11:40", "17:00"],
    full: [false, false, true],
  },
  {
    day: "Friday",
    date: "20 November",
    iso: "2026-11-20",
    times: ["08:40", "13:20", "16:20"],
    full: [false, false, false],
  },
  {
    day: "Saturday",
    date: "21 November",
    iso: "2026-11-21",
    times: ["09:00", "11:30", "13:00"],
    full: [false, false, true],
  },
];

export function FeatureGrid({ eyebrow, title, items }: FeatureGridProps) {
  const treatments = items.map((item) => ({
    ...item,
    ...parseTreatment(item.body),
  }));

  if (treatments.length === 0) {
    return null;
  }

  const days = WEEK.map((day, dayIndex) => ({
    ...day,
    slots: day.times.map((time, slotIndex) => {
      const treatment =
        treatments[(dayIndex * 3 + slotIndex) % treatments.length];
      return {
        time,
        treatment,
        available: !day.full[slotIndex],
      };
    }),
  }));

  return (
    <section className="t-appointment t-appointment-section">
      <div className="t-appointment-shell">
        <header className="reveal max-w-[44rem]">
          {eyebrow ? (
            <p className="t-appointment-eyebrow">{eyebrow}</p>
          ) : null}

          {title ? (
            <h2 className="t-appointment-display t-appointment-h3 mt-4 text-text">
              {title}
            </h2>
          ) : null}
        </header>

        <div className="reveal mt-12 lg:mt-16">
          <div className="t-appointment-ledger-head">
            <p className="t-appointment-eyebrow">Treatment</p>
            <p className="t-appointment-eyebrow">Fee</p>
          </div>

          <ul className="m-0 list-none p-0">
            {treatments.map((treatment, index) => {
              const row = (
                <>
                  <span className="min-w-0">
                    <span className="t-appointment-treatment-title">
                      {treatment.title}
                    </span>
                    {treatment.note ? (
                      <span className="t-appointment-treatment-note">
                        {treatment.note}
                      </span>
                    ) : null}
                  </span>

                  <span className="t-appointment-treatment-meta">
                    {treatment.duration ? (
                      <span className="t-appointment-duration-label">
                        {treatment.duration}
                      </span>
                    ) : null}
                    {treatment.price ? (
                      <span className="t-appointment-price t-appointment-num">
                        {treatment.price}
                      </span>
                    ) : null}
                  </span>
                </>
              );

              return (
                <li
                  key={`${treatment.title}-${index}`}
                  className="border-b border-border"
                >
                  {treatment.href ? (
                    <a
                      href={treatment.href}
                      className="t-appointment-treatment"
                    >
                      {row}
                    </a>
                  ) : (
                    <div className="t-appointment-treatment">{row}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div
          id="timetable"
          className="t-appointment-timetable-anchor mt-16 lg:mt-20"
        >
          <div className="t-appointment-timetable-head">
            <div>
              <p className="t-appointment-eyebrow">This week</p>
              <h3 className="t-appointment-display t-appointment-h4 mt-2 text-text">
                Available appointments
              </h3>
            </div>

            <div className="t-appointment-legend">
              <span className="t-appointment-key">
                <span
                  className="t-appointment-key-mark t-appointment-key-mark--book"
                  aria-hidden="true"
                />
                Available
              </span>
              <span className="t-appointment-key">
                <span
                  className="t-appointment-key-mark t-appointment-key-mark--full"
                  aria-hidden="true"
                />
                Fully booked
              </span>
            </div>
          </div>

          <div
            className="t-appointment-table-scroll reveal"
            role="region"
            aria-label="Available appointments this week"
            tabIndex={0}
          >
            <table className="t-appointment-table">
              <caption className="sr-only">
                Available appointments this week, grouped by day
              </caption>
              <colgroup>
                <col className="t-appointment-col-time" />
                <col />
                <col className="t-appointment-col-duration" />
                <col className="t-appointment-col-action" />
              </colgroup>

              {days.map((day) => {
                const availableCount = day.slots.filter(
                  (slot) => slot.available,
                ).length;

                return (
                  <tbody key={day.iso}>
                    <tr className="t-appointment-day">
                      <th scope="rowgroup" colSpan={4}>
                        <div className="t-appointment-day-inner">
                          <span className="t-appointment-day-name">
                            <time dateTime={day.iso}>
                              {day.day} {day.date}
                            </time>
                          </span>
                          <span className="t-appointment-day-count">
                            {availableCount} available
                          </span>
                        </div>
                      </th>
                    </tr>

                    {day.slots.map((slot) => (
                      <tr
                        key={`${day.iso}-${slot.time}`}
                        className="t-appointment-slot"
                      >
                        <td className="t-appointment-time">
                          <time dateTime={`${day.iso}T${slot.time}`}>
                            {slot.time}
                          </time>
                        </td>
                        <td>
                          <span className="t-appointment-session-title">
                            {slot.treatment.title}
                          </span>
                        </td>
                        <td className="t-appointment-duration">
                          {slot.treatment.duration ?? "—"}
                        </td>
                        <td className="t-appointment-action">
                          {slot.available ? (
                            <a
                              href={slot.treatment.href ?? "#timetable"}
                              className="t-appointment-pill t-appointment-pill--book"
                              aria-label={`Book ${slot.treatment.title} on ${day.day} ${day.date} at ${slot.time}`}
                            >
                              Book
                            </a>
                          ) : (
                            <span className="t-appointment-pill t-appointment-pill--full">
                              Full
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                );
              })}
            </table>
          </div>

          <p className="t-appointment-table-note">
            Appointments are confirmed by text message. All times are Irish
            time.
          </p>
        </div>
      </div>
    </section>
  );
}
