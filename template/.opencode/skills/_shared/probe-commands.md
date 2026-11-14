# WP Probe Commands

Read-only probes for a headless WordPress/WooCommerce discovery pass. Replace
placeholders before running. Never paste tokens, cookies, customer data, or
secrets into a commit or a document.

## Batch first

One call beats thirty:

```bash
bash scripts/wp-probe.sh "$WP" /tmp/wp-probe all
# or: content | catalog | cart | checkout
```

It saves the body, headers and status code per endpoint and prints a table. Read
those files. Use the individual probes below only for a follow-up question the
batch did not answer.

```bash
WP="https://example.com"          # WordPress origin, no trailing slash
OLD="https://example.com"         # current public site (may equal WP)
DUMP="./wp-json-index.json"       # saved /wp-json/ response
mkdir -p /tmp/wp-probe
```

## Save and inspect the index

```bash
curl -sS "$WP/wp-json/" -o "$DUMP"
node - <<'NODE'
const j = require(process.env.DUMP || "./wp-json-index.json");
const routes = Object.keys(j.routes || {});
console.log("namespaces", (j.namespaces || []).length, j.namespaces);
console.log("routes", routes.length);
console.log("authentication", j.authentication);
console.log("home", j.home, "page_on_front", j.page_on_front);
NODE
```

## Route family counts

```bash
node - <<'NODE'
const j = require(process.env.DUMP || "./wp-json-index.json");
const routes = Object.keys(j.routes || {});
const families = [
  "/wp/v2",
  "/wc/store/v1",
  "/wc/store",
  "/wc/v3",
  "/wc/v1",
  "/ssa/v1",
  "/wc-bookings/v1",
  "/wholesale/v1",
  "/wc/v3/wholesale",
  "/wwof/v3",
  "/wwlc/v1",
  "/wwp/v1",
  "/fluentform/v1",
  "/yoast/v1",
  "/redirection/v1",
  "/cky/v1",
  "/popup-maker/v2",
  "/pum/v1",
  "/payments",
  "/wc/v3/payments",
  "/wc/v3/paypal",
  "/divi/v1",
  "/wp-block-editor/v1",
  "/wc-admin",
  "/wc-analytics",
  "/wc-telemetry",
  "/jetpack/v4",
  "/ai1wm/v1",
];
for (const prefix of families) {
  const n = routes.filter((r) => r.startsWith(prefix)).length;
  if (n) console.log(String(n).padStart(4), prefix);
}
NODE
```

## Auth surface

```bash
for path in /wp/v2/users/me /wp/v2/menus /wc/v3/customers /wc/v3/orders; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$WP/wp-json$path")
  printf "%s %s\n" "$code" "$path"
done

node - <<'NODE'
const j = require(process.env.DUMP || "./wp-json-index.json");
const hits = (j.namespaces || []).filter((n) => /jwt|auth|login|password|session/i.test(n));
console.log("auth-ish namespaces", hits);
NODE
```

## Product census

```bash
for p in 1 2 3 4 5 6; do
  curl -sS "$WP/wp-json/wc/store/v1/products?per_page=100&page=$p" \
    -o "/tmp/wp-probe/products-$p.json"
done

node - <<'NODE'
const fs = require("fs");
const dir = "/tmp/wp-probe";
const files = fs.readdirSync(dir).filter((f) => f.startsWith("products-"));
const counts = {};
const examples = {};
let total = 0;
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(`${dir}/${file}`, "utf8"));
  if (!Array.isArray(data)) continue;
  for (const product of data) {
    total += 1;
    counts[product.type] = (counts[product.type] || 0) + 1;
    if (!examples[product.type]) {
      examples[product.type] = {
        id: product.id,
        name: product.name,
        variations: product.variations?.length ?? 0,
        has_options: product.has_options,
      };
    }
  }
}
console.log(JSON.stringify({ total, counts, examples }, null, 2));
NODE
```

Check pagination headers on the first page:

```bash
curl -sS -D /tmp/wp-probe/products.headers -o /dev/null \
  "$WP/wp-json/wc/store/v1/products?per_page=100&page=1"
grep -iE '^x-wp-total' /tmp/wp-probe/products.headers
```

## Variable product mapping

```bash
PID="12345"
curl -sS "$WP/wp-json/wc/store/v1/products/$PID" -o /tmp/wp-probe/parent.json
curl -sS "$WP/wp-json/wc/store/v1/products?type=variation&parent=$PID&per_page=100" \
  -o /tmp/wp-probe/variations.json

node - <<'NODE'
const parent = require("/tmp/wp-probe/parent.json");
const variations = require("/tmp/wp-probe/variations.json");
const results = variations.map((v) => ({
  id: v.id,
  name: v.name,
  sku: v.sku,
  price: v.prices?.price,
  in_stock: v.is_in_stock,
  attributes: v.attributes,
}));
console.log(JSON.stringify({ parent: parent.id, attributes: parent.attributes, results }, null, 2));
NODE
```

Flag any `attributes[].value === null` or empty `attributes`. Fall back to the
variation name, SKU, and `add_to_cart.url` (`variation_id` query param), then
verify the exact add-to-cart payload in a spike.

## Cart contract

