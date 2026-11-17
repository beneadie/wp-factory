/**
 * Realistic fixtures for the styleguide and for local development.
 *
 * A fictional Dublin electrician, so every section is judged at the length a
 * real Irish trade site actually uses: a long eyebrow with a Dublin postcode,
 * a two-sentence lede, six services with a price or response promise, a
 * customer quote that names an area.
 *
 * The photographs are free-licence styleguide stand-ins (Unsplash, Pexels).
 * They are not the template's product: an adapter replaces every one of them
 * with the client's own job photography, with real captions.
 */
import type {
  CtaBandProps,
  FeatureGridProps,
  HeroProps,
  PageHeadProps,
  QuoteBandProps,
  StatBandProps,
} from "@/lib/section-types";
import type { FeatureGridExtras } from "./feature-grid";

export const heroFixture: HeroProps = {
  eyebrow: "Emergency electricians · Dublin 7",
  title: "When the power goes, we go.",
  lede: "Fault-finding, rewires and fuse-board upgrades across the north city. A qualified electrician answers the phone, and most call-outs are sorted the same day.",
  primaryCta: { label: "Get a quote", href: "/contact/" },
  secondaryCta: { label: "Call 000 000 0000", href: "tel:+353000000000" },
  image: {
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&h=900&q=80",
    alt: "An electrician testing a distribution board during a call-out",
    width: 1600,
    height: 900,
  },
  variant: "full",
};

export const pageHeadFixture: PageHeadProps = {
  eyebrow: "Services",
  title: "Wiring, faults and upgrades.",
  links: [
    { label: "Emergency call-outs", href: "/services/emergency-call-outs/" },
    { label: "House rewires", href: "/services/house-rewires/" },
    { label: "Fuse boards & EV", href: "/services/fuse-boards-ev/" },
  ],
};

export const featureGridFixture: FeatureGridProps & FeatureGridExtras = {
  eyebrow: "What we do",
  title: "The jobs we are called for most.",
  items: [
    {
      title: "Emergency call-outs",
      body: "No power, tripping sockets or a burning smell — we aim to be there within the hour.",
      href: "/services/emergency-call-outs/",
    },
    {
      title: "House rewires",
      body: "Full and partial rewires in occupied homes, priced in writing before we start.",
      href: "/services/house-rewires/",
    },
    {
      title: "Fuse-board upgrades",
      body: "Old wire fuses replaced with RCBO protection, labelled and certified.",
      href: "/services/fuse-boards-ev/",
    },
    {
      title: "EV charger installation",
      body: "Home chargers fitted by Safe Electric registered electricians, grant paperwork included.",
      href: "/services/fuse-boards-ev/",
    },
    {
      title: "Lighting & sockets",
      body: "Extra sockets, garden lighting and the small jobs other electricians keep postponing.",
      href: "/services/lighting-sockets/",
    },
    {
      title: "Landlord certificates",
      body: "Periodic inspection reports for rented property, with the faults ranked in plain English.",
      href: "/services/landlord-certificates/",
    },
  ],
  evidence: {
    before: {
      src: "https://images.pexels.com/photos/38252522/pexels-photo-38252522.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
      alt: "An old fuse board with rewireable ceramic fuses and worn wooden backing",
      width: 1200,
      height: 900,
    },
    after: {
      src: "https://images.pexels.com/photos/28950842/pexels-photo-28950842.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
      alt: "A new distribution board with RCBO breakers, labelled and neatly wired",
      width: 1200,
      height: 900,
    },
    beforeLabel: "Before",
    afterLabel: "After",
    caption:
      "Cabra, Dublin 7 — an old fuse board replaced with RCBO protection, labelled and tested in a single day.",
  },
};

export const quoteBandFixture: QuoteBandProps = {
  quote:
    "The downstairs sockets had been tripping for months. Martin found water getting into an outside box, fixed it before lunch and did not charge us for the second visit.",
  attribution: "Aoife Kennedy · Stoneybatter, Dublin 7",
  cta: { label: "More customer stories", href: "/about/customer-stories/" },
};

export const ctaBandFixture: CtaBandProps = {
  title: "Something tripping that you cannot find?",
  body: "Tell us what is tripping, what has stopped working and where you are. We will tell you what it likely is, what it will cost and when we can get to you.",
  cta: { label: "Call 000 000 0000", href: "tel:+353000000000" },
};

export const statBandFixture: StatBandProps = {
  stats: [
    { value: "25", label: "Years trading" },
    { value: "1 hr", label: "Response time" },
    { value: "4", label: "Areas covered" },
  ],
};
