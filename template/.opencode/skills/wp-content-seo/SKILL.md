---
name: wp-content-seo
description: Use when mapping WordPress pages, Divi or ACF content, menus, media, Yoast metadata, redirects, sitemaps, forms, consent, analytics, or popups for a headless frontend.
---

# WP Content & SEO

Content is the part clients think is simple and agents underestimate. Divi,
menus, media dimensions, redirects, and consent all have headless traps.

## Non-negotiables

- WordPress is the source of truth for content, but Divi layout is not portable.
- Preserve URLs 1:1. A redesign without a redirect map loses SEO.
- `wp/v2/menus` is often `401` anonymously. Do not plan on it.
- Do not hotlink origin images without checking dimensions and cache headers.
- Rebuild consent/analytics/popups in the frontend; do not inject WP markup.
- Forms must have a real submission endpoint before the UI is considered done.

## Inputs

- `docs/wp-discovery/site-profile.md` and `capability-register.md`.
- `$WP` and `$OLD`.
- The current sitemap, robots, and redirect rules.

## Artifacts

- `docs/wp-discovery/content-seo.md`
- `docs/site/06-brand-assets.md` (icons, manifest, OG image, logo, fonts)
- updates to `capability-register.md`, `unknowns.md`

Use `../_shared/probe-commands.md`.

## 1. Content sources

Map each page type to a source:

- `wp/v2/pages` for standard pages
- custom post types from `wp/v2/types` (events, posts, resources, etc.)
- ACF fields exposed in the REST response or a helper endpoint
- blocks vs classic content vs Divi shortcodes
- product description content from the Store API
- reusable sections/global blocks

For each page type record:

| Page type | Source | Editor | Portable? | Plan |
|---|---|---|---|---|
| Home |  |  |  |  |
| About/policies |  |  |  |  |
| Product |  |  |  |  |
| Category |  |  |  |  |
| Booking |  |  |  |  |
| Contact |  |  |  |  |

## 2. Divi and builder content

Detect:

- `_et_pb_use_builder` meta on pages/products
- `et_pb_` shortcodes in content
- `divi/v1` namespace
- theme/child-theme script paths

Rules:

- A page with Divi builder content cannot be rendered faithfully in Next from
  the REST HTML alone.
- Count affected pages and products. The exact count changes the migration plan.
- Migrate to structured blocks/ACF or rebuild the page. Do not scrape Divi
  markup and call it done.
- Keep the old page live until its replacement is approved.

## 3. Menus and navigation

Probe `/wp/v2/menus` and `/wp/v2/menu-locations` (or the site's equivalent).

If they are `401`:

- Build navigation from pages, product categories, and product tags.
- Cache the derived nav.
- Do not expose a WordPress menu editor that has no effect on the frontend.
- Record the fallback in `content-seo.md`.

If a helper plugin exposes menus publicly, use it and record the endpoint.

## 4. Media and images

For representative images:

- `wp/v2/media?per_page=...&_fields=id,source_url,media_details,alt_text`
- Record `width`, `height`, `sizes`, `alt_text`, and MIME type.
- Confirm the uploads origin and CDN cache headers.
- Confirm whether the Store API image objects omit intrinsic dimensions.
- Plan responsive sizes, LCP priority, and blur placeholders.
- Check non-product images: swatches, linked variations, badges, gift cards,
  booking images, and popups.

## 5. SEO

Collect from live objects:

- `yoast_head_json` (or the site's SEO plugin shape): title, description,
  canonical, robots, OG, Twitter, schema
- JSON-LD: Product, BreadcrumbList, Organization, LocalBusiness, Article
- canonical and hreflang behavior
- sitemap index and child sitemaps
- `robots.txt`
- 404 and redirect behavior

Record the URL patterns you must preserve:

- `/shop/...`
- `/product-category/...`
- `/product-tag/...`
- attribute archives (`/pa_.../`)
- pages
- booking/account/wholesale routes

## 6. Redirects

Probe `/redirection/v1` or read the plugin's export.

- Export all rules and classify: internal, external, regex, query-based.
- Build a 301 map for the new router.
- Check trailing-slash behavior.
- Check redirect chains and loops.
- Preserve campaign/query URLs where the business relies on them.
- Record any rule you cannot port and who owns the decision.

## 7. Forms

Identify the form plugin and endpoint:

- `fluentform/v1` or another namespace
- `admin-ajax.php?action=...` if the plugin does not use REST
- required fields, validation, spam protection, consent
- where submissions go (email, CRM, webhook)
- whether the frontend can post directly or must use the BFF

Do not ship a contact form with a silent failure. Test one real submission in
staging and record the destination.

## 8. Consent, analytics, popups

- Identify the consent plugin (`cky/v1`, CookieYes, etc.) and rebuild the banner.
- Identify analytics (GA4, Meta pixel, etc.) and consent gating.
- Identify popups (`popup-maker/v2`, `pum/v1`) and decide rebuild vs drop.
- Do not inject WP plugin markup into the Next app.
- Record which tracking events must fire and when.

## 9. Brand assets

Capture these from the rendered HTML and the media library, not from guesswork.
Write them to `docs/site/06-brand-assets.md`.

- `<link rel="icon">` entries and their `sizes` (typically 32 and 192)
- `<link rel="apple-touch-icon">`
- `/favicon.ico` (probe it; it is often a PNG behind that name)
- `manifest` / `manifest.webmanifest` (name, theme colour, icons)
- `og:image` and `twitter:image`, with dimensions where declared
- the logo (light/dark variants) and where it is used
- brand fonts: family names, weights, and the files the origin actually serves

Record absence explicitly. A missing favicon or OG image is a finding, not a
licence to generate a placeholder brand: the design pass needs the client's real
assets. Telegram, Slack and iMessage all render `og:image` — for a prospect
preview link, a missing OG image is directly visible.

## Acceptance checklist

- [ ] Every page type has a source and a migration plan.
- [ ] Divi/builder pages counted and owned.
- [ ] Navigation works without an authenticated menu endpoint.
- [ ] Image dimensions and alt text are available.
- [ ] Canonical, OG, and JSON-LD match the current site.
- [ ] Icons, apple-touch-icon, manifest, OG image, logo and fonts are inventoried
      (or recorded as missing).
- [ ] Sitemap and robots are generated by the frontend.
- [ ] Redirect map covers all current URLs.
- [ ] Forms submit to a real destination.
- [ ] Consent and analytics are rebuilt and gated.
- [ ] Unknown page patterns are handed to `wp-unknowns`.

## Anti-patterns

- Scraping Divi HTML and calling it a migration.
- Planning on anonymous `/wp/v2/menus`.
- Hotlinking full-size images with no dimensions.
- Forgetting attribute and tag archives in the redirect map.
- Shipping a form that posts nowhere.
- Copying CookieYes/popup markup into React.
- Emitting no favicon or OG image because nobody asked for brand assets.
- Generating a placeholder logo or icon instead of using the client's.
