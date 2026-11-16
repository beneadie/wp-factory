import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import type { FeatureGridProps, SectionImage } from "@/lib/section-types";

/**
 * Feature grid — "today at the café", then the menu.
 *
 * Three photograph-led cards (4:5, no card border, a hairline above each
 * caption). The optional menu below is the template's signature: dish and
 * price on one line with a dotted leader, course names in small caps over a
 * hairline, prices in tabular numerals. Neither addition changes the contract
 * for a caller that only knows FeatureGridProps; both are optional.
 */

export type HospitalityDish = {
  name: string;
  description?: string;
  price: string;
};

export type HospitalityMenuCourse = {
  title: string;
  note?: string;
  dishes: HospitalityDish[];
};

export type HospitalityFeatureItem = FeatureGridProps["items"][number] & {
  image?: SectionImage;
};

export type HospitalityFeatureGridProps = Omit<FeatureGridProps, "items"> & {
  items: HospitalityFeatureItem[];
  /** Real menu data, supplied by the adapter. Omit for a photography-only grid. */
  menu?: HospitalityMenuCourse[];
  menuLabel?: string;
  menuNote?: string;
};

export function FeatureGrid({
  eyebrow,
  title,
  items,
  menu,
  menuLabel = "From the menu",
  menuNote,
}: HospitalityFeatureGridProps) {
  return (
    <section className="t-hospitality-features t-hospitality-section">
      <div className="t-hospitality-wrap">
        {eyebrow || title ? (
          <div className="max-w-[36rem]">
            {eyebrow ? (
              <div className="t-hospitality-kicker">
                <p className="t-hospitality-eyebrow">{eyebrow}</p>
              </div>
            ) : null}
            {title ? (
              <h2 className="t-hospitality-display t-hospitality-feature-title">
                {title}
              </h2>
            ) : null}
          </div>
        ) : null}

        <ul className="t-hospitality-feature-grid">
          {items.map((item, index) => {
            const inner = (
              <>
                <div className="t-hospitality-card-media">
                  {item.image ? (
                    <SiteImage
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      aspectClassName="aspect-[4/5]"
                      className={`t-hospitality-card-image ${item.image.className ?? ""}`}
                    />
                  ) : (
                    <div className="t-hospitality-card-panel" aria-hidden="true">
                      <span className="t-hospitality-card-panel-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="t-hospitality-eyebrow">Today</span>
                    </div>
                  )}
                </div>
                <div className="t-hospitality-card-caption">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="t-hospitality-card-heading">{item.title}</h3>
                    {item.href ? (
                      <span aria-hidden="true" className="t-hospitality-card-arrow">
                        →
                      </span>
                    ) : null}
                  </div>
                  <p className="t-hospitality-card-body">{item.body}</p>
                </div>
              </>
            );

            return (
              <li key={`${item.title}-${index}`} className="t-hospitality-card">
                {item.href ? (
                  <Link href={item.href} className="t-hospitality-card-link">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>

        {menu && menu.length > 0 ? (
          <div className="t-hospitality-menu">
            <div className="t-hospitality-menu-head">
              <p className="t-hospitality-eyebrow">{menuLabel}</p>
              {menuNote ? (
                <p className="t-hospitality-menu-note">{menuNote}</p>
              ) : null}
            </div>

            <div className="t-hospitality-menu-grid">
              {menu.map((course, courseIndex) => (
                <div
                  key={`${course.title}-${courseIndex}`}
                  className="t-hospitality-menu-course"
                >
                  <div className="t-hospitality-course-head">
                    <h3 className="t-hospitality-course-title">{course.title}</h3>
                    {course.note ? (
                      <span className="t-hospitality-course-note">
                        {course.note}
                      </span>
                    ) : null}
                  </div>
                  <ul className="t-hospitality-dish-list">
                    {course.dishes.map((dish, dishIndex) => (
                      <li
                        key={`${dish.name}-${dishIndex}`}
                        className="t-hospitality-dish"
                      >
                        <div className="t-hospitality-dish-line">
                          <span className="t-hospitality-dish-name">
                            {dish.name}
                          </span>
                          <span
                            aria-hidden="true"
                            className="t-hospitality-dish-leader"
                          />
                          <span className="t-hospitality-dish-price">
                            {dish.price}
                          </span>
                        </div>
                        {dish.description ? (
                          <span className="t-hospitality-dish-desc">
                            {dish.description}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
