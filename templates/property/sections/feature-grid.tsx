import Link from "next/link";
import type { ReactElement } from "react";
import { SiteImage } from "@/components/site-image";
import type { FeatureGridProps, SectionImage } from "@/lib/section-types";

/**
 * The signature section: a three-up grid of listing cards.
 *
 * FeatureGrid's contract carries a title, a body and an optional href — no
 * image, specs or price. The card therefore reads the first line of `body` as
 * a listing line in a small, documented convention:
 *
 *   New to Market · 4 beds · 2 baths · 168 m² · €625,000
 *   A 2019 build behind a stone wall, with a garden that runs to the stream.
 *
 * The line is parsed for a status flag, specs and a price; everything after
 * the newline is the blurb. Copy that does not follow the convention still
 * renders as a plain card, so a page builder can never produce broken markup.
 *
 * A page builder may attach an optional `image` to an item at runtime. That
 * field is not part of the fixed prop type; it is read defensively here. When
 * it is absent the card is text-first rather than showing an empty slot.
 */

type ListingItem = FeatureGridProps["items"][number];

type ParsedListing = {
  status?: string;
  specs: string[];
  price?: string;
  blurb: string;
};

type Listing = ListingItem &
  ParsedListing & {
    image?: SectionImage;
  };

const STATUS_FLAGS = new Set([
  "new to market",
  "sale agreed",
  "sold",
  "sold subject to contract",
  "under offer",
  "for rent",
]);

const SPEC_PATTERN = /\b(beds?|baths?|m²|sq\.?\s?m|acres?|ber)\b/i;

/**
 * The optional image is outside the fixed FeatureGrid prop type, so it is
 * checked rather than trusted: a partial object or a stray string is ignored
 * and the card falls back to its text-first form.
 */
function readListingImage(item: ListingItem): SectionImage | undefined {
  const candidate = (
    item as ListingItem & { image?: Record<string, unknown> }
  ).image;
  if (
    !candidate ||
    typeof candidate.src !== "string" ||
    typeof candidate.alt !== "string" ||
    typeof candidate.width !== "number" ||
    typeof candidate.height !== "number"
  ) {
    return undefined;
  }

  return {
    src: candidate.src,
    alt: candidate.alt,
    width: candidate.width,
    height: candidate.height,
    className:
      typeof candidate.className === "string" ? candidate.className : undefined,
  };
}

function parseListing(body: string): ParsedListing {
  const [first = "", ...rest] = body.split(/\r?\n/);
  const parts = first
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  const status = parts.find((part) => STATUS_FLAGS.has(part.toLowerCase()));
  const price = parts.find(
    (part) =>
      part.includes("€") ||
      /^price on application$/i.test(part) ||
      /^poa$/i.test(part),
  );
  const specs = parts.filter(
    (part) =>
      part !== status && part !== price && SPEC_PATTERN.test(part),
  );

  if (!status && specs.length === 0) {
    return { specs: [], blurb: body.trim() };
  }

  return {
    status,
    specs,
    price,
    blurb: rest.join(" ").trim(),
  };
}

function ListingCard({ listing }: { listing: Listing }): ReactElement {
  const content = (
    <>
      {listing.image ? (
        <div className="t-property-card-media">
          <SiteImage
            src={listing.image.src}
            alt={listing.image.alt || listing.title}
            width={listing.image.width}
            height={listing.image.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            aspectClassName="h-full w-full"
            className={`t-property-card-image ${
              listing.image.className ?? ""
            }`.trim()}
          />
          {listing.status ? (
            <span className="t-property-card-flag">{listing.status}</span>
          ) : null}
        </div>
      ) : null}

      <div className="t-property-card-body">
        {!listing.image && listing.status ? (
          <p className="t-property-eyebrow t-property-card-status">
            {listing.status}
          </p>
        ) : null}

        <h3 className="t-property-card-title">{listing.title}</h3>

        {listing.specs.length > 0 || Boolean(listing.price) ? (
          <div className="t-property-card-meta">
            <ul className="t-property-card-specs">
              {listing.specs.map((spec) => (
                <li key={spec} className="t-property-card-spec">
                  {spec}
                </li>
              ))}
            </ul>
            {listing.price ? (
              <p className="t-property-price t-property-card-price">
                {listing.price}
              </p>
            ) : null}
          </div>
        ) : null}

        {listing.blurb ? (
          <p className="t-property-card-blurb">{listing.blurb}</p>
        ) : null}
      </div>
    </>
  );

  return (
    <li className="t-property-card">
      {listing.href ? (
        <Link className="t-property-card-link" href={listing.href}>
          {content}
        </Link>
      ) : (
        <div className="t-property-card-link">{content}</div>
      )}
    </li>
  );
}

export function FeatureGrid({
  eyebrow,
  title,
  items,
}: FeatureGridProps): ReactElement {
  const listings: Listing[] = items.map((item) => ({
    ...item,
    image: readListingImage(item),
    ...parseListing(item.body),
  }));

  return (
    <section className="t-property-feature">
      <div className="t-property-container">
        {eyebrow || title ? (
          <div className="t-property-feature-head">
            {eyebrow ? <p className="t-property-eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className="t-property-display t-property-feature-title reveal">
                {title}
              </h2>
            ) : null}
          </div>
        ) : null}

        <ul className="t-property-grid">
          {listings.map((listing) => (
            <ListingCard
              key={listing.href ?? `${listing.title}-${listing.blurb}`}
              listing={listing}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
