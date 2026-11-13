---
name: cutover
description: Use when moving the headless storefront to production or a new domain - DNS, apex vs WordPress subdomain, reverse proxy for wp-json/wp-content/wp-admin/payment callbacks, redirect map, sitemap/robots, SEO sign-off and rollback. Do not use during initial build.
---

# Cutover

Shipping a headless storefront is a routing problem, not a deploy button. The
new site lives on Netlify, but WordPress must keep serving the routes only it
can: the REST API, media, admin, order-pay, and payment callbacks. Plan the
domain and proxy before the DNS change.

## Non-negotiables

- Payment callbacks and order-pay URLs stay reachable on the WordPress origin.
- `/wp-json`, `/wp-content`, `/wp-admin`, `/checkout/order-pay` and
  `?wc-api=...` reach WordPress (subdomain or reverse proxy).
- Every old URL has a redirect or a replacement. No silent 404s on money or
  content pages.
- Do not flip DNS until a preview deploy has passed the full verification gate.
- Have a rollback: keep the old WordPress frontend reachable until sign-off.
- Never commit secrets; production env vars live in the host.

## Inputs

- A passing `verification` run on the preview deploy.
- The redirect export (`/redirection/v1` or the plugin export).
- The current sitemap index and `robots.txt`.
- WordPress origin domain and the target storefront domain.
- Payment gateway callback settings and the helper's `NEXT_SITE_URL`.

## 1. Choose the domain model

Pick one and write it down:

- **Subdomain** — WordPress on `wp.example.com`, storefront on `example.com`.
  Cleanest. Update gateway callback and `MERCHANT_RESPONSE_URL`.
- **Reverse proxy** — storefront on the apex, proxy the WordPress routes to the
  origin. More moving parts; needed if the callback must stay on the apex.

Record the exact paths proxied and where they terminate.

## 2. Payment and callback routing

- Confirm the order-pay URL and the gateway return/callback resolve on the
  WordPress origin.
- Confirm `NEXT_SITE_URL` points at the storefront so the order-received page
  redirects to the storefront confirmation.
- Re-run the redirect-gateway spike (`wp-spikes` Spike D) against the production
  configuration with a low-value order.
- Verify one order lands once, with the correct status and totals.

## 3. Redirect map

- Export every rule; classify internal / external / regex / query.
- Add rules for old plugin URLs that the new site replaces (bookings, wishlist,
  builder pages).
- Include page, product, category, tag, attribute archives, and any special
  routes (account, wholesale, bookings).
- Check trailing-slash behaviour, chains and loops.
- Keep campaign/query URLs the business relies on.
- Record any rule that cannot be ported and who owns the decision.

## 4. SEO sign-off

- Canonical, OG, Twitter, JSON-LD (Product, BreadcrumbList, Organization,
  LocalBusiness) present on the relevant page types.
- `sitemap.xml` and `robots.txt` are served by the frontend and match the live
  URL set.
- 404 and redirect behaviour verified.
- URL parity confirmed for `/shop/...`, `/product-category/...`, pages.
- Spot-check a sample against the original (title, description, canonical).

## 5. Infrastructure

- Env vars set on the host: WP base URL, revalidation secret, contact endpoint,
  site URL, helper URL; no dev-preview flag in production.
- Image CDN allowlists every origin that serves media (production, preview,
  staging).
- Revalidation webhook from WordPress reaches the frontend; a product save
  refreshes the relevant page.
- Cloudflare/DNS, TLS, HSTS, and caching rules for `/wp-content/uploads`.
- Monitoring and error reporting on.

## 6. Go-live sequence

1. Deploy to a preview URL; run `verification`.
2. Point `NEXT_SITE_URL` at the preview; test order-received redirect.
3. Run a low-value real payment end-to-end.
4. Lower DNS TTL ahead of the switch.
5. Switch DNS / proxy.
6. Smoke test: home, category, PDP, cart, checkout, booking, account, search,
   sitemap, robots, redirects, 404.
7. Watch errors and orders for the first hours.

## 7. Rollback

- Keep the old WordPress frontend available during the window.
- Know the one action that reverts DNS/proxy.
- Record how to disable the helper redirect if the storefront confirmation breaks.

## Acceptance checklist

- [ ] Domain model documented; proxy paths listed.
- [ ] Payment callback and order-pay reachable; one real order verified.
- [ ] `NEXT_SITE_URL` correct in production.
- [ ] Redirect map covers all current URL patterns.
- [ ] Sitemap/robots served by the frontend.
- [ ] Metadata/JSON-LD spot-checked against the original.
- [ ] Image CDN allowlists all media origins.
- [ ] Revalidation works from WordPress.
- [ ] No dev-only flags in production.
- [ ] Rollback written and understood.
- [ ] Old frontend kept until sign-off.

## Anti-patterns

- Moving DNS before the preview passes verification.
- Leaving the payment callback on a host the new site replaced.
- Porting redirects "later".
- Forgetting attribute/tag archives in the redirect map.
- Shipping with the image CDN missing the production origin.
- Deleting the old site before the first real order succeeds.
- Hardcoding the gateway callback instead of reading it from configuration.
