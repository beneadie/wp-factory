---
name: wp-catalog-cart
description: Use when mapping WooCommerce catalog, product types, variable products, add-to-cart, cart extensions, coupons, gift cards, or Store API cart behavior for a headless frontend.
---

# WP Catalog & Cart

Determine what the shopper can actually buy and add to the cart. The catalog is
not "products"; it is the product-type mix, option model, and cart contract.

## Non-negotiables

- Count product types before estimating UI. A product page without a variation
  selector is a conversion bug, not a styling detail.
- Read the Store API add-item schema from the live site, not from memory.
- The base add-item payload is `id`, `quantity`, `variation`. Anything else
  (booking, gift card, bundle, subscription, add-on) may need extension fields.
- Never hardcode product IDs, variation IDs, attribute values, or extension keys.
- Read `cart.extensions`; every key is a potential required UI.
- GET-only except in `wp-spikes`.

## Inputs

- `docs/wp-discovery/site-profile.md` and `capability-register.md`.
- `$WP` base URL.
- A staging site for write-path spikes.

## Artifacts

Update `docs/wp-discovery/commerce.md` and `capability-register.md`.

Use `../_shared/probe-commands.md` for product and cart probes.

## 1. Product census

Fetch all products (respect `x-wp-total` and `x-wp-totalpages`) and record:

- total count
- count by `type`
- count with `has_options`
- count with `variations`
- count of purchasable, in-stock, on-backorder
- one example per type, with slug and permalink

Minimum types to look for: `simple`, `variable`, `booking`, `pw-gift-card`,
`subscription`, `variable-subscription`, `bundle`, `composite`, `grouped`,
`external`, `variation`.

Output a table:

| Type | Count | Example | Options? | Extra cart fields? | Owner |
|---|---|---|---|---|---|

If a type is unfamiliar, hand it to `wp-unknowns`; do not force it into the
simple-product flow.

## 2. Variable products

For a representative sample (at least 10, plus any with odd shapes):

1. Fetch the parent product.
2. Fetch `?type=variation&parent=<id>`.
3. Map each variation to its attribute values.
4. Flag `attributes: []` or `attributes[].value: null`.

Known failure mode: a parent can return variations with `value: null` while the
variation endpoint returns empty `attributes`. Fall back to:

- variation `name`
- variation `sku`
- `add_to_cart.url` (`variation_id` query param)
- the parent's attribute terms

Then verify the exact payload in `wp-spikes`:

```json
{
  "id": 12345,
  "quantity": 1,
  "variation": [
    { "attribute": "pa_size", "value": "large" }
  ]
}
```

Do not assume the attribute key is the taxonomy, the display name, or the term
slug. Confirm with one real add-to-cart call, then encode the mapping.

Acceptance:

- Every variation renders with the correct label, price, stock, and image.
- Unavailable combinations are disabled correctly.
- The selected variation is sent and appears on the cart line.
- A null/partial variation map falls back without crashing.

## 3. Add-to-cart matrix

Test one product of each type. Record the required payload and result.

| Product type | Payload | Status | Cart line shape | Notes |
|---|---|---|---|---|
| simple | `{id, quantity}` |  |  |  |
| variable | `{id, quantity, variation}` |  |  |  |
| booking | booking date/time/persons |  |  | often not Store API |
| gift card | amount/recipient |  |  | cart extension |
| subscription | plan/variation |  |  |  |
| bundle/composite | component selections |  |  |  |
| add-on | additional fields |  |  |  |

Known Store API rule: a booking product without booking configuration returns
`woocommerce_rest_cart_invalid_product_booking`. Do not invent a
`booking_configuration` payload until you have proved it on the live site. A
classic add-to-cart path can be the correct fallback when the Store API path is
unproven; record the shared-session detail.

## 4. Cart contract

Probe `GET /cart` and record:

- `Cart-Token` and `Nonce` headers; where they are stored; how they refresh.
- `payment_methods` (the real enabled list).
- `extensions` keys and what they imply.
- `needs_payment`, `needs_shipping`, `payment_requirements`.
- `shipping_rates` when empty and after an address.
- `items[].type`, `items[].variation`, `items[].item_data`, `quantity_limits`,
  `sold_individually`.
- `totals` and currency minor units.
- `errors` shape.

Cart line rules:

- Booking lines: `quantity_limits.editable` is often `false`; do not render
  quantity controls.
- `sold_individually` may not prevent adding a second booking. If the business
  wants one booking per product, remove existing lines before adding.
- Gift cards may appear as normal products plus a cart extension. Render the
  recipient/amount UI from the extension contract, not from the product name.
- Item `permalink` may be absolute. Normalise to a local path only if the route
  matches.

## 5. Coupons and fees

- Apply/remove a real coupon in staging. Record success and error shapes.
- Read `coupons` from the cart; do not cache them in client state only.
- Check whether fees/discounts appear as `fees`, `coupons`, or extension data.

## 6. UI acceptance

- [ ] Product cards link to the correct URL pattern.
- [ ] Simple products add successfully.
- [ ] Variable products render a selector per attribute, and selecting a valid
      combination updates price, stock and image. Invalid combinations are
      unavailable. This holds even when add-to-cart is out of scope for the
      build.
- [ ] Booking/gift-card/subscription products route to their own UI, not the
      simple add button.
- [ ] Cart shows variation, item data, quantity rules, and line totals.
- [ ] Cart totals match the Store API after every mutation.
- [ ] Coupons work and errors are shown.
- [ ] Empty-cart and stock-error states are handled.

## 7. Rendering handoff (even without a cart)

Discovery ends here; `site-base` builds the product page. Give it what it needs:

- the attribute order and labels come from the parent's `variations[]`;
- the set of valid combinations comes from the same rows, so a missing
  combination must render as unavailable;
- partial-null rows fall back to the variation name/SKU/`add_to_cart.url`/parent
  terms, and that fallback is for **display** as well as cart payloads;
- selecting an option is still meaningful without a cart: it changes the shown
  price, stock, SKU and image.

If the build ships no cart, the control is an availability preview, not a dead
buy button. Do not drop the selector because the write path is deferred.

## Anti-patterns

- Sending only `{id, quantity}` for every product type.
- Printing variation attributes as static text because the cart is deferred.
- Assuming `variations` on the parent is enough to render the selector.
- Assuming `has_options: false` means simple.
- Treating a 400 booking error as a UI bug instead of a missing integration.
- Caching the cart in a client store as the source of truth.
- Hardcoding `realex_redirect`, product IDs, or attribute slugs.
