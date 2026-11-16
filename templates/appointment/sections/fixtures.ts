import type {
  CtaBandProps,
  FeatureGridProps,
  HeroProps,
  PageHeadProps,
  QuoteBandProps,
  StatBandProps,
} from "@/lib/section-types";

/* Fixtures for a small Dublin dental and physiotherapy clinic. Real treatment
   names, real fees, real waiting-room tone. Replace every string with the
   client's content; keep the shape. */

export const heroProps: HeroProps = {
  eyebrow: "Dublin 2 · Dental & physiotherapy",
  title: "Dentistry and physiotherapy, without the wait.",
  lede: "Same-week appointments with a small, unhurried team. Book online in under a minute, or call and we will find a time that fits around your day.",
  primaryCta: { label: "Book an appointment", href: "/book/" },
  secondaryCta: {
    label: "Call 01 676 2210",
    href: "tel:+35316762210",
  },
  variant: "split",
};

export const pageHeadProps: PageHeadProps = {
  eyebrow: "Treatments",
  title: "Everything we do, and what it costs.",
  links: [
    { label: "Dental care", href: "/treatments/dental/" },
    { label: "Physiotherapy", href: "/treatments/physiotherapy/" },
    { label: "Fees & payment", href: "/fees/" },
  ],
};

export const featureGridProps: FeatureGridProps = {
  eyebrow: "Treatments & fees",
  title: "A clear price before you sit down.",
  items: [
    {
      title: "New patient examination",
      body: "€65 · 40 min",
      href: "/treatments/new-patient-examination/",
    },
    {
      title: "Hygiene appointment",
      body: "€95 · 45 min",
      href: "/treatments/hygiene/",
    },
    {
      title: "Composite filling",
      body: "from €145 · 50 min",
      href: "/treatments/fillings/",
    },
    {
      title: "Root canal treatment",
      body: "from €420 · 90 min",
      href: "/treatments/root-canal-treatment/",
    },
    {
      title: "Porcelain crown",
      body: "from €850 · 60 min",
      href: "/treatments/crowns/",
    },
    {
      title: "Teeth whitening",
      body: "€320 · 60 min",
      href: "/treatments/teeth-whitening/",
    },
    {
      title: "Physiotherapy assessment",
      body: "€75 · 45 min",
      href: "/treatments/physiotherapy-assessment/",
    },
    {
      title: "Sports injury follow-up",
      body: "€55 · 30 min",
      href: "/treatments/sports-injury-physiotherapy/",
    },
  ],
};

export const quoteBandProps: QuoteBandProps = {
  quote:
    "I had put off the dentist for three years. Nobody made me feel foolish for it — they made a plan, explained the cost, and got started.",
  attribution: "Aoife D. · Ranelagh · Patient since 2023",
};

export const statBandProps: StatBandProps = {
  stats: [
    {
      value: "4.9/5",
      label: "Average rating from 180 verified patient reviews",
    },
    {
      value: "48 hrs",
      label: "Typical wait for a new appointment",
    },
    {
      value: "18 yrs",
      label: "In practice on Merrion Row",
    },
  ],
};

export const ctaBandProps: CtaBandProps = {
  title: "Your first appointment is the easy part.",
  body: "Tell us what is bothering you and when you are free. We will confirm by text, usually within one working hour. Prefer to talk? Call 01 676 2210.",
  cta: { label: "Check availability", href: "/book/" },
};

export const fixtures = {
  Hero: heroProps,
  PageHead: pageHeadProps,
  FeatureGrid: featureGridProps,
  QuoteBand: quoteBandProps,
  CtaBand: ctaBandProps,
  StatBand: statBandProps,
};

/* Names the shared styleguide imports. Keep them in step with props above. */
export const heroFixture = heroProps;
export const pageHeadFixture = pageHeadProps;
export const featureGridFixture = featureGridProps;
export const quoteBandFixture = quoteBandProps;
export const ctaBandFixture = ctaBandProps;
export const statBandFixture = statBandProps;

