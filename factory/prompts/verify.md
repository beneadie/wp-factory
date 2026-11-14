Verify the build for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This is the final verification phase. Load `agent-conduct` first. Read
`docs/site/00-status.md`, `docs/site/base.md`, `docs/site/commerce-build.md` if
present, and `docs/craft/*` if present, then load the `verification` skill and
follow it.

Check the real site, not the test suite alone: the site's actual pages, menus and
permalinks resolve with parity to the WordPress origin, metadata and OG images
are present, and there is no placeholder brand, fixture or stub copy left in
`src/`.

Mode-specific checks:

- content: no product grid, cart, checkout or account flow exists unless the
  discovery docs prove the backend exposes it.
- store: the catalogue count matches the API, a sample matches on price, stock,
  image count and permalink, every variable product has working options, cart and
  shipping round-trip against the API, and the payment redirect points at the
  origin or the gateway. No card field may exist in `src/`.

Then run the gate, not just typecheck/lint/build:

    bash scripts/check.sh --perf

It builds once, starts one server, runs `check:perf` and writes
`docs/verification/perf.json`, which this phase must leave behind. Confirm:
navigation paints within 200ms and is never blank over 500ms, every image slot
shows a placeholder, and the icon/apple-touch/OG tags resolve (or discovery
recorded them missing).

Set this exact line in `docs/site/00-status.md` when the phase's exit gate is met:

Phase 5 Verify: PASS

Otherwise `Phase 5 Verify: BLOCKED — <reason>` and stop. Do not fix the build
here beyond small, obvious corrections; if it needs real work, mark it blocked
and say which phase has to run again.