```bash
curl -sS -D /tmp/wp-probe/cart.headers -o /tmp/wp-probe/cart.json \
  "$WP/wp-json/wc/store/v1/cart"
grep -iE '^(nonce|cart-token|access-control-expose-headers|x-wp-total)' \
  /tmp/wp-probe/cart.headers

node - <<'NODE'
const cart = require("/tmp/wp-probe/cart.json");
console.log(JSON.stringify({
  items: (cart.items || []).map((i) => ({ id: i.id, type: i.type, key: i.key })),
  payment_methods: cart.payment_methods,
  extensions: Object.keys(cart.extensions || {}),
  needs_payment: cart.needs_payment,
  needs_shipping: cart.needs_shipping,
  payment_requirements: cart.payment_requirements,
  shipping_rates: (cart.shipping_rates || []).length,
  totals: cart.totals,
}, null, 2));
NODE
```

## Checkout session

`GET /checkout` needs the `Nonce` header. Use the values from the cart response.

```bash
NONCE="..."
TOKEN="..."
curl -sS -H "Nonce: $NONCE" -H "Cart-Token: $TOKEN" \
  "$WP/wp-json/wc/store/v1/checkout" -o /tmp/wp-probe/checkout.json

node - <<'NODE'
const c = require("/tmp/wp-probe/checkout.json");
console.log(JSON.stringify({
  payment_method: c.payment_method,
  payment_methods: c.__experimentalCart?.payment_methods,
  needs_payment: c.__experimentalCart?.needs_payment,
  needs_shipping: c.__experimentalCart?.needs_shipping,
  payment_requirements: c.__experimentalCart?.payment_requirements,
  extensions: Object.keys(c.extensions || {}),
}, null, 2));
NODE
```

## Store API order verification

```bash
curl -sS "$WP/wp-json/wc/store/v1/order/ORDER_ID?key=ORDER_KEY" \
  -o /tmp/wp-probe/order.json
```

Confirm the response carries the order status and key. Never trust query-string
`order`/`key` values without verifying them.

## SSA (Simply Schedule Appointments)

```bash
curl -sS "$WP/wp-json/ssa/v1/embed_booking_app" -o /tmp/wp-probe/ssa-embed.json
node - <<'NODE'
const raw = require("/tmp/wp-probe/ssa-embed.json");
const match = raw.match(/src="([^"]+embed-inner[^"]*)"/);
console.log(match ? match[1] : "no embed src");
NODE

curl -sS "$WP/wp-json/ssa/v1/appointment_types/1/availability" \
  -o /tmp/wp-probe/ssa-availability.json
```

## WooCommerce Bookings

```bash
PID="12345"
curl -sS "$WP/wp-json/wc-bookings/v1/products/$PID" \
  -o /tmp/wp-probe/booking-product.json
curl -sS "$WP/wp-json/wc-bookings/v1/products/slots?product_ids=$PID&min_date=YYYY-MM-DD&max_date=YYYY-MM-DD" \
  -o /tmp/wp-probe/booking-slots.json
curl -sS "$WP/wp-json/wc-bookings/v1/resources?per_page=100" \
  -o /tmp/wp-probe/booking-resources.json
```

`min_date` and `max_date` are required on this endpoint on at least one live
site; an empty result without them is not proof that slots are unavailable.

## Current-site usage evidence

The route index does not show `admin-ajax` actions, iframes, or plugin script
handles. Scan the pages you are replacing.

```bash
# Take the paths from the route ledger, plus one of each shape the site has:
# a product, a category, a booking or calendar page, an account page.
for path in / <product-path> <category-path> <booking-or-calendar-path> /cart/ /checkout/ /my-account/; do
  name=$(printf "%s" "$path" | tr '/?' '__')
  curl -sS "$OLD$path" -o "/tmp/wp-probe/old-$name.html" || true
done

grep -rhoE '(admin-ajax\.php[^" ]*|wc-ajax=[^"& ]+|wp-json/[^"& ]+|wp-content/plugins/[^/]+|wp-content/themes/[^/]+)' \
  /tmp/wp-probe/old-*.html | sort -u
```

Also record full-page network requests in a browser for cart, checkout, and
bookings. Look for `admin-ajax.php?action=...`, `?wc-ajax=...`, third-party
iframes, and payment SDKs.

## SEO and URL surface

```bash
curl -sS "$WP/sitemap_index.xml" -o /tmp/wp-probe/sitemap-index.xml
curl -sS "$WP/sitemap.xml" -o /tmp/wp-probe/sitemap.xml
curl -sS "$WP/robots.txt" -o /tmp/wp-probe/robots.txt
```

Classify every URL pattern in the sitemap: page, product, product category,
product tag, attribute archive, and unknown. Unknown patterns are discovery
signals, not noise.

## CORS and exposed headers

```bash
curl -sS -I -X OPTIONS "$WP/wp-json/wc/store/v1/cart" \
  -H "Origin: https://frontend.example.com" \
  -o /tmp/wp-probe/options.headers
grep -iE 'access-control|allow' /tmp/wp-probe/options.headers
```

`OPTIONS` is read-only. Prefer a server-side BFF for mutations even if CORS
allows browser calls.
