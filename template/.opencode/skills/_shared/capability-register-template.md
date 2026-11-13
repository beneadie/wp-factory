# Capability Register

Site:
Index captured:
Index hash:
Namespaces:
Route count:
Current public site:

Status values: `Known`, `Suspected`, `Unknown`, `Parked`, `Ignored`.
Risk values: `low`, `med`, `high`.
Gate values: `none`, `probe`, `spike`, `decision`.

One row per capability, not per route. Add rows; never delete a row without
recording why.

| Capability | Status | Source route | Auth | Read/Write | Evidence | Extensions/args | Risk | Gate | Owner |
|---|---|---|---|---|---|---|---|---|---|
| Content pages |  | `/wp/v2/pages` | public | read |  |  |  |  | wp-content-seo |
| Catalog |  | `/wc/store/v1/products` | public | read |  |  |  |  | wp-catalog-cart |
| Product options |  | `/wc/store/v1/products` | public | read |  |  |  |  | wp-catalog-cart |
| Cart |  | `/wc/store/v1/cart` | public + token | read/write |  |  |  |  | wp-catalog-cart |
| Coupons |  | `/wc/store/v1/cart/apply-coupon` | public + token | write |  |  |  |  | wp-catalog-cart |
| Shipping |  | `/wc/store/v1/cart/select-shipping-rate` | public + token | write |  |  |  |  | wp-checkout-payments |
| Checkout |  | `/wc/store/v1/checkout` | public + token | write |  |  |  |  | wp-checkout-payments |
| Payments |  | `cart.payment_methods` | public + token | write |  |  |  |  | wp-checkout-payments |
| Accounts |  | `/wc/v3/customers` | auth | read/write |  |  |  |  | wp-auth-wholesale |
| Orders |  | `/wc/v3/orders` | auth | read |  |  |  |  | wp-auth-wholesale |
| Wholesale pricing |  |  |  |  |  |  |  |  | wp-auth-wholesale |
| Wholesale ordering |  |  |  |  |  |  |  |  | wp-auth-wholesale |
| Bookings |  |  |  |  |  |  |  |  | wp-bookings |
| Gift cards |  |  |  |  |  |  |  |  | wp-catalog-cart |
| Forms |  |  |  |  |  |  |  |  | wp-content-seo |
| Media |  | `/wp/v2/media` | public | read |  |  |  |  | wp-content-seo |
| SEO |  | `yoast_head_json` | public | read |  |  |  |  | wp-content-seo |
| Redirects |  | `/redirection/v1` |  | read |  |  |  |  | wp-content-seo |
| Consent/analytics |  |  |  |  |  |  |  |  | wp-content-seo |
| Navigation |  | `/wp/v2/menus` | auth | read |  |  |  |  | wp-content-seo |
| Search |  | `/wc/store/v1/products?search=` | public | read |  |  |  |  | wp-catalog-cart |

## Unmapped routes

Link to `unknowns.md`. Every residual route must have a verdict there:
`adopt`, `spike`, `park`, or `ignore`. No route may be silently skipped.

## Decisions

Record capability owner decisions here. One capability, one owner.

| Capability | Chosen source | Rejected sources | Why | Date |
|---|---|---|---|---|
