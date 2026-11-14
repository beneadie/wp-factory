---
name: wp-intake
description: Use when starting a headless WordPress/WooCommerce build, or when given a wp-json index, route dump, or endpoint. Triages the REST surface by shopper journey, builds a capability matrix, and gates UI work until the important integrations are proven.
---

# WP Intake

Turn a raw WordPress REST index into a one-page capability map, a risk list, and
a gate. This skill does not build UI. It produces evidence and a decision.

## Non-negotiables

- The index proves a plugin is **installed**, not **enabled** or **used**. Probe
  live before concluding.
- **GET-only.** Mutations belong in `wp-spikes`, with a written plan.
- Never commit secrets, tokens, cookies, or customer data.
- Do not install plugins without explicit approval.
- Every claim cites a route plus a field, header, or script.
- Site facts live in `docs/wp-discovery/`. Skills stay generic.

## Inputs

- `$WP`: WordPress origin, no trailing slash.
- An index: saved `/wp-json/` response or an existing dump.
- `$OLD`: the current public site, used for usage evidence (may equal `$WP`).
- Optional staging credentials for the authenticated pass only.
- Brand assets from the rendered HTML: icons, manifest, OG image, logo, fonts.

If a dump is provided, confirm it is the REST index: it must have `namespaces`
and `routes`. If it is only a route list without schemas, live-probe more.

## Artifacts

Write to `docs/wp-discovery/`. If the repo already has equivalent docs (for
example `docs/integration-audit.md` or `docs/spike-results.md`), reuse and update
them instead of creating parallel files.

```
docs/wp-discovery/
  site-profile.md          # this skill
  capability-register.md   # shared ledger
  route-ledger.md          # residual routes
  unknowns.md              # wp-unknowns
  commerce.md              # wp-catalog-cart + wp-checkout-payments
  bookings.md              # wp-bookings
  auth-wholesale.md        # wp-auth-wholesale
  content-seo.md           # wp-content-seo
  spike-results.md         # wp-spikes
  plugin-fingerprints.md   # copied from ../_shared/plugin-fingerprints.md and extended
  field-notes.md           # copied from ../_shared/field-notes.md and extended
```

Brand assets (icons, manifest, OG image, logo, fonts) are inventoried by
`wp-content-seo` in `docs/site/06-brand-assets.md`; note them in the profile so
the build phase does not re-probe.

Read `../_shared/probe-commands.md` for the exact commands.

## Step 1 — Capture the source

1. Save the index with a timestamp.
2. Record: base URL, `home`, `page_on_front`, `namespaces`, route count,
   `authentication`, and any custom post types.
3. Probe `/wp/v2/types` and `/wp/v2/taxonomies` anonymously. Custom post types
   and taxonomies are discovery signals.
4. Record whether `/wp-json/` is reachable from the same network context as the
   eventual BFF. A laptop reachable endpoint may be blocked from the host.

Do not start with routes. Start with the site's jobs: content, catalog, product
options, cart, checkout, shipping, payments, accounts, wholesale, bookings,
forms, SEO, media, navigation, search, brand assets (icons, logo, fonts).

## Step 2 — Fingerprint the surface

Cluster routes into families using the prefix table in
`../_shared/plugin-fingerprints.md`. For each family, capture:

- route count
- which routes are public vs 401/403
- which routes are GET vs write
- whether the family has a known owner in the capability register

Mark anything that does not fit a known family as **suspected** or **unknown**.
Do not discard it. Hand it to `wp-unknowns`.

Also classify each family by likely use:

- **Core commerce:** `wc/store/v1`, `wc/v3`, `wc/v1`, `wc/v2`
- **Bookings:** `ssa/v1`, `wc-bookings/v1`, `wp/v2/wc_booking`,
  `wp/v2/bookable_resource`
- **Wholesale:** `wholesale/v1`, `wc/v3/wholesale`, `wwof/v3`, `wwlc/v1`,
  `wwp/v1`
- **Content/SEO:** `wp/v2`, `yoast/v1`, `redirection/v1`
- **Forms/consent:** `fluentform/v1`, `cky/v1`, `popup-maker/v2`, `pum/v1`
- **Payments:** `payments`, `wc/v3/payments`, `wc/v3/paypal-*`
- **Infra/admin:** `wc-admin`, `wc-analytics`, `jetpack/v4`, `ai1wm/v1`,
  `sg-ai-studio`, `wccom-site/v3`, `wp-site-health`, `batch/v1`

## Step 3 — Build the capability matrix

Fill the template in `../_shared/capability-register-template.md`. One row per
capability, not per route. Minimum rows:

