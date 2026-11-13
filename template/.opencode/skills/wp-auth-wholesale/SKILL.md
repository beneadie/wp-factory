---
name: wp-auth-wholesale
description: Use when mapping customer accounts, JWT or cookie auth, login, orders, wholesale registration, role-based trade pricing, or bulk order forms on a headless WordPress/WooCommerce site.
---

# WP Auth & Wholesale

Authentication is the gate to accounts and wholesale. There is no such thing as
"the JWT plugin" across sites. Detect what exists, choose a mechanism, and prove
that wholesale prices actually change through the path you will ship.

## Non-negotiables

- Do not assume JWT. Search namespaces and probe endpoints.
- Application Passwords are a server-to-server REST credential, not a customer
  login flow.
- Keep tokens server-side in httpOnly cookies. The browser never sees a raw JWT.
- Never cache or share role-priced responses across users. They are identity
  dependent.
- Prove wholesale pricing through the **actual cart/checkout path**, not only
  `wc/v3`.
- One capability, one owner; wholesale plugins often overlap.
- Mutations belong in `wp-spikes`.

## Inputs

- `docs/wp-discovery/site-profile.md` and `capability-register.md`.
- A staging retail user and a staging wholesale user.
- `$WP` and, if needed, a helper plugin for auth/config.

## Artifacts

- `docs/wp-discovery/auth-wholesale.md`
- updates to `capability-register.md`, `unknowns.md`, `spike-results.md`

## 1. Detect the auth mechanism

Probe:

```bash
for path in /wp/v2/users/me /wp/v2/menus /wc/v3/customers /wc/v3/orders; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$WP/wp-json$path")
  printf "%s %s\n" "$code" "$path"
done
```

Search the index namespaces for auth signals:

- `jwt-auth`, `simple-jwt-login`, `wp-api-jwt`, `bearer`
- `application-passwords`
- `loginpress`, `two-fa`
- custom helper namespaces (`app/v1`, etc.)

Record which is present:

| Mechanism | Present? | Use for |
|---|---|---|
| JWT plugin |  | customer login + BFF bearer |
| Application Passwords |  | server-to-server only |
| Cookie + `X-WP-Nonce` |  | BFF login bridge |
| Custom helper |  | site-specific |
| None |  | blocker for accounts/wholesale |

If no customer-auth mechanism exists, record it as a blocker. Do not silently
plan a JWT implementation because another site used one.

## 2. Login and session design

Preferred pattern:

1. Browser posts credentials to the BFF over HTTPS.
2. BFF authenticates against WordPress.
3. BFF stores the token/session in an httpOnly, Secure, SameSite cookie.
4. BFF attaches the credential on every authenticated request.
5. On expiry, refresh or force re-login with a clear message.
6. Logout clears the cookie and server-side session.

Record:

- login, refresh, logout endpoints
- token lifetime and refresh strategy
- cookie flags and CSRF protection
- rate limiting and lockout behavior
- password reset and email verification flow
- whether the WordPress login page must remain reachable at cutover

## 3. Accounts

Probe the endpoints actually available for the auth mechanism. Record:

- customer profile read/update
- order list and order detail
- addresses
- downloads
- payment methods (if the site supports saved cards)
- account creation and password reset

Do not assume `wc/v3/customers/<id>` works for a shopper just because it exists;
it is an admin-shaped API. Prefer a customer-scoped endpoint or a BFF that
enforces ownership.

## 4. Wholesale audit

List every wholesale namespace and assign one owner per capability:

| Capability | Candidate namespaces | Owner | Evidence |
|---|---|---|---|
| Role/pricing | `wholesale/v1`, `wc/v3/wholesale`, `wwp/v1` |  |  |
| Registration/approval | `wwlc/v1` |  |  |
| Bulk order form | `wwof/v3` |  |  |
| Cart price extension | `wwpp_block` on cart |  |  |

Then answer:

- Is pricing applied to the Store API cart, or only to authenticated `wc/v3`?
- Does the shopper need a role, a capability, or a customer group?
- Is registration apply → approve → role, or instant?
- What are the pending/rejected/approved UI states and emails?
- Are minimum quantities, category restrictions, or tiered prices in play?
- Does the bulk order form save orders, carts, or quotes?
- Does the wholesale price include or exclude tax/shipping differently?

## 5. Price-parity test (required)

Do this in a spike, not in production UI:

1. As a guest, add the same product to the cart. Record the line and total.
2. As a retail user, repeat. Record.
3. As a wholesale user, repeat. Record.
4. Repeat through the exact path you will ship: Store API cart, BFF checkout
   GET, and checkout POST if safe on staging.

Pass criteria:

- Wholesale price differs from retail for at least one product.
- The difference persists through cart, shipping, tax, and checkout totals.
- A retail/guest session never sees wholesale prices.
- Caching does not serve a wholesale response to a guest.

If pricing only changes in `wc/v3`, the Store API checkout is not wired for
wholesale. That is a blocker, not a display bug.

## 6. Security

- Never put a raw JWT in localStorage, a URL, or client logs.
- Never log Authorization headers or customer data.
- Do not share cached responses across users.
- Enforce authorization in the BFF, not only in the UI.
- Use CSRF protection for cookie-authenticated mutations.
- Rotate any test credentials after the spike.

## Acceptance checklist

- [ ] Auth mechanism identified or marked absent.
- [ ] Login, refresh, logout, and expiry behavior defined.
- [ ] Customer endpoints are customer-scoped, not admin-scoped.
- [ ] One owner per wholesale capability.
- [ ] Wholesale price parity proven through cart and checkout.
- [ ] Registration/approval states modeled.
- [ ] Bulk order path proven or explicitly out of scope.
- [ ] No role-priced response is cacheable across users.
- [ ] No raw token reaches the browser.

## Anti-patterns

- Assuming JWT because the plan says JWT.
- Treating Application Passwords as shopper login.
- Testing wholesale price only on a product endpoint.
- Caching a wholesale catalog with the public catalog.
- Using `wc/v3/customers` from the browser.
- Building the bulk order grid before proving the price path.
