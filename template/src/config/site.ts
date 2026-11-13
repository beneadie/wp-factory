export const site = {
  name: process.env.SITE_NAME ?? "New Store",
  description:
    process.env.SITE_DESCRIPTION ?? "A storefront built on WordPress and WooCommerce.",
  url: process.env.SITE_URL ?? "http://localhost:3000",
  locale: process.env.SITE_LOCALE ?? "en-IE",
  currency: process.env.SITE_CURRENCY ?? "EUR",
  primaryNav: [
    { label: "Shop", href: "/product-category/all/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact-us/" },
  ],
} as const;
