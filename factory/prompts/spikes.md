Prove the write paths for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

Load `agent-conduct` first. Read `docs/site/00-status.md`,
`docs/wp-discovery/capability-register.md` and `docs/wp-discovery/commerce.md`.

This run applies to store sites. Decide which in-scope capabilities need a write
probe for the build that follows: add-to-cart, variation payload, shipping rates,
checkout, payment redirect, account, booking.

If none of the capabilities the build will ship needs a write path, mutate
nothing and set:

Phase 3 Spikes: SKIPPED — no write path in scope

Otherwise load `wp-spikes` and follow it. It is the only skill allowed to mutate
WordPress. Every probe must be explicit, reversible, recorded, and limited to
what the build needs.

Never place a real order without the operator's approval or a staging origin.
Where that is unavailable, prove the contract with an invalid field and record
the error shape, then mark the successful POST as manual QA.

Write `docs/wp-discovery/spike-results.md`, then set:

Phase 3 Spikes: PASS

If a required write path cannot be proven, set
`Phase 3 Spikes: BLOCKED — <reason>` and stop. Never invent a write path.
