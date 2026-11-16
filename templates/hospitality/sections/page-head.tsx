import Link from "next/link";
import type { PageHeadProps } from "@/lib/section-types";

/**
 * Page head — a thin page, composed without an image or body copy.
 *
 * A short rule and eyebrow, the display title at full size, a hairline, then
 * the sibling links as an editorial row: numbered, evenly divided, each one
 * carrying the same weight. No tagline is required for it to feel finished.
 */
export function PageHead({ eyebrow, title, tagline, links }: PageHeadProps) {
  return (
    <header className="t-hospitality-page-head">
      <div className="t-hospitality-wrap">
        <div className="reveal">
          {eyebrow ? (
            <div className="t-hospitality-kicker">
              <p className="t-hospitality-eyebrow">{eyebrow}</p>
            </div>
          ) : null}
          <h1 className="t-hospitality-display t-hospitality-page-title mt-6">
            {title}
          </h1>
          {tagline ? (
            <p className="t-hospitality-page-tagline">{tagline}</p>
          ) : null}
        </div>

        {links && links.length > 0 ? (
          <nav aria-label="Related pages" className="t-hospitality-page-links">
            <div className="t-hospitality-page-links-grid">
              {links.map((link, index) => (
                <Link key={link.href} href={link.href} className="t-hospitality-page-link">
                  <span className="t-hospitality-page-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="t-hospitality-page-link-label">
                    {link.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="t-hospitality-page-arrow"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
