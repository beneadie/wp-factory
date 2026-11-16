Build the interaction layer for {{name}} ({{slug}}) from {{wp_url}}.
Niche: {{niche}}. Site mode: {{site_mode}}.

Load `agent-conduct` first. This phase makes the built site feel fast and
reactive. Read `docs/site/00-status.md`, `docs/site/base.md`,
`docs/site/commerce-build.md` if present, and `docs/wp-discovery/*`, then load
`frontend-substrate` and follow it.

Do not add routes or data sources here; if a page does not render, that belongs
to `site-base` (or `store-checkout`) and should be marked blocked rather than
worked around. Do not re-run `design-adaptation`: palette and type were applied
as the last sub-step of Phase 4a. Preserve the token values in
`src/styles/theme.css`; this phase improves feel, not the skin.

Apply the substrate to every surface that exists: navigation, loading, images,
focus and motion. On a store, that includes the catalogue and the cart and
checkout flows built in Phase 4c — improve their feedback and states without
redesigning their contracts.

Do not invent commerce UI on a content site, and do not add new commerce
behaviour on a store; this phase improves feel, not capability.

Write `docs/craft/design-system.md`, `docs/craft/interaction-states.md` and
`docs/craft/motion.md` as you go, so later pages reuse them.

Plan the files first and batch related edits in one turn; do not re-read files you
just wrote. Aim for at most 35 tool calls.

Before declaring the phase done run the batched check once:

    bash scripts/check.sh

If it fails, fix the cause and run it again. Do not build more than twice.

Then set:

Phase 4b Substrate: PASS

If a substrate contract cannot be met, set `Phase 4b Substrate: BLOCKED — <reason>`
and stop.
