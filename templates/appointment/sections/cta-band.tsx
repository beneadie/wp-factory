import type { CtaBandProps } from "@/lib/section-types";

/**
 * The closing band: a large statement on the left, the practical copy and one
 * action on the right. No panel, no shadow — the hairline does the framing.
 */
export function CtaBand({ title, body, cta }: CtaBandProps) {
  return (
    <section className="t-appointment t-appointment-section border-t border-border">
      <div className="t-appointment-shell">
        <div className="grid gap-9 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="reveal lg:col-span-7">
            <div
              className="t-appointment-accent-rule"
              aria-hidden="true"
            />
            <p className="t-appointment-eyebrow mt-5">Appointments</p>
            <h2 className="t-appointment-display t-appointment-h2 mt-3 max-w-[18ch] text-text">
              {title}
            </h2>
          </div>

          <div className="reveal lg:col-span-4 lg:col-start-9">
            {body ? <p className="t-appointment-lede">{body}</p> : null}

            <a
              href={cta.href}
              className="t-appointment-btn t-appointment-btn--primary mt-7"
            >
              {cta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
