import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { SiteImage } from "@/components/site-image";
import type { FeatureGridProps, SectionImage } from "@/lib/section-types";

/**
 * The project index.
 *
 * Items are intentionally read a little richer than the base type: a project
 * may carry `image`, `year` and `caption` alongside the contract's title,
 * body and href. All three are optional, so a plain FeatureGridProps still
 * renders. When no year is supplied, a trailing "— 2024" in the body is moved
 * to the right edge and stripped from the description.
 *
 * Rows are separated by 1px rules and alternate 7/5 (image left, then right).
 * There are no cards, no borders around photographs and no shadows.
 */

type ProjectItem = FeatureGridProps["items"][number] & {
  image?: SectionImage;
  year?: string;
  caption?: string;
};

type Entry = {
  item: ProjectItem;
  body: string;
  year?: string;
};

const numeral = (position: number): string =>
  String(position).padStart(2, "0");

const readYear = (item: ProjectItem): { body: string; year?: string } => {
  if (item.year) return { body: item.body, year: item.year };

  const match = item.body.match(/^(.*?)\s*[—–-]\s*((?:19|20)\d{2})$/);
  if (match) return { body: match[1].trim(), year: match[2] };

  return { body: item.body };
};

function RowFrame({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}): ReactElement {
  const className =
    "t-portfolio-row grid gap-6 border-t border-border py-9 md:py-14 lg:grid-cols-12 lg:items-stretch lg:gap-10";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}

export function FeatureGrid({
  eyebrow,
  title,
  items,
}: FeatureGridProps): ReactElement {
  const entries: Entry[] = (items as ProjectItem[]).map((item) => ({
    item,
    ...readYear(item),
  }));

  const years = entries
    .flatMap((entry) => (entry.year ? [entry.year] : []))
    .sort();

  const range =
    years.length === 0
      ? null
      : years[0] === years[years.length - 1]
        ? years[0]
        : `${years[0]}—${years[years.length - 1]}`;

  const meta = `${numeral(entries.length)} projects${
    range ? ` · ${range}` : ""
  }`;

  return (
    <section className="bg-bg">
      <div className="t-portfolio-shell t-portfolio-band">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <p className="t-portfolio-chrome text-muted">
            {eyebrow ?? "Index"}
          </p>
          <p className="t-portfolio-chrome text-muted">{meta}</p>
        </div>

        {title ? (
          <h2 className="t-portfolio-display t-portfolio-band-title t-portfolio-text reveal mt-10 md:mt-14">
            {title}
          </h2>
        ) : null}

        {entries.length > 0 ? (
          <ul className="mt-12 border-b border-border md:mt-20">
            {entries.map(({ item, body, year }, index) => {
              const imageFirst = index % 2 === 0;
              const hasImage = Boolean(item.image);
              const mediaOrder = imageFirst ? "lg:order-1" : "lg:order-2";
              const textOrder = imageFirst ? "lg:order-2" : "lg:order-1";

              return (
                <li key={item.href ?? item.title}>
                  <RowFrame href={item.href}>
                    {item.image ? (
                      <div
                        className={`t-portfolio-media reveal-image lg:col-span-7 ${mediaOrder}`}
                      >
                        <SiteImage
                          src={item.image.src}
                          alt={item.image.alt}
                          width={item.image.width}
                          height={item.image.height}
                          sizes="(min-width: 1024px) 58vw, 100vw"
                          aspectClassName="t-portfolio-ratio-4-3"
                          className={item.image.className ?? ""}
                        />
                      </div>
                    ) : null}

                    <div
                      className={`flex h-full flex-col justify-between ${
                        hasImage
                          ? `lg:col-span-5 ${textOrder}`
                          : "t-portfolio-text lg:col-span-12"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-6">
                        <span className="t-portfolio-chrome t-portfolio-index">
                          {numeral(index + 1)}
                        </span>
                        {year ? (
                          <span className="t-portfolio-chrome text-muted">
                            {year}
                          </span>
                        ) : (
                          <span aria-hidden="true" />
                        )}
                      </div>

                      <div className="mt-8 md:mt-10">
                        <h3 className="t-portfolio-display t-portfolio-feature-title">
                          {item.title}
                        </h3>
                        <p className="t-portfolio-body t-portfolio-description mt-3 text-muted">
                          {body}
                        </p>
                        {item.caption ? (
                          <p className="t-portfolio-caption mt-5">
                            {item.caption}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </RowFrame>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
