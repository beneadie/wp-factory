import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CtaBand,
  FeatureGrid,
  PageHead,
  QuoteBand,
  ctaBandFixture,
  featureGridFixture,
  pageHeadFixture,
  quoteBandFixture,
} from "@/template-sections";

/**
 * The thin-page sample: PageHead, a list, a quote and a closing action.
 *
 * Use it to judge the archetype that most often looks unfinished when a
 * captured WordPress page has little body copy: a deliberate title, one
 * hairline and a link row, then ordinary sections beneath.
 *
 * Never public. 404s in production unless STYLEGUIDE=1, same guard as demo.
 */
export const metadata: Metadata = {
  title: "Sample inner page",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function DemoInnerPage() {
  if (process.env.NODE_ENV === "production" && process.env.STYLEGUIDE !== "1") {
    notFound();
  }

  return (
    <>
      <PageHead {...pageHeadFixture} />
      <FeatureGrid {...featureGridFixture} />
      <QuoteBand {...quoteBandFixture} />
      <CtaBand {...ctaBandFixture} />
    </>
  );
}
