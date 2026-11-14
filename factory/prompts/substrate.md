Build the interaction layer for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

This phase makes the base feel fast and reactive. Read `docs/site/00-status.md`,
`docs/site/base.md` and `docs/wp-discovery/*` first, then load
`frontend-substrate` and follow it.

Do not add routes or data sources here; if a page does not render, that belongs
to `site-base` and should be marked blocked rather than worked around. Do not run
`design-adaptation` — palette and type are a later pass.

In `content` mode there is no cart or checkout: apply the substrate to
navigation, loading, images, focus and motion only. Do not invent commerce UI.

Write `docs/craft/design-system.md`, `docs/craft/interaction-states.md` and
`docs/craft/motion.md` as you go, so later pages reuse them.

Run `npm run typecheck`, `npm run lint` and `npm run build` once each, then set:

Phase 4b Substrate: PASS

If a substrate contract cannot be met, set `Phase 4b Substrate: BLOCKED — <reason>`
and stop.
