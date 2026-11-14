export const site = {
  name: process.env.SITE_NAME ?? "New Site",
  description: process.env.SITE_DESCRIPTION ?? "",
  url: process.env.SITE_URL ?? "http://localhost:3000",
  locale: process.env.SITE_LOCALE ?? "en-IE",
  /** Optional manual override; when empty, top-level WordPress pages are used. */
  primaryNav: [] as ReadonlyArray<{ label: string; href: string }>,
};
