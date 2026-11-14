Build the commerce flow for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

Load `agent-conduct` first. Read `docs/site/00-status.md`, `docs/site/base.md`,
`docs/wp-discovery/commerce.md`, `docs/wp-discovery/capability-register.md` and
`docs/wp-discovery/spike-results.md`. Then load `store-checkout` and follow it.

Build only what the proofs support: cart, quantity and coupon updates, address
and shipping rates, order creation, the payment handoff to the real hosted page,
and the order confirmation. If a capability was not proven, record it as
deferred — do not fake it.

Do not clone the payment page, do not construct an order-pay URL, and do not
store a cart token anywhere the browser can read it. If the origin exposes an
optional server-side helper, use it when present and fall back to the returned
redirect URL when it is not.

Record routes, BFF endpoints, cookie names and deferred capabilities in
`docs/site/commerce-build.md`; update `docs/checkout.md` if it exists.

Before declaring the phase done run, once each:

    npm run typecheck
    npm run lint
    npm run build

Then set this exact line in `docs/site/00-status.md`:

Phase 4c Commerce: PASS

If a required path cannot be built or proven, set
`Phase 4c Commerce: BLOCKED — <reason>` and stop.
