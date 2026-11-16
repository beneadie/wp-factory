import Link from "next/link";
import type { ReactElement } from "react";
import type { FeatureGridProps } from "@/lib/section-types";

type FeatureItem = FeatureGridProps["items"][number];
type DocumentItem = FeatureItem & { href: string };

const DOCUMENT_HREF = /\.(pdf|docx?|xlsx?|pptx?|rtf|zip|csv)$/i;

/**
 * A document row is an ordinary FeatureGrid item whose href points at a file.
 * Its `body` is the file size ("2.4 MB"); the type is read from the extension.
 * That keeps the document list props-in and lets the adapter add or drop a PDF
 * without touching this component.
 */
function isDocument(item: FeatureItem): item is DocumentItem {
  return (
    typeof item.href === "string" &&
    DOCUMENT_HREF.test(item.href.split(/[?#]/)[0])
  );
}

function documentMeta(href: string, body: string): string {
  const extension =
    href.split(/[?#]/)[0].split(".").pop()?.toUpperCase() ?? "FILE";
  const size = body.replace(/^[A-Z0-9]{2,5}\s*·\s*/i, "").trim();
  return `${extension} · ${size}`;
}

/**
 * Three ruled cards, no card borders and no shadows: a 1px top rule, serif
 * heading, short body. Documents are listed below the cards, one ruled row per
 * file with its type and size aligned right.
 */
export function FeatureGrid({
  eyebrow,
  title,
  items,
}: FeatureGridProps): ReactElement {
  const cards = items.filter((item) => !isDocument(item));
  const documents = items.filter(isDocument);

  return (
    <section className="t-community-section">
      <div className="t-community-container">
        {eyebrow || title ? (
          <div className="t-community-feature-head reveal">
            {eyebrow ? <p className="t-community-eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className="t-community-section-title">{title}</h2>
            ) : null}
          </div>
        ) : null}

        {cards.length > 0 ? (
          <ul className="t-community-feature-grid">
            {cards.map((item) => (
              <li
                key={`${item.title}-${item.href ?? "static"}`}
                className="t-community-feature-item"
                data-linked={item.href ? "true" : "false"}
              >
                {item.href ? (
                  <Link href={item.href} className="t-community-feature-link">
                    <h3 className="t-community-feature-item-title">
                      {item.title}
                    </h3>
                    <p className="t-community-feature-body">{item.body}</p>
                    <span className="t-community-feature-more">
                      Read more
                      <span aria-hidden="true" className="t-community-arrow">
                        →
                      </span>
                    </span>
                  </Link>
                ) : (
                  <>
                    <h3 className="t-community-feature-item-title">
                      {item.title}
                    </h3>
                    <p className="t-community-feature-body">{item.body}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        {documents.length > 0 ? (
          <div className="t-community-docs">
            <div className="t-community-docs-head">
              <h3 className="t-community-eyebrow">Documents</h3>
            </div>
            <ul className="t-community-docs-list">
              {documents.map((item) => (
                <li key={item.href} className="t-community-doc-row">
                  <Link href={item.href} className="t-community-doc-link">
                    <span className="t-community-doc-name">{item.title}</span>
                    <span className="t-community-doc-meta">
                      {documentMeta(item.href, item.body)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
