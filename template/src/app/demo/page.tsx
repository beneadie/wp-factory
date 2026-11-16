import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CtaBand,
  FeatureGrid,
  Hero,
  QuoteBand,
  StatBand,
  ctaBandFixture,
  featureGridFixture,
  heroFixture,
  quoteBandFixture,
  statBandFixture,
} from "@/template-sections";
import { SiteImage } from "@/components/site-image";
import { site } from "@/config/site";

/**
 * A composed sample page, not a component catalogue.
 *
 * The styleguide proves every token and section in isolation; this route shows
 * what a client actually receives: hero, proof, services, a stated promise, a
 * closing action, and a block of captured WordPress HTML under the prose layer.
 * Use it to judge density and rhythm — the styleguide is deliberately sparse.
 *
 * Never public. 404s in production unless STYLEGUIDE=1, same guard as the
 * styleguide itself.
 */
export const metadata: Metadata = {
  title: "Sample page",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const nav = [
  { label: "Services", href: "#services" },
  { label: "Our approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

export default function DemoPage() {
  if (process.env.NODE_ENV === "production" && process.env.STYLEGUIDE !== "1") {
    notFound();
  }

  return (
    <>
      <Hero
        {...heroFixture}
        primaryCta={{ label: "Book a first call", href: "#contact" }}
        secondaryCta={{ label: "See how we work", href: "#approach" }}
      />

      <StatBand {...statBandFixture} />

      <div id="services">
        <FeatureGrid {...featureGridFixture} />
      </div>

      <QuoteBand {...quoteBandFixture} />

      <section id="approach" className="container-page py-16 sm:py-24">
        <div className="grid gap-10 sm:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] sm:items-start">
          <div className="wp-prose reveal">
            <p className="eyebrow">Our approach</p>
            <h2>Advice that holds up on a bad day, not just a good one.</h2>
            <p>
              Most practices tell you what the numbers say. We tell you what they
              mean for the decision in front of you — hiring, borrowing, selling,
              or simply sleeping better in December.
            </p>
            <p>
              We work in plain language, we answer the phone, and we tell you when
              something is not worth doing. That is the whole method.
            </p>
            <ul>
              <li>Fixed fees agreed before any work starts.</li>
              <li>One named contact, not a shared inbox.</li>
              <li>Year-end filed in weeks, not quarters.</li>
            </ul>
          </div>
          <figure className="reveal-image">
            <SiteImage
              src="https://picsum.photos/seed/demo-approach/1200/1500"
              alt="A partner reviewing accounts with a client"
              width={1200}
              height={1500}
              sizes="(min-width: 640px) 40vw, 100vw"
              aspectClassName="aspect-[4/5] w-full"
              className="h-full w-full object-cover"
            />
            <figcaption className="mt-3 text-xs text-muted">
              Sample imagery — replaced with the client&apos;s own photography.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="container-page flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-sm text-muted">
            {site.name} · Chartered accountants · Mon–Fri, 9–5:30
          </p>
          <nav aria-label="Sample page" className="flex flex-wrap gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div id="contact">
        <CtaBand {...ctaBandFixture} />
      </div>
    </>
  );
}
