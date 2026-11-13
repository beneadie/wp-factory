---
name: wp-unknowns
description: Use after wp-intake, or whenever routes/capabilities are not covered by the known list. Runs the residual route pass, the negative-space journey pass, and the outside-REST pass so unknown WordPress/WooCommerce features are classified instead of missed.
---

# WP Unknowns

The capability list is a seed, not a fence. This skill makes unknowns explicit,
cheap, and prioritized. It is the mandatory escape hatch for "what if there is
something else in the endpoints?"

## Non-negotiables

- **No route unclassified.** Every residual route gets `adopt`, `spike`, `park`,
  or `ignore`, with evidence.
- Do not reverse-engineer a novel business model from route names alone. Escalate.
- GET-only. Mutations belong in `wp-spikes`.
- A loaded script, a 401 route, or a missing route is evidence, not a conclusion.
- Unknown routes that touch money, inventory, identity, bookings, or legal
  content cannot be parked without a written decision.

## Inputs

- `docs/wp-discovery/site-profile.md` and `capability-register.md` from
  `wp-intake`.
- The index dump.
- Current public site URL.
- Optional admin credentials for authenticated schema inspection.

## Artifacts

- `docs/wp-discovery/unknowns.md`
- updates to `capability-register.md`, `route-ledger.md`, `plugin-fingerprints.md`
- `docs/wp-discovery/field-notes.md`

Use `../_shared/route-ledger-template.md` and `../_shared/risk-rubric.md`.

## 1. Residual route pass

### Build the residual set

1. Take all route keys from the index.
2. Subtract routes already mapped to a capability in the register.
3. Subtract obvious admin/infra families, but keep them in a parked list with a
   reason: `wc-admin`, `wc-analytics`, `wc-telemetry`, `wc-push-notifications`,
   `wc-admin-email`, `jetpack/v4`, `ai1wm/v1`, `sg-ai-studio`,
   `wccom-site/v3`, `wp-site-health`, `batch/v1`.
4. The remainder is the residual set. Do not ignore it.

### Score each residual family

Use the five axes in `../_shared/risk-rubric.md`:

- **Stakes**: cosmetic, content, account, or money/inventory/identity/legal.
- **Exposure**: admin, auth, public GET, public write.
- **Data-bearing**: empty, embed/HTML, partial, full structured records.
- **Reference**: unused, script loaded, linked in nav/sitemap, used in the live
  commerce flow.
- **Novelty**: duplicate, cosmetic variant, new shopper action, new domain
  concept.

Override: any route touching money, inventory, identity, bookings, or legal
content is at least a `spike`.

### Probe the survivors

For each family with score 8+:

1. Probe one public GET. Record status, headers, top-level keys, and extension
   keys.
2. Probe one write path only if you are in `wp-spikes` with a written plan.
3. Look for the same capability elsewhere: another namespace, `admin-ajax`,
   `wc-ajax`, an iframe, or the published page.
4. Write a hypothesis in the route ledger. A hypothesis is not a decision.

### Verdicts

- `adopt` — add a capability row, assign an owner skill, build later.
- `spike` — important but unproven; create a spike in `wp-spikes`.
- `park` — real but out of scope/low value; record why and who decides.
- `ignore` — admin/infra noise; record why.

## 2. Negative-space journey pass

Run the mapping backwards. For each expected shopper journey, ask where it lives.
If there is no route, that is a finding, not a gap to skip.

Expected journeys:

- browse by category, tag, brand, attribute
- search and filter
- product detail and variant selection
- add to cart, update quantity, remove
- coupon/gift card
- shipping estimate and selection
- tax and final total
- payment and 3-D Secure return
- account creation, login, password reset
- order history, order tracking, reorder
- returns/refunds
- reviews and Q&A
- wishlist/favourites
- back-in-stock/price alerts
- gift cards and recipients
- bookings/appointments/resources
- wholesale application, approval, trade pricing, bulk order
- quote/request-a-price, B2B purchase orders
- subscriptions/memberships/pre-orders/deposits
- bundles/composite products/product add-ons/engraving
- donations, events, classes, rentals, auctions
- contact, legal, consent, accessibility statement

For each journey record: `route`, `manual`, `third-party`, `out of scope`, or
`missing`. "Missing" needs a client decision.

## 3. Outside-REST pass

`wp-json` is not the whole site. Add these probes.

### Current-site crawl

Open the pages being replaced and record:

- XHR/fetch URLs, including `admin-ajax.php?action=...` and `?wc-ajax=...`
- iframes and third-party widgets
- payment SDKs and express-checkout scripts
- plugin script handles and versions
- inline settings objects (`ajaxurl`, nonces, feature flags)

Compare "script loaded" with "feature enabled." A payment script may load while
the gateway is absent from `cart.payment_methods`.

### Page and URL surface

- Enumerate `sitemap_index.xml`, child sitemaps, and `robots.txt`.
- Classify every URL pattern: page, product, category, tag, attribute archive,
  brand, booking, account, wholesale, wishlist, unknown.
- Unknown patterns are discovery signals.

### Authenticated schema pass

If credentials are available, inspect:

- `wc/v3/products/<id>` `meta_data` for plugin fields.
- `wc/v3/orders/<id>` `meta_data` for order-line extensions.
- `wp/v2/types` and custom post types for concepts not exposed publicly.
- `wc/v3/settings/*` for enabled gateways, shipping, tax, and account settings.

### Response extension pass

Live responses are contracts. Inspect:

- `cart.extensions` keys
- `product.extensions` keys
- `checkout.extensions` keys
- `item_data` on cart lines
- `payment_requirements`
- product `type`
- booking `item_data`
- `additional_fields` and `payment_data` requirements

If an extension key appears, assume it may need a UI or a cart/checkout field
until proven otherwise.

### Owner interview

Ask the cheapest, highest-yield questions:

- What can a customer buy, book, apply for, or request?
- What does the current site do that is not "add to cart"?
- What is handled manually or offline?
- What emails/notifications must still send?
- What seasonal/promotional flows exist?
- Which reports/exports does the business rely on?
- Which features must not change at cutover?

This finds features that no endpoint reveals.

## 4. Re-run triggers

Record an index hash: `namespaces`, route count, `home`, and any known plugin
versions. Re-run this skill when:

- a plugin is installed/updated/disabled
- a new product type appears
- a new payment method appears in `cart.payment_methods`
- a new page pattern appears in the sitemap
- the current site adds a new checkout/booking/account flow
- the index hash changes

## Definition of done

- [ ] Every route is mapped, parked, or ignored with evidence.
- [ ] Every expected journey is mapped, manual, third-party, missing, or out of
      scope.
- [ ] Every money/inventory/identity/booking/legal unknown has a spike or a
      written accepted risk.
- [ ] `admin-ajax`/`wc-ajax`/iframes/scripts scanned on key pages.
- [ ] Sitemap URL patterns classified.
- [ ] Extension keys inventoried.
- [ ] `unknowns.md` and the capability register updated.
- [ ] New fingerprints and lessons promoted to the shared files.

## Anti-patterns

- "It wasn't in the list, so it doesn't matter."
- Treating `admin-ajax` as not-an-API.
- Treating a 401 route as unused.
- Treating an empty endpoint response as proof the feature is absent.
- Reverse-engineering a whole booking/B2B model from route names.
- Probing production with writes before a spike.
