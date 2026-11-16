import Link from "next/link";
import type { ReactElement } from "react";
import type { PageHeadProps } from "@/lib/section-types";

/**
 * The thin-page archetype, and the section that most often looks broken on a
 * captured site. It must hold with a title alone: eyebrow, display h1, a
 * full-width hairline and a row of three sibling links. No image, no body copy,
 * no decorative filler.
 */
export function PageHead({
  eyebrow,
  title,
  tagline,
  links,
}: PageHeadProps): ReactElement {
  const hasLinks = Boolean(links && links.length > 0);

  return (
    <header className="t-community-section">
      <div className="t-community-container">
        <div className="t-community-pagehead-grid">
          <div>
            {eyebrow ? <p className="t-community-eyebrow">{eyebrow}</p> : null}
            <h1 className="t-community-page-title">{title}</h1>
          </div>
          {tagline ? <p className="t-community-tagline">{tagline}</p> : null}
        </div>

        <div className="t-community-page-rule">
          {hasLinks ? (
            <nav aria-label="Related pages">
              <ul className="t-community-page-links">
                {links?.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="t-community-page-link">
                      <span className="t-community-page-link-label">
                        {link.label}
                      </span>
                      <span aria-hidden="true" className="t-community-arrow">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
