---
name: wp-checkout-payments
description: Use when mapping headless WooCommerce checkout, payment gateways, redirect gateways, Realex, Stripe, PayPal, shipping rates, taxes, nonces, order-pay URLs, or order verification.
---

# WP Checkout & Payments

Prove the money path before building the form. Checkout is where installed
plugins, enabled gateways, shipping rules, and cross-origin return URLs collide.

## Non-negotiables

- Read everything at request time. Never hardcode gateway IDs, titles,
  descriptions, order-pay URLs, shipping rate IDs/labels/prices, country/state
  lists, or allowed shipping countries.
- `cart.payment_methods` is the enabled list. The checkout schema enum is a
  catalogue of possible IDs, not enabled gateways.
- Test redirect gateways end-to-end. A gateway can be "available" in the cart
  and still fail on order-pay or return.
- Keep `Cart-Token` and `Nonce` server-side (httpOnly cookies). Never expose a
  raw JWT or token to the browser.
- Mutations belong in `wp-spikes` until the contract is proven.
- No final total shown before payment = no checkout.

## Inputs

- `docs/wp-discovery/site-profile.md` and `capability-register.md`.
- `docs/wp-discovery/commerce.md` from `wp-catalog-cart`.
- A staging site, a test product, and a test gateway.

## Artifacts

Update `docs/wp-discovery/commerce.md` and `capability-register.md`.
If the repo has a checkout doc (for example `docs/checkout.md`), update it
instead of creating a parallel file.

Use `../_shared/probe-commands.md`.

## 1. Gateway truth

From a live cart:

```json
{
  "payment_methods": ["..."],
  "extensions": { "...": "..." },
  "needs_payment": true,
  "needs_shipping": true,
  "payment_requirements": ["products"]
}
```

Record:

- enabled method IDs from `payment_methods`
- extension keys that imply express checkout or payment fields
- one gateway per class: redirect, inline/hosted fields, express wallet, offline
- whether the gateway is attached to a block/Store API integration

Compatibility checks:

- Does the plugin ship block/Store API assets? This is a hint, not proof.
- Does `POST /checkout` return a `payment_result.redirect_url`, a
  `payment_details` URL, or a client token?
- Does the flow need `payment_data` (token, payment method ID, wallet data)?
- Does the flow need `additional_fields` or an extension object?
- Does 3-D Secure/SCA redirect away and return?

Reject the plan if the enabled gateway has no Store API path and no proven
redirect handoff. Do not invent a gateway integration from its admin namespace.

## 2. Session and nonce contract

Capture from the live cart response headers:

- `Cart-Token`
- `Nonce`
- `Access-Control-Expose-Headers`

Rules:

- The BFF primes `Nonce` from a `GET /cart` when missing.
- Persist refreshed `Cart-Token` and `Nonce` on every response, not only on
  mutations.
- On `401`/nonce errors, refresh the nonce and retry once.
- Support the legacy `X-WC-Store-API-Nonce` header if `Nonce` is absent.
- Keep cookies `httpOnly`, `Secure` in production, `SameSite=Lax` or stricter.
- Browser-side Store API calls are a last resort; prefer the BFF.

## 3. Shipping and tax

Flow:

```
POST /cart/update-customer        -> sets address, returns shipping_rates
POST /cart/select-shipping-rate   -> picks a returned rate_id
GET  /cart                        -> final totals for display
POST /checkout                    -> places the order
```

Record:

- `needs_shipping` for physical vs digital carts.
- `shipping_rates` before and after an address.
- Whether a rate is `selected` by default; if not, select the first returned.
- Whether taxes/shipping are included in `totals.total_price`.
- Country/state validation rules and allowed shipping destinations.

Do not present a cart total as the final total when shipping/tax are unresolved.
The checkout page must show the final total next to the pay button.

## 4. Checkout POST contract

Read the live schema from `OPTIONS /checkout` and the cart. Record every field you
send and why:

- `billing_address`, `shipping_address`
- `payment_method`
- `payment_data` (gateway-specific)
- `expected_total` (guard against stale totals)
- `create_account`, `customer_password`
- `customer_note`
- `additional_fields` (custom checkout fields)
- `extensions` (plugin contracts)

Rules:

- `expected_total` should be the minor-unit total the shopper confirmed. Handle
  `409` by refreshing the cart and asking the shopper to retry.
- If `create_account` is offered, confirm whether `customer_password` is
  required or generated. Do not collect a password you do not send.
- Render custom fields from the schema, not from a hardcoded list.
- Map error shapes (`{code, message, data:{status}}`) to visible messages; strip
  HTML from messages.
- Never treat HTTP 200 as success if `payment_result` is missing or the order id
  is absent.

## 5. Redirect gateways and return URLs

For a redirect gateway, the likely flow is:

1. `POST /checkout` creates the order.
2. The gateway returns an order-pay URL or redirect URL.
3. The browser completes payment on the gateway's hosted page.
4. The gateway returns to WordPress via the order-pay page and/or
   `?wc-api=<Gateway>`.
5. WordPress marks the order paid and shows its order-received page.

Record:

- the exact redirect URL returned by the API
- whether it is relative or absolute
- whether it points at WordPress, a gateway, or the frontend
- the return URL and callback URL
- whether the return is a GET redirect or a server-to-server callback
- whether the order key is required

Cutover requirement: a redirect gateway's order-pay and callback URLs must stay
on the WordPress origin. Plan one of:

- WordPress on a `wp.` subdomain, or
- reverse-proxy `/wp-json`, `/wp-content`, `/wp-admin`, `/checkout/order-pay`,
  and `?wc-api=...` to WordPress.

Do not rebuild the gateway's hosted UI. Hand off to it and verify the order on
return. Do not construct the order-pay URL yourself.

## 6. Order verification

Never confirm an order from query-string `order`/`key` alone.

- Fetch the order through the Store API or an authenticated BFF call.
- Confirm the order key, status, total, currency, and line items.
- Show a pending state if payment is not yet confirmed.
- Clear the local cart only after the order is verified.
- Handle duplicate return hits and refresh idempotently.

If the Store API exposes an order endpoint (`GET /order/{id}`), verify its
required key/auth contract in the spike. If it does not, use an authenticated
`wc/v3/orders/<id>` call through the BFF with a server-held credential.

## 7. Acceptance checklist

- [ ] Payment methods come from `cart.payment_methods`.
- [ ] Gateway titles come from the API/config helper, not code.
- [ ] Physical cart: address → rates → rate selection → final total → pay.
- [ ] Digital cart: no shipping step; checkout still completes.
- [ ] `expected_total` mismatch is handled.
- [ ] Custom checkout fields render from the schema.
- [ ] Account creation either works or is hidden.
- [ ] Redirect gateway reaches hosted payment and returns to WordPress.
- [ ] Return creates/updates one order, not duplicates.
- [ ] Order confirmation is verified, not inferred.
- [ ] Error responses are visible and actionable.
- [ ] No gateway ID, order-pay URL, shipping rate, or country list is hardcoded.

## Anti-patterns

- Inferring enabled gateways from the checkout enum.
- Assuming a gateway supports Store API because it is enabled.
- Building a payment form for a hosted/redirect gateway.
- Confirming an order from query params.
- Sending `create_account` without a password decision.
- Hiding shipping/tax until after payment.
- Treating a loaded WooPayments/PayPal script as an enabled gateway.
