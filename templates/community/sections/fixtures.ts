/**
 * Realistic fixtures for the community overlay.
 *
 * A fictional West Waterford community trust: a hall, underage teams and a
 * Thursday Club for older neighbours. The copy is written at the length real
 * Irish community organisations use — a named parish, real dates, a document
 * list, and a donation ask that says what the money buys.
 *
 * A client adaptation replaces every string here with the organisation's own
 * words. Nothing in this file should survive into a live site.
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
  eyebrow: "Ballycarrig Community Trust · Co. Waterford",
  title: "A hall, a pitch and a place to belong.",
  lede: "We keep the hall warm, the teams on the road and the Thursday Club running for every generation in Ballycarrig — funded by neighbours and run by volunteers.",
  primaryCta: { label: "Donate to the trust", href: "/donate/" },
  secondaryCta: { label: "Volunteer with us", href: "/volunteer/" },
  image: {
    src: "https://picsum.photos/seed/fixture-community-hall/1200/1500",
    alt: "Volunteers setting up the hall for the Friday social, October 2025.",
    width: 1600,
    height: 1067,
  },
  variant: "split",
};

export const pageHeadFixture: PageHeadProps = {
  eyebrow: "About the trust",
  title: "Who we are, and who we're here for.",
  // Deliberately no tagline: PageHead is judged as the thin-page archetype.
  links: [
    { label: "What we do", href: "/about/what-we-do/" },
    { label: "The committee", href: "/about/committee/" },
    { label: "Annual reports", href: "/about/annual-reports/" },
  ],
};

export const featureGridFixture: FeatureGridProps = {
  eyebrow: "What we run",
  title: "Three things that happen because people show up.",
  items: [
    {
      title: "The community hall",
      body: "A warm, affordable room for birthdays, classes, wakes and the Friday social. Sixty local groups used it last year.",
      href: "/community-hall/",
    },
    {
      title: "Underage teams",
      body: "Hurling, camogie and football from U6 to minor. The trust pays for gear, transport and coaching so no child is priced out.",
      href: "/underage-teams/",
    },
    {
      title: "The Thursday Club",
      body: "Lunch, company and a lift home for older neighbours, run by 22 volunteers and open to anyone in the parish.",
      href: "/thursday-club/",
    },
    // Document rows: href ends in a file extension, body is the file size.
    {
      title: "Annual report 2025",
      body: "2.4 MB",
      href: "/documents/annual-report-2025.pdf",
    },
    {
      title: "Audited accounts 2024",
      body: "1.1 MB",
      href: "/documents/audited-accounts-2024.pdf",
    },
    {
      title: "Child safeguarding statement",
      body: "480 KB",
      href: "/documents/child-safeguarding-statement.pdf",
    },
  ],
};

export const quoteBandFixture: QuoteBandProps = {
  quote:
    "I moved here at 68 not knowing a soul. By the second Thursday I had a lift, a dinner and three people to argue with about the football.",
  attribution: "Maura Fitzpatrick · Thursday Club member",
};

export const ctaBandFixture: CtaBandProps = {
  title: "Keep the doors open.",
  body: "€8 pays for a child's session this week. €120 heats the hall for a month. Every euro stays in Ballycarrig, and every hour you give is just as welcome.",
  cta: { label: "Donate to the trust", href: "/donate/" },
};

export const statBandFixture: StatBandProps = {
  stats: [
    { value: "Fri 20 Nov", label: "Winter Fair · Hall doors 6pm" },
    { value: "Sat 28 Nov", label: "Bag pack · Village Store, 10am–4pm" },
    { value: "Sat 12 Dec", label: "Carol service · St Brigid's, 7.30pm" },
  ],
};
