/**
 * Realistic fixtures for the styleguide and for local development.
 *
 * Not placeholder copy. A fictional practice in Sligo, so every section is
 * judged at the length a real Irish small-business site actually uses: long
 * eyebrows, two-line ledes, six service cards, a client quote with a county in
 * it. A template overlay replaces this file with copy from its own client.
 */
import type {
  CtaBandProps,
  FeatureGridProps,
  HeroProps,
  PageHeadProps,
  QuoteBandProps,
  StatBandProps,
} from "@/lib/section-types";

export const heroFixture: HeroProps = {
  eyebrow: "Chartered accountants · Sligo",
  title: "Accounts that make sense of a busy year.",
  lede: "We look after the books, the payroll and the Revenue deadlines for family businesses across Sligo, Leitrim and Roscommon, so you can get back to the work you actually enjoy.",
  primaryCta: { label: "Book a first call", href: "/contact/" },
  secondaryCta: { label: "See our services", href: "/services/" },
  image: {
    src: "https://picsum.photos/seed/fixture-office/1200/1500",
    alt: "The Loughran & Company office on Wine Street, Sligo",
    width: 1600,
    height: 1200,
  },
  variant: "split",
};

export const pageHeadFixture: PageHeadProps = {
  eyebrow: "Services",
  title: "Tax & compliance",
  tagline:
    "Deadlines, filings and the questions you only think of in March, handled by people who answer the phone.",
  links: [
    { label: "Year-end accounts", href: "/services/accounts/" },
    { label: "Payroll", href: "/services/payroll/" },
    { label: "VAT & RCT", href: "/services/vat-rct/" },
    { label: "Tax planning", href: "/services/tax-planning/" },
  ],
};

export const featureGridFixture: FeatureGridProps = {
  eyebrow: "What we do",
  title: "Six things we take off your desk",
  items: [
    {
      title: "Year-end accounts",
      body: "Statutory accounts and Corporation Tax returns prepared from your records, filed on time and explained in plain English.",
      href: "/services/accounts/",
    },
    {
      title: "Payroll",
      body: "Weekly, fortnightly or monthly runs, Revenue submissions and payslips your staff can actually read.",
      href: "/services/payroll/",
    },
    {
      title: "VAT & RCT",
      body: "Bi-monthly VAT, reverse charge on construction work and the RCT files that catch everyone out in January.",
      href: "/services/vat-rct/",
    },
    {
      title: "Bookkeeping",
      body: "A tidy ledger each month, bank reconciled, so the year-end is a review rather than a rescue.",
      href: "/services/bookkeeping/",
    },
    {
      title: "Company secretarial",
      body: "Annual returns, changes of director and the registered office paperwork nobody wants to own.",
      href: "/services/company-secretarial/",
    },
    {
      title: "Tax planning",
      body: "Pension contributions, capital allowances and succession, looked at before the year closes rather than after.",
      href: "/services/tax-planning/",
    },
  ],
};

export const quoteBandFixture: QuoteBandProps = {
  quote:
    "We arrived in 2016 with a shoebox of receipts and a lot of apologising. Eight years on, the only thing we bring to the year-end meeting is a coffee.",
  attribution: "Mairéad Ní Bhriain · Cloonagh Joinery, Tuam",
  cta: { label: "Read client stories", href: "/about/client-stories/" },
};

export const ctaBandFixture: CtaBandProps = {
  title: "Not sure what you need? Start with a conversation.",
  body: "Twenty minutes, no charge and no obligation. We will tell you what we can take off your desk this quarter and what can safely wait until next year.",
  cta: { label: "Arrange a call", href: "/contact/" },
};

export const statBandFixture: StatBandProps = {
  stats: [
    { value: "30 yrs", label: "In practice on Wine Street" },
    { value: "420+", label: "Businesses supported" },
    { value: "48 hrs", label: "Typical reply to a query" },
    { value: "€1.2m", label: "Research credits claimed since 2019" },
  ],
};
