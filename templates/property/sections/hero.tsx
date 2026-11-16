import Link from "next/link";
import type { ReactElement } from "react";
import { SiteImage } from "@/components/site-image";
import type { HeroProps } from "@/lib/section-types";

/**
 * The property hero: a full-bleed 16:9 listing photograph, the house's story
 * on the lower left, and a real search strip that overlaps the photograph's
 * bottom edge by 40px.
 *
 * The strip is one bordered object with four labelled fields and one accent
 * button. It is a plain GET form, so it works before any JavaScript loads.
 */

type SearchField =
  | {
      id: string;
      name: string;
      label: string;
      kind: "text";
      placeholder: string;
    }
  | {
      id: string;
      name: string;
      label: string;
      kind: "select";
      options: string[];
    };

const searchFields: SearchField[] = [
  {
    id: "property-location",
    name: "location",
    label: "Location",
    kind: "text",
    placeholder: "Town or county",
  },
  {
    id: "property-type",
    name: "type",
    label: "Property type",
    kind: "select",
    options: [
      "All types",
      "Detached house",
      "Semi-detached",
      "Townhouse",
      "Apartment",
      "Bungalow",
      "Farmhouse",
      "Site",
    ],
  },
  {
    id: "property-price",
    name: "price",
    label: "Price",
    kind: "select",
    options: [
      "Any price",
      "Up to €300k",
      "€300k–€450k",
      "€450k–€650k",
      "€650k–€850k",
      "€850k+",
    ],
  },
  {
    id: "property-beds",
    name: "beds",
    label: "Bedrooms",
    kind: "select",
    options: ["Any beds", "2+ beds", "3+ beds", "4+ beds", "5+ beds"],
  },
];

function PropertySearch(): ReactElement {
  return (
    <form
      className="t-property-search"
      action="/properties/"
      method="get"
      role="search"
      aria-label="Search properties"
    >
      {searchFields.map((field) => (
        <div key={field.id} className="t-property-search-field">
          <label className="t-property-search-label" htmlFor={field.id}>
            {field.label}
          </label>
          {field.kind === "text" ? (
            <input
              className="t-property-input"
              id={field.id}
              name={field.name}
              type="text"
              placeholder={field.placeholder}
              autoComplete="address-level2"
            />
          ) : (
            <div className="t-property-select-wrap">
              <select
                className="t-property-select"
                id={field.id}
                name={field.name}
                defaultValue=""
              >
                {field.options.map((option) => (
                  <option
                    key={option}
                    value={option === field.options[0] ? "" : option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}
      <button className="t-property-search-submit" type="submit">
        Search
        <span className="t-property-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </form>
  );
}

export function Hero({
  eyebrow,
  title,
  lede,
  primaryCta,
  secondaryCta,
  image,
  variant = "split",
}: HeroProps): ReactElement {
  const centered = variant === "centered";
  const showImage = Boolean(image) && !centered;
  const onDark = showImage;
  const linkClass = onDark
    ? "t-property-link t-property-link-on-dark"
    : "t-property-link";

  const copy = (
    <>
      {eyebrow ? (
        <p
          className={`t-property-eyebrow${
            onDark ? " t-property-eyebrow-on-dark" : ""
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1 className="t-property-display t-property-hero-title reveal">
        {title}
      </h1>
      {lede ? <p className="t-property-hero-lede">{lede}</p> : null}
      {primaryCta || secondaryCta ? (
        <div className="t-property-hero-actions">
          {primaryCta ? (
            <Link className={linkClass} href={primaryCta.href}>
              {primaryCta.label}
              <span className="t-property-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link className={linkClass} href={secondaryCta.href}>
              {secondaryCta.label}
              <span className="t-property-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );

  return (
    <section
      className={`t-property-hero${
        showImage ? "" : " t-property-hero-plain"
      }${centered ? " t-property-hero-centered" : ""}`}
    >
      {showImage && image ? (
        <div className="t-property-hero-media">
          <div className="t-property-hero-figure">
            <SiteImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              sizes="100vw"
              aspectClassName="h-full w-full"
              className={`t-property-hero-image ${image.className ?? ""}`.trim()}
            />
          </div>
          <div className="t-property-hero-scrim" aria-hidden="true" />
          <div className="t-property-hero-copy">
            <div className="t-property-container">{copy}</div>
          </div>
        </div>
      ) : (
        <div className="t-property-hero-plain-inner">
          <div className="t-property-container">{copy}</div>
        </div>
      )}

      <div className="t-property-container t-property-search-wrap">
        <PropertySearch />
      </div>
    </section>
  );
}
