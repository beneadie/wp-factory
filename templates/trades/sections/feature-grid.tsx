import Link from "next/link";
import type { ReactElement } from "react";
import { SiteImage } from "@/components/site-image";
import type {
  FeatureGridProps,
  SectionImage,
} from "@/lib/section-types";

/**
 * Services as a hairline ledger, not a card grid: index, service, one-line
 * body, arrow. Six rows scan faster than six boxes and keep the page feeling
 * like a working document.
 *
 * The optional `evidence` prop is a purely presentational extra on top of the
 * shared contract. Leave it out and the section ends at the last row. Supply
 * it and two 4:3 job photographs sit side by side under the ledger with a
 * Before / After label and one shared caption. There is no slider and no JS.
 */
export interface FeatureGridEvidence {
  before: SectionImage;
  after: SectionImage;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
}

export interface FeatureGridExtras {
  /** Optional static before/after pair. Defaults to absent. */
  evidence?: FeatureGridEvidence;
}

type TradesFeatureGridProps = FeatureGridProps & FeatureGridExtras;

function EvidenceFigure({
  image,
  label,
}: {
  image: SectionImage;
  label: string;
}): ReactElement {
  return (
    <figure>
      <figcaption className="t-trades-evidence__label">{label}</figcaption>
      <SiteImage
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 768px) 50vw, 100vw"
        aspectClassName="aspect-[4/3]"
        className={`h-full w-full object-cover ${image.className ?? ""}`}
      />
    </figure>
  );
}

export function FeatureGrid({
  eyebrow,
  title,
  items,
  evidence,
}: TradesFeatureGridProps): ReactElement {
  return (
    <section className="t-trades-section">
      <div className="t-trades-shell">
        {eyebrow || title ? (
          <div className="t-trades-section-head">
            <div>
              {eyebrow ? (
                <p className="t-trades-eyebrow">{eyebrow}</p>
              ) : null}
              {title ? (
                <h2 className="t-trades-display t-trades-h3 t-trades-section-head__title">
                  {title}
                </h2>
              ) : null}
            </div>
            {items.length > 0 ? (
              <p className="t-trades-section-meta" aria-hidden="true">
                {String(items.length).padStart(2, "0")} services
              </p>
            ) : null}
          </div>
        ) : null}

        <ul className="t-trades-rows">
          {items.map((item, index) => {
            const row = (
              <>
                <span className="t-trades-row__num t-trades-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="t-trades-row__title">{item.title}</h3>
                <p className="t-trades-row__body">{item.body}</p>
                <span className="t-trades-row__arrow" aria-hidden="true">
                  →
                </span>
              </>
            );

            return (
              <li key={`${item.title}-${index}`}>
                {item.href ? (
                  <Link href={item.href} className="t-trades-row">
                    {row}
                  </Link>
                ) : (
                  <div className="t-trades-row">{row}</div>
                )}
              </li>
            );
          })}
        </ul>

        {evidence ? (
          <div className="t-trades-evidence">
            <div className="t-trades-evidence__pair">
              <EvidenceFigure
                image={evidence.before}
                label={evidence.beforeLabel ?? "Before"}
              />
              <EvidenceFigure
                image={evidence.after}
                label={evidence.afterLabel ?? "After"}
              />
            </div>
            {evidence.caption ? (
              <p className="t-trades-evidence__caption">{evidence.caption}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
