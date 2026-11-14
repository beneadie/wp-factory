---
name: store-checkout
description: Use only when SITE_MODE=store, in the commerce build phase, after the catalogue exists. Owns the cart, checkout, payment handoff and order confirmation. Does not own catalogue routes, product data or visual design.
---

# Store Checkout

Build the buying path on a shop, against the origin's **proven** Store API
contract. Discovery already happened; this phase writes the code.

If `docs/wp-discovery/commerce.md` and `spike-results.md` do not prove a write
path, do not build one. Record `BLOCKED — <reason>` and stop.

## Inputs

- `docs/wp-discovery/commerce.md` — payment methods, cart contract, extensions.
- `docs/wp-discovery/capability-register.md` — the owner of each capability.
- `docs/wp-discovery/spike-results.md` — the proven add-to-cart and checkout
  payloads.
- `docs/site/base.md` — the route map the catalogue build already established.

## Artifacts

- `docs/site/commerce-build.md` — routes, BFF endpoints, cookie names, which
  capabilities were built, which were deferred and why.
- `docs/checkout.md` — update it if it exists; do not create a parallel file.

## Non-negotiables

- **Tokens stay server-side.** `Cart-Token` and `Nonce` live in `httpOnly`
  cookies held by the BFF. Never expose a raw JWT or nonce to the browser.
- **Every cart/checkout response is `no-store`.** A guest must never receive
  another guest's cart.
- **Never hardcode a gateway ID, title, shipping rate, country list or
  order-pay URL.** Read them from the API at request time.
- **Never clone the card form.** Card data goes to the gateway, not to this app.
- **A payment must never be lost.** If the custom page cannot prepare a payment,
  fall back to the origin's own pay page rather than showing an error.
- **No invented order.** A `200` without an order id and a payment result is a
  failure, not a success.

## 1. Cart BFF

Keep one module that talks to the Store API and is used by every route, so the
cookie and retry logic exists once:

```
GET  /api/cart                        -> carts, primes token + nonce
POST /api/cart/add-item               -> { id, quantity, variation[] }
POST /api/cart/update-item            -> { key, quantity }
POST /api/cart/remove-item            -> { key }
POST /api/cart/apply-coupon           -> { code }
POST /api/cart/remove-coupon          -> { code }
POST /api/cart/update-customer        -> address, returns shipping_rates
POST /api/cart/select-shipping-rate   -> { rate_id } from the response
POST /api/cart/reset                  -> clears cart + session cookies
```

Rules:

- Prime from `GET /cart` when the token or nonce is missing.
- Persist a refreshed `Cart-Token` and `Nonce` on **every** response, not only
  on mutations.
- On a nonce error, refresh once and retry the request exactly once.
- Support the legacy nonce header if the current one is absent.
- Reset clears the cart, the token and the WordPress session together.

## 2. Cart UI

- Line items show the variation label, quantity limits, `sold_individually`,
  item data and line totals from the API.
- Booking/gift-card lines may forbid quantity edits — do not render a control
  the API says is not editable.
- Updates are optimistic, then reconciled from the API response. Tag each
  request and ignore stale completions so a fast second click cannot be
  overwritten by a slow first response.
- Surface the API `message` on failure. No dead clicks, no silent errors.
- Empty cart is a real state with a route back to the catalogue.
- Perceived performance follows `frontend-substrate`: pending paint within
  200ms, never blank over 500ms.

## 3. Address, shipping and total

```
POST /cart/update-customer        -> sets address, returns shipping_rates
POST /cart/select-shipping-rate   -> picks a returned rate_id
GET  /cart                        -> final totals
```

- Digital-only cart: no shipping step.
- If no rate is marked selected, select the first returned one.
- Never present a cart total as the final total while shipping or tax is
  unresolved. Show the final total next to the pay button.
- Send `expected_total` (minor units) with the order. On `409`, refresh the cart
  and ask the shopper to retry; do not silently retry the order.

## 4. Order creation

`POST /checkout` through the BFF, with the fields the schema requires:

- `billing_address`, `shipping_address`
- `payment_method` from `cart.payment_methods` — never a literal
- `payment_data` only when discovery proved the gateway needs it
- `additional_fields` rendered from the `OPTIONS /checkout` schema
- `create_account` only when the password question is settled
- `customer_note`, `expected_total`

Map error shapes to visible messages, strip HTML, and treat 4xx as failures.

## 5. Payment handoff

The last step is a handoff, not a payment page:

1. `POST /checkout` creates the order and returns `order_id`, `order_key` and
   `payment_result`.
2. If the result is already paid (offline method), go to confirmation.
3. Otherwise redirect to the gateway using `payment_result.redirect_url`
   (or a URL-shaped `payment_details` value). Resolve relative URLs against the
   origin.
4. Validate the target host against the origin and the gateway's hosts. Never
   redirect to an arbitrary URL from the response.
5. Use a GET handoff page so a refresh cannot create a second order.

Never construct `/checkout/order-pay/...` yourself. If the origin exposes a
server-side endpoint that prepares a hosted form, it is optional: use it when
present, and fall back to `redirect_url` when it is absent, unreachable, or the
gateway is unsupported. Write that fallback down in `docs/checkout.md`; it is
the difference between a slow payment and a lost sale.

Inline gateways (cards collected inside the page by a JS SDK) are a separate
integration. If discovery found one and no redirect path exists, record it as
deferred rather than faking it.

## 6. Confirmation

- Verify the order server-side by id **and** key. Never trust the query string.
- Show a pending state until payment is confirmed.
- Clear the cart only after the order is verified.
- Duplicate return hits must be idempotent — one order, one confirmation.

## 7. Identity

- Clear the cart session on login and logout so the next guest cannot inherit a
  cart.
- Account, cart and checkout responses are identity-dependent: no shared cache,
  no ISR, no server cache keyed only by URL.

## Acceptance

- [ ] Add, update, remove, coupon and shipping rate all round-trip through the
      API, and totals match it.
- [ ] Variation selection reaches the cart line.
- [ ] Payment methods come from `cart.payment_methods`.
- [ ] `expected_total` mismatch is handled, not ignored.
- [ ] Payment redirects to the real hosted page; no card field exists in `src/`.
- [ ] Redirect target host is validated.
- [ ] Confirmation verifies the order and clears the cart.
- [ ] Guest sessions are isolated; nothing cart-shaped is shared-cached.
- [ ] `npm run typecheck`, `npm run lint`, `npm run build` pass once.

## Anti-patterns

- Building a card form.
- Reading `payment_methods` from the checkout schema enum instead of the cart.
- Storing the cart token in `localStorage`.
- Treating a 200 as a placed order.
- Clearing the cart before the order is verified.
- Retrying an order POST automatically.
- Assuming shipping is always required.
- Assuming every shop has the same gateway.
