# Commerce prompt — PARKED

This run is not in `factory/phases.tsv`. It exists for an opt-in commerce build
after copying `template/commerce/` back into `src/`.

Continue the build for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This phase audits commerce. Read `docs/site/00-status.md` and every file in
`docs/wp-discovery/` first. This phase only runs when `SITE_MODE=store`.

Load the skills that apply:

- `wp-catalog-cart`
- `wp-checkout-payments`
- `wp-auth-wholesale`
- `wp-bookings` (only if bookings, appointments, tours or rentals exist)

Follow `project-orchestrator` for the capability register. One capability, one
owner: no overlap left unresolved. All probes are GET-only; write paths are
`wp-spikes`' job, not yours.

Write `docs/wp-discovery/capability-register.md` (every row with source, auth,
evidence, risk, owner) and `docs/wp-discovery/commerce.md` (catalog, product
types, variations, stock, cart, coupons, checkout, gateways, shipping, tax).

Then set this exact line:

Phase 2b Commerce: PASS

If a capability cannot be proven, record `BLOCKED — <reason>` and stop.
