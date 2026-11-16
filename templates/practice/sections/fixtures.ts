import type {
  CtaBandProps,
  PageHeadProps,
  QuoteBandProps,
} from "@/lib/section-types";
import type { PracticeFeatureGridProps } from "./feature-grid";
import type { PracticeHeroProps } from "./hero";
import type { PracticeStatBandProps } from "./stat-band";

/**
 * Fixtures for an Irish accountancy practice. Real sentences, real service
 * names, a real address and a real regulator. A design pass replaces the copy;
 * the composition and the rhythm stay.
 */

export const heroProps: PracticeHeroProps = {
  eyebrow: "Chartered accountants · Dublin 2",
  title: "Steady Counsel for Businesses Built to Last",
  lede:
    "Hartnett Lyle is a partner-led practice advising Irish companies, families and their advisers. We keep the client list deliberately short, so the person you meet is the person who does the work.",
  primaryCta: { label: "Request a consultation", href: "/contact/" },
  secondaryCta: { label: "Meet the partners", href: "/people/partners/" },
  image: {
    src: "https://picsum.photos/seed/fitzwilliam-square/1200/1500",
    alt: "The first-floor drawing room at 12 Fitzwilliam Square, Dublin, in late afternoon light",
    width: 1000,
    height: 1250,
  },
  imageCaption:
    "12 Fitzwilliam Square, Dublin 2. The practice has worked from this address since 1987.",
  variant: "split",
};

export const pageHeadProps: PageHeadProps = {
  eyebrow: "The practice",
  title: "Our People",
  links: [
    { label: "Our partners", href: "/people/partners/" },
    { label: "The team", href: "/people/team/" },
    { label: "Careers", href: "/careers/" },
  ],
};

export const featureGridProps: PracticeFeatureGridProps = {
  eyebrow: "Services",
  title: "Advice That Begins with the Business, Not the Balance Sheet",
  items: [
    {
      title: "Audit & Assurance",
      body:
        "Statutory audits, independent reviews and the assurance a bank or investor expects, delivered by the partner who signs the opinion.",
      href: "/services/audit-and-assurance/",
    },
    {
      title: "Tax Advisory",
      body:
        "Corporation tax, capital gains, VAT and cross-border questions, planned before a transaction closes rather than after it.",
      href: "/services/tax-advisory/",
    },
    {
      title: "Corporate Finance",
      body:
        "Buy-outs, acquisitions and succession, from valuation and funding through to the negotiation of heads of terms.",
      href: "/services/corporate-finance/",
    },
    {
      title: "Private Client",
      body:
        "Personal tax, estate planning and family governance for owner-managers and the families behind them.",
      href: "/services/private-client/",
    },
    {
      title: "Restructuring",
      body:
        "Practical options for companies under pressure, worked through with lenders, creditors and, where necessary, the courts.",
      href: "/services/restructuring/",
    },
    {
      title: "Payroll & Compliance",
      body:
        "Monthly payroll, Revenue returns and company secretarial work, handled quietly and on time.",
      href: "/services/payroll-and-compliance/",
    },
  ],
};

export const quoteBandProps: QuoteBandProps = {
  quote:
    "They understood the business before they offered a view on it. When we sold the company, most of the difficult questions had been settled long before we reached the room.",
  attribution: "Aoife Ní Bhriain — Founder, Kilbride Foods",
  cta: { label: "Read client stories", href: "/client-stories/" },
};

export const ctaBandProps: CtaBandProps = {
  title: "Begin with a Conversation.",
  body:
    "Tell us what you are weighing up. We will tell you honestly whether this is work we should do, and who should do it.",
  cta: { label: "Request a consultation", href: "/contact/" },
};

export const statBandProps: PracticeStatBandProps = {
  eyebrow: "Credentials",
  stats: [
    { value: "1987", label: "Established in Dublin" },
    { value: "Chartered", label: "Accountants Ireland" },
    { value: "Registered", label: "Auditors" },
    { value: "4", label: "Partners" },
  ],
};

/** A complete home page in the intended order. */
export const homeSections = [
  { section: "Hero", props: heroProps },
  { section: "StatBand", props: statBandProps },
  { section: "FeatureGrid", props: featureGridProps },
  { section: "QuoteBand", props: quoteBandProps },
  { section: "CtaBand", props: ctaBandProps },
] as const;

/** The thin-page case: title, hairline, three sibling links, no body copy. */
export const innerPageSections = [
  { section: "PageHead", props: pageHeadProps },
] as const;

/* Canonical names the shared styleguide and the page builder import. */
export const heroFixture = heroProps;
export const pageHeadFixture = pageHeadProps;
export const featureGridFixture = featureGridProps;
export const quoteBandFixture = quoteBandProps;
export const ctaBandFixture = ctaBandProps;
export const statBandFixture = statBandProps;
