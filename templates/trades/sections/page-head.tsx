import Link from "next/link";
import type { ReactElement } from "react";
import type { PageHeadProps } from "@/lib/section-types";

/**
 * The thin-page archetype.
 *
 * No image and no body copy: an 11px accent eyebrow, a display h1, a lot of
 * air, a hairline, and the three sibling pages as an indexed link strip. The
 * strip is the composition; it keeps an otherwise empty page feeling finished.
 *
 * If a tagline is supplied it sits under the title at lede size. If more than
 * three links arrive the grid wraps rather than dropping one.
 */
export function PageHead({
  eyebrow,
  title,
  tagline,
  links,
}: PageHeadProps): ReactElement {
  return (
    <header className="t-trades-pagehead">
      <div className="t-trades-shell">
        <div className="t-trades-pagehead__top">
          {eyebrow ? <p className="t-trades-eyebrow">{eyebrow}</p> : null}

          <h1 className="t-trades-display t-trades-h1 t-trades-pagehead__title">
            {title}
          </h1>

          {tagline ? (
            <p className="t-trades-pagehead__tagline">{tagline}</p>
          ) : null}
        </div>

        {links && links.length > 0 ? (
          <nav aria-label="Related pages" className="t-trades-pagehead__nav">
            <ul>
              {links.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link href={link.href} className="t-trades-pagehead__link">
                    <span
                      className="t-trades-pagehead__index"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="t-trades-pagehead__label">
                      {link.label}
                    </span>
                    <span
                      className="t-trades-pagehead__arrow"
                      aria-hidden="true"
                    >
                      →
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
