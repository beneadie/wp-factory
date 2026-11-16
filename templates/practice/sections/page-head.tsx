import Link from "next/link";
import type { PageHeadProps } from "@/lib/section-types";

/**
 * The thin page: an eyebrow, one display title, a hairline, and a ruled row of
 * sibling links. No image, no body copy, no centred type. The composition is
 * carried by scale, air and the three-column index.
 */
export function PageHead({ eyebrow, title, tagline, links }: PageHeadProps) {
  const hasLinks = Boolean(links && links.length > 0);

  return (
    <section className="t-practice-pagehead">
      <div className="t-practice-container">
        <div className="t-practice-pagehead-top">
          {eyebrow ? <p className="t-practice-eyebrow">{eyebrow}</p> : null}
          <h1 className="t-practice-display t-practice-page-title">{title}</h1>
          {tagline ? <p className="t-practice-tagline">{tagline}</p> : null}
        </div>

        <div className="t-practice-page-rule" />

        {hasLinks ? (
          <nav aria-label="Related pages">
            <ul className="t-practice-page-links">
              {links?.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link
                    href={link.href}
                    className="t-practice-page-link t-practice-link-block"
                  >
                    <span className="t-practice-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="t-practice-page-link-row">
                      <span className="t-practice-link-label t-practice-page-link-label">
                        {link.label}
                      </span>
                      <Arrow />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      className="t-practice-arrow"
      viewBox="0 0 14 10"
      width="14"
      height="10"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 5h12.5M9 1l4 4-4 4" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
