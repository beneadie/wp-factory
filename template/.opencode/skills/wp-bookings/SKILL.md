---
name: wp-bookings
description: Use when a WordPress site sells bookings, appointments, tours, classes, resources, or rentals. Audits SSA vs WooCommerce Bookings, finds the live source of truth, and proves the availability and add-to-cart paths.
---

# WP Bookings

Bookings are where sites most often have two plugins doing one job. Find the
live source of truth, then prove the write path. A read-only availability
endpoint is not enough.

## Non-negotiables

- **One capability, one owner.** If SSA and WooCommerce Bookings both look
  plausible, audit before building.
- Installed does not mean used. Look for a published page, a menu link, a
  bookable product, and live orders/appointments.
- Availability is not add-to-cart. Prove the cart write path.
- Do not hardcode product IDs. Resolve by slug or by `type: "booking"`.
- Timezones must be explicit. Record the WordPress timezone and the timezone
  shown in the UI.
- Mutations belong in `wp-spikes`.

## Inputs

- `docs/wp-discovery/site-profile.md` and `capability-register.md`.
- `$WP`, `$OLD`, and staging credentials.
- The current site's booking page and product pages.

## Artifacts

- `docs/wp-discovery/bookings.md`
- updates to `capability-register.md`, `unknowns.md`, `spike-results.md`
- a decision row: chosen system, rejected systems, endpoint, date

## 1. Candidate audit

Search the index for the capability, not just the plugin name:

- `appointment`, `appointments`
- `booking`, `bookings`
- `bookable_resource`
- `wc_booking`
- `slots`
- `availability`
- `resources`
- `staff`
- `services`
- `events`

Known families:

- `ssa/v1`: Simply Schedule Appointments
- `wc-bookings/v1`, `wp/v2/wc_booking`, `wp/v2/bookable_resource`:
  WooCommerce Bookings

For each candidate record:

| Question | Evidence |
|---|---|
| Is there a published page using it? | Page HTML, shortcode, block, iframe |
| Is there a menu link? | Nav/sitemap |
| Is there a product of type `booking`? | Product census |
| Does it have live orders/appointments? | Admin or order data |
| Is the REST endpoint public, auth, or embed-only? | Live probe |
| Does it use `admin-ajax`/`wc-ajax` instead of REST? | Page network/JS |
| Does it take payment? | Feature flags, product price, gateway |

Overlap smells that require a stop-and-audit:

- two namespaces expose the same noun
- multiple custom post types for one concept
- embed-only endpoints with no structured data
- a configured plugin has no published page
- REST and the rendered page disagree on duration/price
- a documented endpoint returns `[]` while `admin-ajax` returns real data

## 2. SSA route

Probe:

```bash
curl -sS "$WP/wp-json/ssa/v1/embed_booking_app"
curl -sS "$WP/wp-json/ssa/v1/appointment_types/1/availability"
```

From the embed response, extract the iframe `src` and the feature flags. Record:

- appointment types and durations
- `payments`, `woocommerce`, `stripe`, `paypal`, `offline_payments` flags
- whether the embed is actually used on a published page
- whether the iframe is cross-origin and whether it sets cookies

SSA may be an unused appointment system even when its availability API works.
If it is unused, do not surface it because it is technically reachable.

If SSA is the owner, prefer the official embed script over regex-scraping a
server-side nonce. Confirm `X-Frame-Options`/CSP, mobile height, and fallback
link. Confirm whether payment happens inside SSA or not.

## 3. WooCommerce Bookings route

Probe:

```bash
curl -sS "$WP/wp-json/wc-bookings/v1/products/<id>"
curl -sS "$WP/wp-json/wc-bookings/v1/products/slots?product_ids=<id>&min_date=YYYY-MM-DD&max_date=YYYY-MM-DD"
curl -sS "$WP/wp-json/wc-bookings/v1/resources?per_page=100"
```

Record:

- product price, duration, persons/capacity, availability rules
- slot endpoint required params and response shape (`records`, `count`)
- resources/staff and whether they are required
- whether the product page uses `wc_bookings_field_*` fields
- whether availability comes from `admin-ajax`/`wc-ajax` rather than REST

`min_date` and `max_date` may be required. `[]` without them is not proof of no
availability.

### Store API booking pitfall

The base Store API add-item payload is `{id, quantity}`. Booking products reject
it. A `booking_configuration` payload may exist but can return
"Request time is not available" for slots the plugin's own availability endpoint
confirms. Do not assume the Store API path works because the field exists.

If the Store API path fails:

1. Prove the classic add-to-cart path on the product page (`add-to-cart=<id>`
   plus `wc_bookings_field_*`, or `wc-ajax`).
2. Check whether the classic path and the Store API share a session via the
   `wp_woocommerce_session_*` cookie.
3. If they do, the BFF can perform the classic add for bookings and then read
   the cart through the Store API.
4. Record the exact payload and the shared-session detail in
   `spike-results.md`.
5. Prefer the path the live site already uses.

### Cart line shape

Record:

- `type: "booking"`
- `item_data` labels/values (Booking Date, Booking Time, Persons)
- `quantity_limits.editable` (often `false`)
- whether `sold_individually` prevents a second booking
- whether the business needs remove-before-add semantics

Do not render quantity controls for booking lines. Do not let a shopper
accidentally hold two bookings for the same slot.

## 4. Timezone and display

- Record the WordPress timezone and the timezone returned by the booking API.
- Decide whether the UI displays site-local or shopper-local time.
- Show the timezone to the shopper when it can differ.
- Test a slot near midnight and a DST boundary.

## 5. Decision

Write to `bookings.md`:

- chosen source of truth (SSA, Woo Bookings, or another)
- rejected candidates and why
- read endpoint(s)
- write path (Store API, classic BFF, or embed)
- payment owner (WooCommerce, SSA, or none)
- timezone policy
- open questions and owner

## Acceptance checklist

- [ ] One booking system chosen; the other is removed from navigation/UI.
- [ ] Availability loads from the chosen endpoint with required params.
- [ ] A real booking can be added to the cart through the chosen path.
- [ ] The cart shows date/time/persons and no editable quantity.
- [ ] Checkout includes the booking and the correct total.
- [ ] The order/booking appears in WordPress with the correct slot.
- [ ] Timezone is explicit and tested.
- [ ] Fallback link exists if the embed fails.
- [ ] No hardcoded booking product IDs.

## Anti-patterns

- Surfacing an unused SSA embed because its route works.
- Building a booking form from a read-only availability endpoint.
- Assuming the Store API `booking_configuration` path works.
- Ignoring `admin-ajax`/`wc-ajax` because the REST route is documented.
- Mixing SSA availability with Woo Bookings checkout.
- Rendering quantity controls for a single-slot booking.
