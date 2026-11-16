import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import type { SectionImage } from "@/lib/section-types";
import {
  CtaBand,
  FeatureGrid,
  Hero,
  PageHead,
  QuoteBand,
  StatBand,
  ctaBandFixture,
  featureGridFixture,
  heroFixture,
  pageHeadFixture,
  quoteBandFixture,
  statBandFixture,
} from "@/template-sections";

/**
 * The styleguide: one page that renders every token, every prose element and
 * all six sections. It is the acceptance surface for a template overlay — if
 * it reads well here, the overlay is done.
 *
 * Never public. In production it 404s unless STYLEGUIDE=1 is set, so a client
 * site can never leak the design system by accident.
 */
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const colorTokens: { name: string; value: string; note: string; onDark?: boolean }[] = [
  { name: "--color-bg", value: "250 248 244", note: "Page" },
  { name: "--color-surface", value: "243 240 233", note: "Recessed band" },
  { name: "--color-elevated", value: "255 255 255", note: "Card" },
  { name: "--color-text", value: "20 20 20", note: "Body copy", onDark: true },
  { name: "--color-muted", value: "107 107 102", note: "Secondary copy", onDark: true },
  { name: "--color-border", value: "230 226 218", note: "Hairline" },
  { name: "--color-primary", value: "20 20 20", note: "Primary action", onDark: true },
  { name: "--color-accent", value: "180 85 45", note: "Brand accent", onDark: true },
  { name: "--color-accent-ink", value: "255 255 255", note: "On accent" },
  { name: "--color-inverse-bg", value: "28 28 26", note: "Inverse band", onDark: true },
  { name: "--color-inverse-text", value: "245 242 236", note: "On inverse" },
];

const typeTokens: { name: string; value: string; sample: string }[] = [
  { name: "--text-xs", value: "12px", sample: "Wine Street, Sligo" },
  { name: "--text-sm", value: "14px", sample: "Annual return due 28 November" },
  { name: "--text-base", value: "17px", sample: "Body copy at seventeen pixels." },
  { name: "--text-lg", value: "20px", sample: "Lede paragraph" },
  { name: "--text-xl", value: "24px", sample: "Section subhead" },
  { name: "--text-2xl", value: "28px", sample: "Small section title" },
  { name: "--text-3xl", value: "clamp 32–44px", sample: "Accounts that make sense" },
  { name: "--text-4xl", value: "clamp 38–56px", sample: "Tax & compliance" },
  { name: "--text-5xl", value: "clamp 46–72px", sample: "A busy year" },
  { name: "--text-6xl", value: "clamp 54–88px", sample: "Sligo" },
];

const spaceTokens: { name: string; value: string }[] = [
  { name: "--space-1", value: "4px" },
  { name: "--space-2", value: "8px" },
  { name: "--space-3", value: "12px" },
  { name: "--space-4", value: "16px" },
  { name: "--space-6", value: "24px" },
  { name: "--space-8", value: "32px" },
  { name: "--space-10", value: "40px" },
  { name: "--space-12", value: "48px" },
  { name: "--space-16", value: "64px" },
  { name: "--space-20", value: "80px" },
];

const radiusTokens: { name: string; value: string }[] = [
  { name: "--radius-sm", value: "4px" },
  { name: "--radius-md", value: "8px" },
  { name: "--radius-lg", value: "16px" },
  { name: "--radius-pill", value: "999px" },
];

