/**
 * Fixtures for the portfolio template.
 *
 * Fitzgerald & Rowe is a fictional two-person photography studio working
 * between Dublin and the west coast. The copy is written at the length a real
 * studio uses: project titles, one-sentence descriptions, county-level
 * captions and years. Nothing here is lorem ipsum.
 *
 * Photographs are remote Unsplash CDN slots so the fixtures render without a
 * public/ directory. SiteImage reserves every ratio and owns the placeholder,
 * so a blocked network shows a pattern, never a blank slot. A client build
 * replaces these sources with WordPress media.
 */
import type {
  CtaBandProps,
  FeatureGridProps,
  HeroProps,
  PageHeadProps,
  QuoteBandProps,
  SectionImage,
  StatBandProps,
} from "@/lib/section-types";

type ProjectItem = FeatureGridProps["items"][number] & {
  image?: SectionImage;
  year?: string;
  caption?: string;
};

const photograph = (
  id: string,
  alt: string,
  width: number,
  height: number,
): SectionImage => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`,
  alt,
  width,
  height,
});

export const heroFixture: HeroProps = {
  eyebrow: "Fitzgerald & Rowe · Photography",
  title: "North Atlantic",
  lede: "A year of night crossings between Rosslare and Cherbourg, photographed for a book due next spring.",
  primaryCta: { label: "View the index", href: "/work/" },
  secondaryCta: { label: "The studio", href: "/studio/" },
  image: photograph(
    "1559827260-dc66d52bef19",
    "A breaking swell under dusk cloud off the Mayo coast, from the North Atlantic series",
    2000,
    1125,
  ),
  variant: "full",
};

export const pageHeadFixture: PageHeadProps = {
  eyebrow: "About",
  title: "The Studio",
  tagline:
    "A two-person photography studio working between Dublin and the west coast.",
  links: [
    { label: "Approach", href: "/studio/approach/" },
    { label: "Clients", href: "/studio/clients/" },
    { label: "Contact", href: "/contact/" },
  ],
};

export const featureGridFixture: FeatureGridProps & {
  items: ProjectItem[];
} = {
  eyebrow: "Selected work",
  title: "Recent commissions and personal series.",
  items: [
    {
      title: "North Atlantic",
      body: "Night crossings between Rosslare and Cherbourg, for a forthcoming book.",
      href: "/work/north-atlantic/",
      year: "2025",
      caption: "Rosslare to Cherbourg",
      image: photograph(
        "1439405326854-014607f694d7",
        "Last light on the Celtic Sea from the deck of a night ferry",
        1600,
        1200,
      ),
    },
    {
      title: "Bogland",
      body: "Peat, rain and last light over the Nephin Beg range.",
      href: "/work/bogland/",
      year: "2024",
      caption: "Nephin Beg, Co. Mayo",
      image: photograph(
        "1469474968028-56623f02e42e",
        "Bog cotton and low cloud over the Nephin Beg range, County Mayo",
        1600,
        1200,
      ),
    },
    {
      title: "The Long Acre",
      body: "One east Galway farm, from the same gate through four seasons.",
      href: "/work/the-long-acre/",
      year: "2024",
      caption: "Kiltullagh, Co. Galway",
      image: photograph(
        "1472214103451-9374bd1c798e",
        "A ring fort in a green field at dusk, east Galway",
        1600,
        1200,
      ),
    },
    {
      title: "Understory",
      body: "Oak woods at Glendalough, on warm, foggy mornings.",
      href: "/work/understory/",
      year: "2023",
      caption: "Glendalough, Co. Wicklow",
      image: photograph(
        "1441974231531-c6227db76b6e",
        "Sun through the oaks at Glendalough, County Wicklow",
        1600,
        1200,
      ),
    },
    {
      title: "Salt Air",
      body: "Campaign imagery for a sea-salt producer on Achill.",
      href: "/work/salt-air/",
      year: "2022",
      caption: "Keel, Achill, Co. Mayo",
      image: photograph(
        "1500375592092-40eb2168fd21",
        "A breaking wave off the Achill coast, made for the Salt Air campaign",
        1600,
        1200,
      ),
    },
    {
      title: "Cloud Study",
      body: "The Reeks under weather, from the valley floor.",
      href: "/work/cloud-study/",
      year: "2021",
      caption: "MacGillycuddy's Reeks, Co. Kerry",
      image: photograph(
        "1444927714506-8492d94b4e3d",
        "Layered ridges disappearing into cloud, MacGillycuddy's Reeks",
        1600,
        1200,
      ),
    },
  ],
};

export const quoteBandFixture: QuoteBandProps = {
  quote:
    "They spent four days waiting for the weather and came back with the only photograph of the distillery anyone has ever wanted to hang.",
  attribution: "Aoife Byrne · Brand Director, Claddagh Distillery",
  cta: { label: "Read the field notes", href: "/journal/field-notes/" },
};

export const ctaBandFixture: CtaBandProps = {
  title: "Commissions open for spring.",
  body: "We take on a small number of projects each season, from a single portrait to a full campaign. Tell us what you are making, and who it is for.",
  cta: { label: "Start a conversation", href: "/contact/" },
};

export const statBandFixture: StatBandProps = {
  stats: [
    { value: "24", label: "Commissions since 2019" },
    { value: "6", label: "Counties in the archive" },
    { value: "3", label: "Books published" },
    { value: "7", label: "Years in practice" },
  ],
};
