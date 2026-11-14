Verify the build for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This is the final verification phase. Read `docs/site/00-status.md` and
`docs/craft/*` if present, then load the `verification` skill and follow it.

Check the real site, not the test suite alone. In `store` mode that means routes
resolve with the live catalogue and `/shop` and `/product-category` keep parity.
In `content` mode it means the site's actual pages, menus and permalinks resolve
with parity. In both modes: metadata is present, and there is no placeholder
brand, fixture or stub copy left in `src/`.

Also confirm the build did not invent commerce: in `content` mode there must be
no product grid, cart, checkout or account flow in the tree unless the discovery
docs prove the backend exposes it.

Set this exact line in `docs/site/00-status.md` when the phase's exit gate is met:

Phase 5 Verify: PASS

Otherwise `Phase 5 Verify: BLOCKED — <reason>` and stop. Do not fix the build
here beyond small, obvious corrections; if it needs real work, mark it blocked
and say which phase has to run again.
