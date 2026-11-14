---
name: wp-spikes
description: Use when a WordPress/WooCommerce integration is unproven and needs an end-to-end test, especially payment redirects, checkout, variable add-to-cart, bookings, auth, wholesale pricing, shipping, or gift cards. The only skill allowed to mutate.
---

# WP Spikes

Prove the write path before building the UI. This is the only skill allowed to
POST/PUT/DELETE. Every spike needs a written plan, test data, and a recorded
result.

## Non-negotiables

- Prefer staging. Do not create orders, bookings, or customer accounts on
  production without explicit approval.
- Use a dedicated test product, test customer, and test gateway.
- One spike per question. Do not bundle unrelated mutations.
- Capture requests and responses with secrets/PII redacted.
- Clean up test carts/accounts/orders where possible.
- Pass or fail explicitly. "It seemed to work" is not a result.
- If a spike fails, do not build the UI around the assumption. Record the
  fallback or the blocker.

## Inputs

- A written hypothesis and pass criteria.
- `docs/wp-discovery/` discovery docs.
- Staging base URL and test credentials.
- A test product per type (simple, variable, booking, gift card).
- A test gateway in sandbox mode.

## Artifacts

- `docs/wp-discovery/spike-results.md` (or the repo's existing spike doc)
- updates to `capability-register.md`, `field-notes.md`, `unknowns.md`

## Evidence format

For each spike record:

```markdown
## Spike N — title

- Date:
- Environment:
- Hypothesis:
- Preconditions:
- Steps:
  1.
- Requests: method, path, redacted body
- Responses: status, relevant fields, redacted ids
- Result: PASS / FAIL / BLOCKED
- Evidence:
- Decision:
- Follow-ups:
```

Redact cookies, tokens, emails, names, addresses, and payment data.

## Spike A — Auth and account

Goal: prove the customer login path, not just the admin path.

Steps:

1. Create a retail test customer.
2. Log in through the chosen mechanism.
3. Call a customer-scoped endpoint (profile, orders).
4. Call an admin-shaped endpoint to confirm it is not usable by the shopper.
5. Log out; confirm the token/session is invalid.
6. Test expiry and one refresh cycle.

Pass:

- Shopper sees only their own data.
- Admin endpoints are not exposed.
- Logout invalidates the session.
- No raw token reaches the browser.

## Spike B — Wholesale price parity

Goal: prove the shipped path applies wholesale prices.

Steps:

1. Guest: add the same product, record line/total.
2. Retail: repeat.
3. Wholesale: repeat.
4. Repeat through the exact cart and checkout path you will ship.
5. Check shipping/tax totals, not just the product price.

Pass:

- Wholesale differs from retail.
- The difference persists through checkout.
- Guest/retail never see wholesale prices.
- No cross-user cache leak.

## Spike C — Variable add-to-cart

Goal: prove the variation payload.

Steps:

1. Pick a variable product with 2+ variations.
2. If `variations[].attributes[].value` is null, use the fallback mapping.
3. POST add-item with the candidate `variation` payload.
4. Inspect the cart line: variation label, price, stock.
5. Try an invalid/unavailable combination.

Pass:

- Correct variation added.
- Cart line shows the right label and price.
- Invalid combinations fail visibly.

## Spike D — Payment redirect

Goal: prove checkout creates one order and returns cleanly.

**This spike creates a real order on the origin.** Before running it, confirm the
origin has a staging site, a test gateway, or the operator's explicit go-ahead.
Without one, prove the contract with an intentionally invalid field and record
the 400 error shape; leave the successful POST to a human.

Steps:

1. Build a cart with a test product.
2. Select a shipping rate if needed.
3. POST checkout with the real payload (`payment_method`, `payment_data`,
   `expected_total`, addresses).
4. Capture the returned redirect/order-pay URL.
5. Follow the hosted payment flow with a sandbox card.
6. Follow the return/callback.
7. Verify the order status, total, and line items.
8. Refresh the return URL; confirm no duplicate order.

Pass:

- Redirect URL is correct and reachable.
- Its host is the origin or the gateway, never arbitrary.
- Payment completes.
- WordPress marks the order paid once.
- Return page verifies the order.
- Cart is cleared only after confirmation.

Record whether the return lands on WordPress or the frontend and what cutover
routing is required.

## Spike E — Booking add-to-cart

Goal: prove the chosen booking write path.

Steps:

1. Fetch availability with required params.
2. Pick a real slot.
3. Try the Store API `booking_configuration` path if planned.
4. If it fails, try the classic `wc_bookings_field_*` / `wc-ajax` path.
5. Check whether the classic path and Store API share a session cookie.
6. Read the cart and inspect `type`, `item_data`, `quantity_limits`.
7. Remove/replace an existing booking line if the business needs one per slot.

Pass:

- A real slot is added.
- Cart shows date/time/persons.
- No duplicate booking for the same slot.
- Checkout includes the booking and correct total.

## Spike F — Shipping and tax

Goal: prove the final total before payment.

Steps:

1. Add a physical product.
2. POST `update-customer` with an address.
3. Inspect `shipping_rates`; select one.
4. Confirm `totals.total_price` includes shipping/tax.
5. Try an invalid country/postcode.
6. Test a digital-only cart.

Pass:

- Rates populate and selection persists.
- Final total matches checkout.
- Invalid addresses fail visibly.
- Digital cart skips shipping.

## Spike G — Gift card / add-on / subscription

Goal: prove extension fields.

Steps:

1. Identify the product type or cart extension.
2. Capture the required fields from the live response.
3. Add to cart with the extension payload.
4. Confirm the cart line and total.
5. Complete checkout on staging if safe.

Pass:

- Extension fields are accepted.
- Cart/order show the recipient/amount/plan correctly.
- No silent fallback to a normal product.

## Pass/fail gate

- PASS → the capability can leave the gate and be built.
- FAIL → record the failure and the fallback; do not build the failing path.
- BLOCKED → record the missing credential, plugin, or decision; escalate.

No money, inventory, identity, booking, or legal capability may be marked "done"
without a PASS or an explicitly accepted risk.

## Re-run triggers

- plugin upgrade
- gateway change
- shipping/tax rule change
- booking product change
- wholesale role/pricing change
- WordPress or PHP upgrade
- cutover to a new domain/subdomain

## Anti-patterns

- Testing on production because staging is inconvenient.
- Testing only the happy path.
- Testing presence of a field and calling it integration.
- Creating a real order with real payment details.
- Recording "works" without the request/response evidence.
- Leaving the test cart/session to pollute later spikes.