const motionTokens: { name: string; value: string }[] = [
  { name: "--ease-out", value: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { name: "--ease-in-out", value: "cubic-bezier(0.65, 0, 0.35, 1)" },
  { name: "--duration-micro", value: "140ms" },
  { name: "--duration-fast", value: "240ms" },
  { name: "--duration-base", value: "420ms" },
  { name: "--duration-slow", value: "700ms" },
  { name: "--duration-ambient", value: "8s" },
];

const capturedIntroHtml = `
<section class="de-100pc-container de-bg-grey">
  <div class="de-fw-container de-intro">
    <div class="de-intro-content">
      <h2>We can advise you on</h2>
      <p></p>
      <li>Whether to trade as a sole trader, a partnership or a limited company.</li>
      <li>The different tax rates, administration levels and reliefs that come with each.</li>
      <li>What you must register for, and in what order, before your first invoice.</li>
    </div>
  </div>
</section>
<section class="de-100pc-container">
  <div class="de-fw-container">
    <div class="de-section-head">
      <h3>Registration and taxes</h3>
      <p>One of the first considerations is what you need to register for, and when. You may need any or all of the following:</p>
      <ul>
        <li>Income Tax</li>
        <li>Corporation Tax</li>
        <li>VAT</li>
        <li>Payroll (PAYE)</li>
        <li>Relevant Contracts Tax</li>
      </ul>
      We can advise you on which taxes apply to your trade and help with the registration itself.
    </div>
  </div>
</section>
`;

const capturedFeesHtml = `
<div class="de-fw-container">
  <h3>Fees for the 2026 return</h3>
  <table>
    <caption>Indicative fees, exclusive of VAT and outlay.</caption>
    <thead>
      <tr><th>Service</th><th>Basis</th><th>From</th></tr>
    </thead>
    <tbody>
      <tr><td>Sole trader accounts</td><td>Annual</td><td>€450</td></tr>
      <tr><td>Limited company accounts</td><td>Annual</td><td>€1,150</td></tr>
      <tr><td>Payroll, up to five staff</td><td>Monthly</td><td>€60</td></tr>
      <tr><td>VAT return, bi-monthly</td><td>Per return</td><td>€95</td></tr>
    </tbody>
  </table>
  <p>Fees depend on the number of transactions and the state of your records. We quote in writing before any work begins.</p>
  <form>
    <label for="captured-email">Email address</label>
    <input id="captured-email" name="email" type="email" placeholder="you@example.ie" />
    <label for="captured-message">What do you need help with?</label>
    <textarea id="captured-message" name="message"></textarea>
    <button type="submit">Send enquiry</button>
  </form>
</div>
`;

const heroSlotSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200"><rect width="1600" height="1200" fill="rgb(243,240,233)"/><rect x="64" y="64" width="1472" height="1072" fill="none" stroke="rgb(230,226,218)" stroke-width="3"/><text x="800" y="620" font-family="Georgia, serif" font-size="54" fill="rgb(107,107,102)" text-anchor="middle">Photo slot · 4:3</text></svg>`;

/** A drawn slot, so the styleguide never depends on a file that is not there. */
const heroSlot: SectionImage = {
  src: `data:image/svg+xml,${encodeURIComponent(heroSlotSvg)}`,
  alt: "Placeholder frame for the practice photograph",
  width: 1600,
  height: 1200,
};

function Demo({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}): ReactElement {
  return (
    <section className="border-t border-border py-14 first:border-t-0">
      <div className="max-w-measure">
        <h2 className="font-display text-2xl leading-display text-text">{title}</h2>
        {note ? <p className="mt-3 text-sm leading-body text-muted">{note}</p> : null}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function StyleguidePage(): ReactElement {
  if (process.env.NODE_ENV === "production" && process.env.STYLEGUIDE !== "1") {
    notFound();
  }

  return (
    <div className={fontVariables}>
      <div className="container-page py-14">
        <header className="border-b border-border pb-12">
          <p className="eyebrow">
            Design system · {process.env.TEMPLATE ?? "neutral base"}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-display tracking-[-0.02em] text-text">
            Styleguide
          </h1>
          <p className="mt-6 max-w-measure text-lg leading-body text-muted">
            Every token, every prose element and all six sections on one page.
            Copy is from a fictional accountancy practice in Sligo so the type is
            judged at the length a real Irish small business uses.
          </p>
          <p className="mt-4 text-sm leading-body text-muted">
            Not public: this route returns 404 in production unless{" "}
            <code className="font-mono text-text">STYLEGUIDE=1</code> is set.
          </p>
        </header>

        <Demo
          title="Colour"
          note="Tokens hold space-separated sRGB channels. Override the channel triple in theme.css; never a hex value and never the name."
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {colorTokens.map((token) => (
              <li
                key={token.name}
                className="overflow-hidden rounded-md border border-border"
              >
                <div
                  className={`flex h-20 items-end p-3 text-xs ${
                    token.onDark ? "text-inverse-text" : "text-text"
                  }`}
                  style={{ backgroundColor: `rgb(var(${token.name}))` }}
                >
                  {token.note}
                </div>
                <div className="bg-elevated px-3 py-2">
                  <p className="font-mono text-xs text-text">{token.name}</p>
                  <p className="font-mono text-xs text-muted">{token.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </Demo>

        <Demo
          title="Type scale"
          note="Fixed below 2xl, fluid above it. Display sizes are clamped so a long placename never wraps four ways."
        >
          <dl className="divide-y divide-border border-y border-border">
            {typeTokens.map((token) => (
              <div key={token.name} className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr] sm:items-baseline">
                <dt className="font-mono text-xs text-muted">{token.name}</dt>
                <dd
                  className="text-text"
                  style={{ fontSize: `var(${token.name})` }}
                >
                  {token.sample}{" "}
                  <span className="align-middle font-mono text-xs text-muted">
                    {token.value}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Demo>

        <Demo title="Fonts" note="Inter for UI and body, Source Serif 4 for display. No script, no cursive, no italic display face.">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-elevated p-6">
              <p className="eyebrow">--font-display</p>
              <p className="mt-3 font-display text-3xl leading-display">
                Loughran &amp; Company
              </p>
              <p className="mt-2 font-mono text-xs text-muted">Source Serif 4 · 400/500/600</p>
            </div>
            <div className="rounded-md border border-border bg-elevated p-6">
              <p className="eyebrow">--font-sans</p>
              <p className="mt-3 text-3xl leading-body">Loughran &amp; Company</p>
              <p className="mt-2 font-mono text-xs text-muted">Inter · 400/500/600</p>
            </div>
          </div>
        </Demo>

        <Demo title="Space" note="A strict 4px scale, space-1 to space-20. Nothing in between.">
          <ul className="grid gap-2">
            {spaceTokens.map((token) => (
              <li key={token.name} className="flex items-center gap-4">
                <span className="w-24 shrink-0 font-mono text-xs text-muted">
                  {token.name}
                </span>
                <span className="h-2 rounded-sm bg-accent" style={{ width: `var(${token.name})` }} />
                <span className="font-mono text-xs text-muted">{token.value}</span>
              </li>
            ))}
          </ul>
        </Demo>

        <Demo title="Radius, rules and motion" note="Rules are 1px borders. There are no shadows in this system.">
          <div className="flex flex-wrap items-end gap-6">
            {radiusTokens.map((token) => (
              <div key={token.name}>
                <div
                  className="h-16 w-28 border border-border bg-elevated"
                  style={{ borderRadius: `var(${token.name})` }}
                />
                <p className="mt-2 font-mono text-xs text-muted">
                  {token.name} · {token.value}
                </p>
              </div>
            ))}
            <div className="w-full max-w-md">
              <div style={{ borderTop: "var(--rule)" }} />
              <p className="mt-2 font-mono text-xs text-muted">--rule · 1px solid --color-border</p>
            </div>
          </div>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {motionTokens.map((token) => (
              <li key={token.name} className="flex justify-between gap-4 border-b border-border py-2">
                <span className="font-mono text-xs text-text">{token.name}</span>
                <span className="font-mono text-xs text-muted">{token.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="reveal rounded-md border border-border bg-elevated px-6 py-4 text-sm">
              .reveal · 12px rise, 420ms
            </div>
            <div className="reveal-image overflow-hidden rounded-md border border-border bg-surface px-6 py-4 text-sm">
              .reveal-image · clip-path wipe, 700ms
            </div>
          </div>
        </Demo>

        <Demo
          title="Prose"
          note="The .wp-prose layer, with no theme stylesheet behind it. Sixty-eight character measure, 17px at 1.6, serif h1 and h2."
        >
          <div className="wp-prose">
            <h1>Starting out in business</h1>
            <p>
              You have taken a bold step. Most of the questions that arrive in the
              first year are about <strong>registration, records and cash</strong>,
              and almost all of them are easier to answer before you trade than
              after.
            </p>
            <h2>What you need before your first invoice</h2>
            <p>
              A sole trader registers with Revenue. A limited company registers
              with the CRO first, then Revenue, then the bank. The order matters:
              file the wrong form first and you will spend a fortnight undoing it.
              Read the note on{" "}
              <Link href="/services/company-secretarial/">company secretarial</Link>{" "}
              if the second route is yours.
            </p>
            <h3>Records that survive an audit</h3>
            <p>
              Keep the invoice, the bank line and the receipt. If two of the three
              exist, the expense is usually defensible. <em>Usually</em> is doing
              a lot of work in that sentence.
            </p>
            <h4>Payroll</h4>
            <p>
              Monthly payroll is due on the fifteenth. Weekly payroll is due on
              the day. Both are late if the submission is late, not the payment.
            </p>
            <h5>Revenue correspondence</h5>
            <p>
              Open it the day it arrives. Most letters carry a 14-day window.
            </p>
            <h6>Small print</h6>
            <p>
              This page is a type specimen, not advice. Talk to a practitioner
              about your own facts.
            </p>

            <h3>Lists</h3>
            <ul>
              <li>Tax registration: Income Tax, VAT, PAYE, RCT.</li>
              <li>
                Statutory filings:
                <ul>
                  <li>Annual return and accounts to the CRO.</li>
                  <li>Corporation Tax return to Revenue.</li>
                </ul>
              </li>
              <li>Records: sales, purchases, bank, payroll.</li>
            </ul>
            <ol>
              <li>Incorporate the company.</li>
              <li>
                Register for tax:
                <ol>
                  <li>Employer registration with Revenue.</li>
                  <li>VAT registration if turnover crosses the threshold.</li>
                </ol>
              </li>
              <li>Open the bank account and keep it separate.</li>
            </ol>

            <blockquote>
              <p>
                We arrived with a shoebox of receipts and a lot of apologising.
                Eight years on, the year-end meeting takes forty minutes.
              </p>
              <cite>Mairéad Ní Bhriain, Cloonagh Joinery</cite>
            </blockquote>

            <dl>
              <dt>Measure</dt>
              <dd>Sixty-eight characters, about twelve words a line.</dd>
              <dt>Rhythm</dt>
              <dd>Twenty-four pixels between blocks, forty above a heading.</dd>
            </dl>

            <hr />

            <p>
              <small>Small print sits at fourteen pixels in muted ink.</small>
            </p>
            <p>
              Inline <code>code</code> and a rule above. Nothing here uses a
              shadow.
            </p>
          </div>
        </Demo>

        <Demo title="Table" note="Tabular numerals, 1px rules, no zebra striping.">
          <div className="wp-prose">
            <table>
              <caption>Indicative fees for the 2026 return.</caption>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Basis</th>
                  <th scope="col">From</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sole trader accounts</td>
                  <td>Annual</td>
                  <td>€450</td>
                </tr>
                <tr>
                  <td>Limited company accounts</td>
                  <td>Annual</td>
                  <td>€1,150</td>
                </tr>
                <tr>
                  <td>Payroll, up to five staff</td>
                  <td>Monthly</td>
                  <td>€60</td>
                </tr>
                <tr>
                  <td>VAT return, bi-monthly</td>
                  <td>Per return</td>
                  <td>€95</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Demo>

        <Demo
          title="Form"
          note="Labels above fields, 4px radius, hairline borders. Focus uses the global ring; nothing is removed from the tab order."
        >
          <form className="max-w-measure">
            <label htmlFor="sg-name" className="block text-sm font-medium">
              Your name
            </label>
            <input
              id="sg-name"
              name="name"
              type="text"
              placeholder="Mairéad Ní Bhriain"
              className="field mt-2"
            />
            <label htmlFor="sg-email" className="mt-6 block text-sm font-medium">
              Email address
            </label>
            <input
              id="sg-email"
              name="email"
              type="email"
              placeholder="you@example.ie"
              className="field mt-2"
            />
            <label htmlFor="sg-topic" className="mt-6 block text-sm font-medium">
              What do you need help with?
            </label>
            <select id="sg-topic" name="topic" className="field mt-2">
              <option>Year-end accounts</option>
              <option>Payroll</option>
              <option>VAT and RCT</option>
              <option>Something else</option>
            </select>
            <label htmlFor="sg-message" className="mt-6 block text-sm font-medium">
              Anything we should know
            </label>
            <textarea id="sg-message" name="message" rows={4} className="field mt-2" />
            <div className="mt-4 flex items-center gap-3">
              <input id="sg-consent" name="consent" type="checkbox" />
              <label htmlFor="sg-consent" className="text-sm text-muted">
                I am happy to be contacted about this enquiry.
              </label>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="btn-primary">
                Send enquiry
              </button>
              <button type="button" className="btn-outline">
                Save for later
              </button>
            </div>
          </form>
          <p className="mt-6 text-sm leading-body text-muted">
            The form posts nowhere in the styleguide. Real forms go through a BFF
            route handler; WordPress is never mutated from render code.
          </p>
        </Demo>

        <Demo title="Figure" note="An image slot always reserves its ratio and is never blank.">
          <figure className="max-w-measure">
            <div className="image-placeholder flex aspect-[4/3] items-center justify-center rounded-md border border-border">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">
                Image slot · 4:3
              </span>
            </div>
            <figcaption className="mt-3 text-sm leading-body text-muted">
              The office on Wine Street, Sligo. Captions sit at fourteen pixels,
              three quarters of a space step below the frame.
            </figcaption>
          </figure>
        </Demo>

        <Demo
          title="Buttons"
          note="Primary, outline, inverse and outline-inverse. Disabled is a real disabled attribute, not a colour."
        >
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="btn-primary">
              Book a first call
            </button>
            <button type="button" className="btn-outline">
              See our services
            </button>
            <button type="button" className="btn" disabled>
              Disabled
            </button>
            <button type="button" className="btn-primary opacity-40" disabled>
              Unavailable
            </button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-md bg-inverse-bg p-6">
            <button type="button" className="btn-inverse">
              Arrange a call
            </button>
            <button type="button" className="btn-outline-inverse">
              Read client stories
            </button>
          </div>
          <p className="mt-6 text-sm leading-body text-muted">
            Hover, active and focus-visible states are live: tab through the row
            above and hold the pointer over a button. Focus paints the accent ring
            from globals.css; hover darkens the fill.
          </p>
        </Demo>

        <Demo
          title="Captured WordPress HTML"
          note="Exactly what the theme emits, with no theme stylesheet: bare list items, an empty paragraph, a text node straight inside a div."
        >
          <div className="wp-prose" dangerouslySetInnerHTML={{ __html: capturedIntroHtml }} />
          <div
            className="wp-prose mt-12"
            dangerouslySetInnerHTML={{ __html: capturedFeesHtml }}
          />
        </Demo>

        <section className="border-t border-border py-14">
          <div className="max-w-measure">
            <h2 className="font-display text-2xl leading-display text-text">Sections</h2>
            <p className="mt-3 text-sm leading-body text-muted">
              The six components every template provides, rendered from the
              shared defaults in @/template-sections. Each label names the
              variant; the image in the hero is a generated slot, not a photo.
            </p>
          </div>
        </section>
      </div>

      <div className="container-page py-2">
        <p className="eyebrow">Hero · split</p>
      </div>
      <Hero {...heroFixture} image={heroSlot} />

      <div className="container-page py-2">
        <p className="eyebrow">Hero · centered</p>
      </div>
      <Hero
        eyebrow="Chartered accountants · Sligo"
        title="Forty minutes at year-end, not four weeks."
        lede="One practice, twelve streets from the office you already know."
        primaryCta={{ label: "Book a first call", href: "/contact/" }}
        variant="centered"
      />

      <div className="container-page py-2">
        <p className="eyebrow">Hero · full</p>
      </div>
      <Hero
        {...heroFixture}
        image={heroSlot}
        title="A busy year, filed on time."
        lede="Year-end accounts, payroll and VAT for family businesses across the north west."
        variant="full"
      />

      <div className="container-page py-2">
        <p className="eyebrow">PageHead · thin page, no body copy, no image</p>
      </div>
      <PageHead {...pageHeadFixture} />

      <div className="container-page py-2">
        <p className="eyebrow">FeatureGrid</p>
      </div>
      <FeatureGrid {...featureGridFixture} />

      <div className="container-page py-2">
        <p className="eyebrow">QuoteBand</p>
      </div>
      <QuoteBand {...quoteBandFixture} />

      <div className="container-page py-2">
        <p className="eyebrow">StatBand</p>
      </div>
      <StatBand {...statBandFixture} />

      <div className="container-page py-2">
        <p className="eyebrow">CtaBand</p>
      </div>
      <CtaBand {...ctaBandFixture} />
    </div>
  );
}
