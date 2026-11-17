import Link from "next/link";
import type { ReactElement } from "react";
import type { PageHeadProps } from "@/lib/section-types";

const numeral = (position: number): string =>
  String(position).padStart(2, "0");

/**
 * A thin page with nothing to lean on: no photograph, no paragraphs. It is
 * composed from air, one display line, one hairline and three numbered
 * siblings. The three links are the only colour change on the page, and only
 * their index numerals take the accent on hover or focus.
 */
export function PageHead({
  eyebrow,
  title,
  tagline,
  links,
}: PageHeadProps): ReactElement {
  return (
    <header className="bg-bg">
      <div className="t-portfolio-shell t-portfolio-band-bottom pt-12 md:pt-16">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <p className="t-portfolio-chrome text-muted">
            {eyebrow ?? "Index"}
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:mt-24 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 className="t-portfolio-display t-portfolio-page-title lg:col-span-8">
            {title}
          </h1>
          {tagline ? (
            <p className="t-portfolio-body text-muted lg:col-span-4 lg:pb-2 lg:text-right">
              {tagline}
            </p>
          ) : null}
        </div>

        <div className="mt-14 h-px w-full bg-border md:mt-20" />

        {links && links.length > 0 ? (
          <nav aria-label="Sections" className="grid sm:grid-cols-3">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="t-portfolio-page-link flex items-baseline gap-4 py-5 sm:py-7 sm:pr-6 sm:last:pr-0"
              >
                <span className="t-portfolio-chrome t-portfolio-index">
                  {numeral(index + 1)}
                </span>
                <span className="t-portfolio-chrome">{link.label}</span>
                <span
                  aria-hidden="true"
                  className="t-portfolio-chrome t-portfolio-arrow"
                >
                  ↗
                </span>
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
