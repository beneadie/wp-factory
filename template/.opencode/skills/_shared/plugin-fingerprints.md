# Plugin Fingerprints

A growable map from route prefixes and script handles to plugins and likely
capabilities. Extend it per site. Do not treat a fingerprint as proof of use;
confirm with a live probe and the current site's HTML/JS.

## Route prefixes

| Prefix | Plugin / system | Likely capability | Default verdict |
|---|---|---|---|
| `/wp/v2` | WordPress core | pages, media, taxonomies, menus | probe; menus often 401 |
| `/wc/store`, `/wc/store/v1` | WooCommerce Store API | catalog, cart, checkout | adopt |
| `/wc/v1`, `/wc/v2`, `/wc/v3` | WooCommerce REST | accounts, orders, variations, settings | auth probe |
| `/wc-admin`, `/wc-analytics` | WooCommerce Admin | dashboards, reports | ignore |
| `/payments/woopay` | WooPay / WooPayments | express checkout | probe if cart exposes it |
| `/wc/v3/payments` | WooPayments | transactions, disputes | admin unless gateway enabled |
| `/wc/v3/paypal-*` | PayPal | buttons, webhooks | probe if enabled |
| `/ssa/v1` | Simply Schedule Appointments | appointments, tours | probe; often embed-only |
| `/wc-bookings/v1`, `/wp/v2/wc_booking`, `/wp/v2/bookable_resource` | WooCommerce Bookings | bookable products, slots, resources | probe |
| `/wholesale/v1`, `/wwp/v1`, `/wc/v3/wholesale`, `/wwof/v3`, `/wwlc/v1` | Wholesale Suite family | roles, pricing, order form, lead capture | choose one owner per capability |
| `/fluentform/v1` | Fluent Forms | contact/enquiry submissions | probe |
| `/yoast/v1` | Yoast SEO | `yoast_head_json`, schema | adopt |
| `/redirection/v1` | Redirection | 301/302 rules | probe |
| `/cky/v1` | CookieYes | consent settings | rebuild in frontend |
| `/popup-maker/v2`, `/pum/v1` | Popup Maker | popups | rebuild in frontend |
| `/divi/v1` | Divi | builder content | drop; migrate content |
| `/wp-block-editor/v1` | WordPress | block editor | admin |
| `/sg-ai-studio` | SiteGround | AI builder | ignore |
| `/jetpack/v4` | Jetpack | sync, modules | ignore |
| `/ai1wm/v1` | All-in-One WP Migration | backups | ignore |
| `/wccom-site/v3` | WooCommerce.com | updates | ignore |
| `/wc-telemetry`, `/wc-push-notifications`, `/wc-admin-email` | WooCommerce | telemetry, admin mail | ignore |
| `/really-simple-security` | RSD | login hardening | ignore |
| `/loginpress/v1` | LoginPress | login UI | replaced by frontend auth |
| `/wp-abilities/v1` | WP Abilities API | new core feature | watch |
| `/batch/v1` | WordPress | batched requests | utility |
| `/oembed/1.0` | WordPress | embeds | optional |

## Script handles

| Handle / path fragment | Plugin | Notes |
|---|---|---|
| `wp-content/plugins/woocommerce/` | WooCommerce | Store API present |
| `wp-content/plugins/woocommerce-bookings/` | Woo Bookings | look for `wc_bookings_field_*`, `wc-bookings-booking-form` |
| `wp-content/plugins/woocommerce-gateway-realex-redirect/` | Realex Redirect | check `blocks/` assets before assuming Store API support |
| `wp-content/plugins/woocommerce-payments/` | WooPayments | script may load while gateway is disabled |
| `wp-content/plugins/simply-schedule-appointments/` | SSA | `embed_booking_app`, `iframe-outer.js` |
| `wp-content/plugins/fluentform/` | Fluent Forms | check submission endpoint |
| `wp-content/plugins/cookieyes/` | CookieYes | consent |
| `wp-content/plugins/popup-maker/` | Popup Maker | popups |
| `wp-content/plugins/woo-discount-rules/`, `awdr_params` | Discount Rules | cart/price extensions |
| `wp-content/plugins/woocommerce-gateway-*` | Payment gateway | identify each gateway |
| `admin-ajax.php?action=...` | varies | not in `wp-json`; must be discovered from page JS |
| `?wc-ajax=...` | WooCommerce classic | often used for booking/cart add flows |

## How to add a fingerprint

1. Note the route prefix or script path, the plugin name, and the capability.
2. Record where you saw it: which page, which XHR, which response field.
3. Add the row with a conservative default verdict.
4. Add a note to `field-notes.md` if it changed a decision.

## Anti-patterns

- A loaded script does not mean the feature is enabled. Check the live response
  (`cart.payment_methods`, `cart.extensions`, product types, page usage).
- A namespace with no public routes may still have a live feature via
  `admin-ajax.php`, `wc-ajax`, or an iframe.
- A documented endpoint may return `[]` without required params. Do not conclude
  the feature is absent until you try the documented request shape.