| Capability | Questions to answer |
|---|---|
| Content pages | Source? Divi/ACF/blocks? Draft preview? |
| Catalog | Count, categories, pagination, brand/tag |
| Product options | Variable? What axes? How many variations? |
| Cart | Token/nonce contract, extensions, coupons |
| Shipping | Needs shipping? Rate selection? Taxes? |
| Checkout | Required args, payment data, `expected_total` |
| Payments | Enabled methods from `cart.payment_methods`, not the enum |
| Accounts | Auth mechanism, login, orders, addresses |
| Wholesale pricing | Which namespace, which request path |
| Wholesale ordering | Bulk form, minimums, approval |
| Bookings | Which system, availability, write path |
| Gift cards | Product type or cart extension, amount/recipient |
| Forms | Endpoint, spam protection, consent |
| Media | Dimensions, CDN, uploads path |
| SEO/redirects | Yoast, sitemap, redirect rules, URL parity |
| Navigation | Menus 401? Fallback from pages/categories |
| Search | Store API search quality, filters |

For each row record: source, public/auth, read/write, required
extensions/args, evidence, risk, gate, owner skill. A row without evidence is a
hypothesis, not a finding.

## Step 4 — Live-probe (GET only)

Use `../_shared/probe-commands.md`.

Minimum probes:

- `GET /wc/store/v1/products?per_page=100&page=1` plus headers
- `GET /wc/store/v1/products/categories?per_page=100`
- `GET /wp/v2/pages?per_page=100&_fields=id,slug,link,title`
- `GET /wp/v2/media?per_page=20&_fields=id,source_url,media_details`
- `GET /wp-json/` and `wp/v2/types`
- `GET /wc/store/v1/cart` plus response headers
- `GET /wc/store/v1/checkout` with the cart `Nonce`
- One product of each type in the census
- One variable product's variation mapping
- One booking candidate (SSA embed, Woo Bookings product)
- Auth probes for `/wp/v2/users/me`, `/wp/v2/menus`, `/wc/v3/customers`
- Current-site HTML/XHR scan for `admin-ajax`, `wc-ajax`, plugin scripts

Capture status, headers, sample keys, and extension keys. Do not capture full
customer or order payloads.

## Step 5 — Decide and gate

Apply these rules:

- **One capability, one owner.** If two plugins expose the same noun, stop and
  audit before building. Record the chosen source and rejected sources.
- **No public write path = no build.** Prove add-to-cart/booking/checkout before
  building the form.
- **A loaded script is not an enabled feature.** Check live responses.
- **A schema enum is not a live option.** Check `cart.payment_methods`.
- **A 401 route is not proof the feature is unused.** Look for
  `admin-ajax`, `wc-ajax`, iframes, and published pages.
- **A missing route is a finding.** Record manual/offline/third-party fallback.

Gate: do not start UI until every money, inventory, identity, booking, and legal
capability has an owner, evidence, a risk level, and either a passed spike or a
written accepted risk.

## Step 6 — Write and hand off

1. Write `site-profile.md` with the index metadata and a one-paragraph verdict:
   "This site is / is not ready for a headless build because …".
2. Write `capability-register.md` from the template.
3. Copy and extend `plugin-fingerprints.md` and `field-notes.md`.
4. Hand residual routes to `wp-unknowns`.
5. Hand commerce rows to `wp-catalog-cart` and `wp-checkout-payments`.
6. Hand bookings to `wp-bookings`.
7. Hand auth/wholesale to `wp-auth-wholesale`.
8. Hand content/SEO/forms to `wp-content-seo`.
9. Hand blockers to `wp-spikes`.

## Definition of done

- [ ] Index saved and hashed.
- [ ] Route families counted and fingerprinted.
- [ ] Every capability row has evidence, risk, gate, and owner.
- [ ] Every expected shopper journey is either mapped to a route or recorded as
      manual, third-party, out of scope, or missing.
- [ ] Every unknown route is in `unknowns.md` with a verdict.
- [ ] Payment methods read from a live cart, not the schema enum.
- [ ] Product type census complete, including variations.
- [ ] Booking source of truth chosen or explicitly deferred.
- [ ] Auth mechanism identified or flagged as absent.
- [ ] Gate written in `site-profile.md`.

## Anti-patterns

- Reading all routes before testing the live cart.
- Estimating scope from namespace count.
- Assuming JWT because the plan says JWT.
- Treating a route schema's gateway enum as enabled gateways.
- Building a product page before checking the product type mix.
- Calling `admin-ajax` "not an API" and ignoring it.
- Leaving "misc" routes unclassified.
