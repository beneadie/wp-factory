Prove or skip write paths for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

Read `docs/site/00-status.md` and `docs/wp-discovery/capability-register.md`
first. This phase only runs for store sites.

Decide whether an in-scope money, identity or booking write path actually needs
proof for this build. If nothing needs it — no cart, checkout, account or
booking flow in scope for the base build — do not run any write probe, do not
mutate WordPress, and set:

Phase 3 Spikes: SKIPPED — no write paths in scope

Only if a proof is genuinely required, load `wp-spikes` and follow it. It is the
only skill allowed to mutate WordPress, and it must be explicit, reversible,
recorded, and limited to what the build needs.

Write `docs/wp-discovery/spike-results.md` when you do run a spike, then set:

Phase 3 Spikes: PASS

Never invent a write path, and never mutate a live site without approval.
