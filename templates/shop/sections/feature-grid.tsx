import Link from "next/link";
import type { ReactElement } from "react";
import { SiteImage } from "@/components/site-image";
import type { FeatureGridProps } from "@/lib/section-types";

/**
 * Three product cards, 4:5 crops, one hairline frame each.
 *
 * The signature device lives here. The card has a 1px frame and no shadow;
 * the first crop is always visible. On hover or keyboard focus a second crop of
 * the same photograph cross-fades in, while the name, price and View pill stay
 * exactly where they were. Price is never hidden behind the interaction.
 *
 * FeatureGridProps carries no image field, so the template ships a small,
 * brand-neutral art set keyed by card position. An adapter replaces
 * `PRODUCT_ART` with the client's own product crops; the layout does not change.
 *
 * The item body is the product's meta line:
 *
 *   "€185 · Handwoven in County Kerry · 130 × 180 cm"
 *
 * Everything before the first " · " is the price when it contains a euro
 * figure. The rest becomes the descriptor. If the body has no price, it is all
 * descriptor and the baseline row simply drops the price slot.
 */

const PRODUCT_ART = [
  {
    src: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?auto=format&fit=crop&w=800&h=1000&q=80",
    alt: "A stack of folded wool blankets in cream, grey and teal.",
    detailClass: "object-[50%_18%] scale-[1.35]",
  },
  {
    src: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&h=1000&q=80",
    alt: "Hand-thrown stoneware bowls stacked on an oak shelf.",
    detailClass: "object-[64%_44%] scale-[1.45]",
  },
  {
    src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&h=1000&q=80",
    alt: "A cream hand-knitted poncho with a fringed hem on a wooden hanger.",
    detailClass: "object-[50%_30%] scale-[1.5]",
  },
] as const;

function splitMeta(body: string): { price?: string; detail?: string } {
  const [first, ...rest] = body.split(" · ");
  if (/€\s?\d/.test(first)) {
    return {
      price: first.trim(),
      detail: rest.length ? rest.join(" · ") : undefined,
    };
  }
  return { detail: body };
}

function ProductCard({
  item,
  index,
}: {
  item: FeatureGridProps["items"][number];
  index: number;
}): ReactElement {
  const art = PRODUCT_ART[index % PRODUCT_ART.length];
  const href = item.href;
  const { price, detail } = splitMeta(item.body);

  const content = (
    <>
      <div className="t-shop-card__media">
        <div className="t-shop-card__layer t-shop-card__layer--front">
          <SiteImage
            src={art.src}
            alt={art.alt}
            width={800}
            height={1000}
            sizes="(min-width: 1280px) 392px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            aspectClassName="aspect-[4/5] h-full w-full"
            className="h-full w-full object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="t-shop-card__layer t-shop-card__layer--back"
        >
          <SiteImage
            src={art.src}
            alt=""
            width={800}
            height={1000}
            sizes="(min-width: 1280px) 392px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            aspectClassName="aspect-[4/5] h-full w-full"
            className={`h-full w-full object-cover ${art.detailClass}`}
          />
        </div>
      </div>

      <div className="t-shop-card__body">
        <div>
          <h3 className="t-shop-cardtitle">{item.title}</h3>
          {detail ? <p className="t-shop-descriptor mt-2">{detail}</p> : null}
        </div>

        {price || href ? (
          <div className="t-shop-card__row">
            {price ? <span className="t-shop-price">{price}</span> : <span />}
            {href ? (
              <span className="t-shop-pill">
                View
                <span className="t-shop-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <li className="t-shop-card">
      {href ? (
        <Link href={href} className="t-shop-card__link">
          {content}
        </Link>
      ) : (
        <div className="t-shop-card__link">{content}</div>
      )}
    </li>
  );
}

export function FeatureGrid({
  eyebrow,
  title,
  items,
}: FeatureGridProps): ReactElement {
  return (
    <section className="t-shop-section bg-bg">
      <div className="t-shop-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            {eyebrow ? <p className="t-shop-eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className="t-shop-title reveal mt-4 max-w-[20ch]">{title}</h2>
            ) : null}
          </div>
          <p className="t-shop-index hidden pb-1 sm:block">
            Selected — {String(items.length).padStart(2, "0")}
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-3 lg:gap-8">
          {items.map((item, index) => (
            <ProductCard
              key={`${item.href ?? item.title}-${index}`}
              item={item}
              index={index}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
