import Link from "next/link";
import type { FeatureGridProps } from "@/lib/section-types";

/**
 * A ruled index, not a card grid. Each item is a hairline, a two-digit index,
 * a serif title, one short paragraph and a link rule. When `href` is supplied
 * the whole item is the anchor.
 *
 * Extra optional prop (documented in design.md):
 * - columns: 2 or 3 columns at desktop (default 3).
 */
export type PracticeFeatureGridProps = FeatureGridProps & {
  columns?: 2 | 3;
};

export function FeatureGrid({
  eyebrow,
  title,
  items,
  columns = 3,
}: PracticeFeatureGridProps) {
  return (
    <section className="t-practice-section">
      <div className="t-practice-container">
        {eyebrow || title ? (
          <header className="t-practice-feature-head reveal">
            <div className="t-practice-feature-meta">
              {eyebrow ? <p className="t-practice-eyebrow">{eyebrow}</p> : null}
              {items.length > 0 ? (
                <p className="t-practice-feature-note">
                  {String(items.length).padStart(2, "0")} services · one
                  partner-led team
                </p>
              ) : null}
            </div>
            {title ? (
              <h2 className="t-practice-display t-practice-feature-title">
                {title}
              </h2>
            ) : null}
          </header>
        ) : null}

        <ul className="t-practice-feature-grid" data-columns={columns}>
          {items.map((item, index) => (
            <li key={`${item.title}-${index}`} className="t-practice-feature-item reveal">
              {item.href ? (
                <Link
                  href={item.href}
                  className="t-practice-feature-anchor t-practice-link-block"
                >
                  <ItemContent item={item} index={index} />
                </Link>
              ) : (
                <div className="t-practice-feature-anchor">
                  <ItemContent item={item} index={index} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ItemContent({
  item,
  index,
}: {
  item: FeatureGridProps["items"][number];
  index: number;
}) {
  return (
    <>
      <span className="t-practice-index">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="t-practice-feature-item-title">{item.title}</h3>
      <p className="t-practice-feature-body">{item.body}</p>
      {item.href ? (
        <span className="t-practice-feature-more">
          <span className="t-practice-link-label">Read more</span>
          <Arrow />
        </span>
      ) : null}
    </>
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
