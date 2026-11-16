import type { PageHeadProps } from "@/lib/section-types";

/**
 * The thin-page head: eyebrow, display h1, one hairline, a row of sibling
 * links (three in the fixture). It carries no image and no body copy; the
 * space is the composition.
 */
export function PageHead({ eyebrow, title, tagline, links = [] }: PageHeadProps) {
  return (
    <section className="t-appointment border-b border-border">
      <div className="t-appointment-shell">
        <div className="pb-12 pt-14 lg:pb-20 lg:pt-24">
          <div className="reveal max-w-[54rem]">
            {eyebrow ? (
              <p className="t-appointment-eyebrow">{eyebrow}</p>
            ) : null}

            <h1 className="t-appointment-display t-appointment-h2 mt-5 text-text">
              {title}
            </h1>

            {tagline ? (
              <p className="t-appointment-lede mt-6">{tagline}</p>
            ) : null}
          </div>

          <div className="reveal mt-12 border-t border-border lg:mt-20">
            {links.length > 0 ? (
              <nav aria-label="Related pages">
                <ul className="t-appointment-link-grid">
                  {links.map((link, index) => (
                    <li key={`${link.href}-${link.label}`}>
                      <a href={link.href} className="t-appointment-index-link">
                        <span className="t-appointment-index t-appointment-num">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="t-appointment-index-title">
                          {link.label}
                        </span>
                        <span
                          className="t-appointment-index-arrow"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
