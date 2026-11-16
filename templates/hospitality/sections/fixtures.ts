/**
 * Fixtures for the hospitality template.
 *
 * A working café-bakery on Bridge Street, Clifden: real dishes, real euro
 * prices, a full week of hours and a menu that reads like it was written on a
 * chalkboard rather than generated. Replaced wholesale by the adapter with the
 * client's own menu and copy.
 */
import type {
  HeroProps,
  PageHeadProps,
  QuoteBandProps,
  StatBandProps,
} from "@/lib/section-types";
import type { HospitalityCtaBandProps } from "./cta-band";
import type { HospitalityFeatureGridProps } from "./feature-grid";

export const heroFixture: HeroProps = {
  eyebrow: "Bakery & kitchen · Clifden, Co. Galway",
  title: "Bread out of the oven, coffee on the pass.",
  lede: "A small room on Bridge Street with a long counter, a short menu and the first loaves on the shelf by seven.",
  primaryCta: { label: "Book a table", href: "/visit/" },
  image: {
    src: "https://picsum.photos/seed/fixture-bridge-street/1200/1500",
    alt: "A tray of soda bread cooling by the window at Bracken & Rye",
    width: 1800,
    height: 1200,
  },
  variant: "full",
};

export const pageHeadFixture: PageHeadProps = {
  eyebrow: "Menus · Clifden",
  title: "What's on the board.",
  links: [
    { label: "Breakfast", href: "/menus/breakfast/" },
    { label: "Lunch", href: "/menus/lunch/" },
    { label: "Sunday lunch", href: "/menus/sunday/" },
  ],
};

export const featureGridFixture: HospitalityFeatureGridProps = {
  eyebrow: "Today at the café",
  title: "Three things out of the kitchen this morning.",
  items: [
    {
      title: "Soda bread, still warm",
      body: "Buttermilk, coarse wholemeal and a handful of oats. Baked at six, sliced until it runs out.",
      href: "/menus/breakfast/",
      image: {
        src: "https://picsum.photos/seed/fixture-soda-bread/1200/1500",
        alt: "A sliced loaf of brown soda bread on a wooden board",
        width: 1200,
        height: 1500,
      },
    },
    {
      title: "Crab on brown bread",
      body: "West Cork crab, dill, lemon and sea salt. The one dish that never leaves the lunch board.",
      href: "/menus/lunch/",
      image: {
        src: "https://picsum.photos/seed/fixture-crab-soda/1200/1500",
        alt: "Crab meat on buttered brown bread with dill and lemon",
        width: 1200,
        height: 1500,
      },
    },
    {
      title: "Sea salt caramel tart",
      body: "Dark caramel, a little salt, crème fraîche on the side. Cut thick, served cold from the counter.",
      href: "/menus/sweets/",
      image: {
        src: "https://picsum.photos/seed/fixture-caramel-tart/1200/1500",
        alt: "A slice of sea salt caramel tart with crème fraîche",
        width: 1200,
        height: 1500,
      },
    },
  ],
  menuLabel: "On the board",
  menuNote: "Breakfast until 11.30 · Lunch from 12 · Bread and pastry from the counter",
  menu: [
    {
      title: "Breakfast",
      note: "Served until 11.30",
      dishes: [
        {
          name: "Shiitake mushrooms on toasted sourdough",
          description: "Garlic butter, flat parsley, lemon",
          price: "€12.50",
        },
        {
          name: "Smoked haddock hash",
          description: "Poached egg, chives, brown butter",
          price: "€14.50",
        },
        {
          name: "Buttermilk pancakes",
          description: "Achill honey, toasted hazelnut, crème fraîche",
          price: "€11.00",
        },
      ],
    },
    {
      title: "Lunch",
      note: "From 12 noon",
      dishes: [
        {
          name: "Roast Achill lamb sandwich",
          description: "Pickled red cabbage, rosemary jus, sourdough",
          price: "€13.50",
        },
        {
          name: "West Cork crab on soda bread",
          description: "Dill, lemon, sea salt",
          price: "€15.00",
        },
        {
          name: "Charred hispi cabbage",
          description: "Hazelnut romesco, aged Coolea",
          price: "€13.00",
        },
      ],
    },
    {
      title: "Sweets",
      note: "From the counter",
      dishes: [
        {
          name: "Sea salt caramel tart",
          description: "Crème fraîche",
          price: "€7.00",
        },
        {
          name: "Buttermilk panna cotta",
          description: "Poached rhubarb, ginger",
          price: "€7.50",
        },
        {
          name: "Porter cake",
          description: "Aged cheddar, apple",
          price: "€6.50",
        },
      ],
    },
    {
      title: "Bread & pastry",
      note: "Baked daily",
      dishes: [
        {
          name: "Brown soda loaf",
          description: "Wholemeal, oats, buttermilk · whole loaf",
          price: "€6.50",
        },
        {
          name: "Treacle scone",
          description: "Sea salt butter",
          price: "€3.50",
        },
      ],
    },
  ],
};

export const quoteBandFixture: QuoteBandProps = {
  quote:
    "The soda bread alone is worth the drive from Galway. We came for coffee, left with a loaf and a tart, and were back the following Saturday.",
  attribution: "Niamh Ó Conaill · The Western Journal",
  cta: { label: "Read our story", href: "/about/" },
};

export const ctaBandFixture: HospitalityCtaBandProps = {
  title: "The kitchen closes at four. The room stays warm.",
  body: "Walk-ins are welcome — the window bench goes first. For six or more, ring ahead and we will hold the corner table.",
  cta: { label: "Book a table", href: "/visit/" },
  hoursLabel: "Opening hours",
  hoursNote: "Kitchen stops 45 minutes before close. Bread from 7am.",
  hours: [
    { day: "Monday", time: "Closed" },
    { day: "Tuesday – Thursday", time: "8am – 4pm" },
    { day: "Friday", time: "8am – 9pm" },
    { day: "Saturday", time: "9am – 9pm", today: true },
    { day: "Sunday", time: "9am – 3pm" },
  ],
};

export const statBandFixture: StatBandProps = {
  stats: [
    { value: "2016", label: "Baking on Bridge Street since" },
    { value: "6am", label: "First loaves out of the oven" },
    { value: "38", label: "Seats, including the window bench" },
    { value: "312", label: "Google reviews, 4.9 average" },
  ],
};
