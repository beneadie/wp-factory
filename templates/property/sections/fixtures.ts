/**
 * Realistic fixtures for the styleguide and local development.
 *
 * A fictional west-of-Ireland auctioneer with six real-looking instructions.
 * Every price is a guide, every flag is a status an auctioneer actually uses,
 * and every address is specific enough to be checked. A template overlay
 * replaces the copy and photographs with the client's own.
 *
 * Listing bodies follow the card convention: the first line carries
 * status · beds · baths · floor area · guide price, and the paragraph after
 * the newline is the blurb. See feature-grid.tsx.
 */
import type {
  CtaBandProps,
  FeatureGridProps,
  HeroProps,
  PageHeadProps,
  QuoteBandProps,
  SectionImage,
  SectionLink,
  StatBandProps,
} from "@/lib/section-types";

type ListingItemFixture = FeatureGridProps["items"][number] & {
  image?: SectionImage;
};

const pageHeadLinks: SectionLink[] = [
  { label: "Residential", href: "/properties/residential/" },
  { label: "Land & farms", href: "/properties/land-farms/" },
  { label: "Commercial", href: "/properties/commercial/" },
];

const listingItems: ListingItemFixture[] = [
  {
    title: "Ard na Gaoithe, Spiddal, Co. Galway",
    body: "New to Market · 4 beds · 2 baths · 168 m² · €625,000\nA 2019 build behind a stone wall, with a double-height kitchen and a stream.",
    href: "/properties/ard-na-gaoithe/",
    image: {
      src: "https://picsum.photos/seed/fixture-ard-na-gaoithe/1200/800",
      alt: "Ard na Gaoithe, a contemporary stone house near Spiddal, Co. Galway",
      width: 1200,
      height: 800,
    },
  },
  {
    title: "3 The Cloisters, Salthill, Co. Galway",
    body: "Sale Agreed · 2 beds · 1 bath · 74 m² · €395,000\nA top-floor apartment near the prom, with a west-facing balcony.",
    href: "/properties/3-the-cloisters/",
    image: {
      src: "https://picsum.photos/seed/fixture-the-cloisters/1200/800",
      alt: "The west-facing balcony of an apartment at 3 The Cloisters, Salthill",
      width: 1200,
      height: 800,
    },
  },
  {
    title: "Gortnalea House, Oughterard, Co. Galway",
    body: "New to Market · 5 beds · 4 baths · 310 m² · €875,000\nA restored Georgian rectory on two acres, with a walled garden.",
    href: "/properties/gortnalea-house/",
    image: {
      src: "https://picsum.photos/seed/fixture-gortnalea-house/1200/800",
      alt: "Gortnalea House, a Georgian rectory with a walled garden near Oughterard",
      width: 1200,
      height: 800,
    },
  },
  {
    title: "Cahermacnaughten, Ballyvaughan, Co. Clare",
    body: "Under Offer · 3 beds · 2 baths · 132 m² · €445,000\nA dormer bungalow facing the Burren, with a stove and a workshop.",
    href: "/properties/cahermacnaughten/",
    image: {
      src: "https://picsum.photos/seed/fixture-cahermacnaughten/1200/800",
      alt: "A dormer bungalow facing the Burren at Cahermacnaughten, Co. Clare",
      width: 1200,
      height: 800,
    },
  },
  {
    title: "4 Church Street, Westport, Co. Mayo",
    body: "Sale Agreed · 3 beds · 2 baths · 118 m² · €465,000\nA townhouse near the quay, with a courtyard and a first-floor sitting room.",
    href: "/properties/4-church-street/",
    image: {
      src: "https://picsum.photos/seed/fixture-church-street/1200/800",
      alt: "The painted facade of 4 Church Street, Westport, Co. Mayo",
      width: 1200,
      height: 800,
    },
  },
  {
    title: "Derreen, Louisburgh, Co. Mayo",
    body: "New to Market · 3 beds · 1 bath · 96 m² · €285,000\nA traditional cottage with a slate roof, five minutes from the beach.",
    href: "/properties/derreen/",
    image: {
      src: "https://picsum.photos/seed/fixture-derreen-cottage/1200/800",
      alt: "A traditional slate-roofed cottage at Derreen, near Louisburgh, Co. Mayo",
      width: 1200,
      height: 800,
    },
  },
];

export const heroFixture: HeroProps = {
  eyebrow: "Fitzgerald & Hall · Auctioneers & Valuers, Co. Galway",
  title: "The west, one house at a time.",
  lede: "Sales, lettings and valuations across Galway, Mayo and Roscommon, with the figures, the BER and the photographs in front of you before you make the call.",
  primaryCta: { label: "View current listings", href: "/properties/" },
  secondaryCta: { label: "Book a valuation", href: "/valuations/" },
  image: {
    src: "https://picsum.photos/seed/fixture-spiddal-house/2000/1125",
    alt: "A stone farmhouse with a slate roof and a long garden, near Spiddal, Co. Galway",
    width: 2000,
    height: 1125,
  },
  variant: "full",
};

export const pageHeadFixture: PageHeadProps = {
  eyebrow: "Properties · Updated 14 November 2026",
  title: "For sale across the west.",
  links: pageHeadLinks,
};

export const featureGridFixture: FeatureGridProps = {
  eyebrow: "Featured properties",
  title: "Six homes on the book this week.",
  items: listingItems,
};

export const quoteBandFixture: QuoteBandProps = {
  quote:
    "They photographed the house on a Tuesday, it was live by Friday, and we had four bids over the guide by the following weekend. The figure they put on it was the figure we got.",
  attribution: "Niamh Ó Conaill · Seller, Oughterard, Co. Galway",
  cta: { label: "How we sell a house", href: "/selling/" },
};

export const ctaBandFixture: CtaBandProps = {
  title: "Book a viewing.",
  body: "Viewings run Thursday to Saturday. Tell us the house and a time that suits, and we will meet you at the gate with the keys and the BER cert.",
  cta: { label: "Arrange a viewing", href: "/viewings/" },
};

export const statBandFixture: StatBandProps = {
  stats: [
    { value: "€48m", label: "Sold across the west in 2025" },
    { value: "312", label: "Homes brought to market last year" },
    { value: "9 in 10", label: "Sales agreed above the guide price" },
    { value: "6 wks", label: "Average time from listing to sale agreed" },
  ],
};
