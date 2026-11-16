import Link from "next/link";
import type { ReactElement } from "react";
import type { PageHeadProps } from "@/lib/section-types";

/**
 * The thin-page head: eyebrow, display title, one hairline, three sibling
 * links. It is deliberately image-free and body-copy-free — the proportions
 * and the ruled link row do the work.
 */
export function PageHead({
  eyebrow,
  title,
  tagline,
  links,
}: PageHeadProps): ReactElement {
  return (
    <header className="t-property-pagehead">
      <div className="t-property-container">
        <div className="t-property-pagehead-top">
          {eyebrow ? <p className="t-property-eyebrow">{eyebrow}</p> : null}
          <h1 className="t-property-display t-property-pagehead-title reveal">
            {title}
          </h1>
          {tagline ? (
            <p className="t-property-pagehead-tagline">{tagline}</p>
          ) : null}
        </div>

        <div className="t-property-pagehead-rule" aria-hidden="true" />

        {links && links.length > 0 ? (
          <nav aria-label="Related pages">
            <ul className="t-property-pagehead-links">
              {links.map((link, index) => (
                <li key={link.href}>
                  <Link className="t-property-pagehead-link" href={link.href}>
                    <span className="t-property-pagehead-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="t-property-pagehead-row">
                      <span className="t-property-pagehead-label">
                        {link.label}
                      </span>
                      <span className="t-property-arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
