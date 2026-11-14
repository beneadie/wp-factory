Verify the build for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}.

This is the final verification phase. Read `docs/site/00-status.md`,
`docs/site/base.md` and `docs/craft/*` if present, then load the `verification`
skill and follow it.

Check the real site, not the test suite alone: the site's actual pages, menus
and permalinks resolve with parity to the WordPress origin, metadata and OG
images are present, and there is no placeholder brand, fixture or stub copy left
in `src/`. Confirm the build did not invent commerce: no product grid, cart,
checkout or account flow unless the discovery docs prove the backend exposes it.

Then run the gates, not just typecheck/lint/build:

    npm run check:perf

It writes `docs/verification/perf.json`, which this phase must leave behind.
Confirm: navigation paints within 200ms and is never blank over 500ms, every
image slot shows a placeholder, and the icon/apple-touch/OG tags resolve (or
discovery recorded them missing).

Set this exact line in `docs/site/00-status.md` when the phase's exit gate is met:

Phase 5 Verify: PASS

Otherwise `Phase 5 Verify: BLOCKED — <reason>` and stop. Do not fix the build
here beyond small, obvious corrections; if it needs real work, mark it blocked
and say which phase has to run again.
