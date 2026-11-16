import Link from "next/link";
import type { ReactElement } from "react";
import type { PageHeadProps } from "@/lib/section-types";

/**
 * A page with a title and three siblings — no image, no body copy.
 *
 * The composition is deliberately top-heavy: an eyebrow, one display line,
 * air, then a hairline carrying numbered links. It has to read as finished with
 * nothing else on the page.
 */
export function PageHead({
  eyebrow,
  title,
  tagline,
  links,
}: PageHeadProps): ReactElement {
  return (
    <header className="t-shop-pagehead border-b border-border bg-bg">
      <div className="t-shop-container">
        {eyebrow ? <p className="t-shop-eyebrow">{eyebrow}</p> : null}

        <h1 className="t-shop-display reveal mt-8 max-w-[15ch]">{title}</h1>

        {tagline ? <p className="t-shop-lede mt-6 max-w-[46ch]">{tagline}</p> : null}

        {links && links.length > 0 ? (
          <div className="mt-14 border-t border-border pt-4 md:mt-16">
            <nav aria-label="Section links" className="grid gap-x-8 md:grid-cols-3">
              {links.map((link, index) => (
                <Link
                  key={`${link.href}-${index}`}
                  href={link.href}
                  className="t-shop-linkrow w-full"
                >
                  <span className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="t-shop-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="t-shop-linklabel">{link.label}</span>
                    <span className="t-shop-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
