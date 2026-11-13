# Route Ledger

Use for routes that are not already covered by a known capability. One row per
route family, not one per literal route. Group parameterised routes.

| Route | Namespace | Methods | Public? | Data? | Referenced? | Stakes | Hypothesis | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| `/ssa/v1/embed_booking_app` | `ssa/v1` | GET | yes | HTML/JS | no published page | bookings | unused appointment system | ignore | `appointment_types` has one type; no live page embeds it |
| `/wc-bookings/v1/products/slots` | `wc-bookings/v1` | GET | yes | slots | yes, on product page | bookings | real booking availability | adopt | `{records,count}` with `min_date`/`max_date` |
|  |  |  |  |  |  |  |  |  |  |

## Verdicts

- `adopt` — add a capability row and build.
- `spike` — important but unproven; hand to `wp-spikes`.
- `park` — real but out of scope/low value; record why and who owns the decision.
- `ignore` — admin/infra noise; record why.

## Rules

- Public GET with real data and a shopper-facing hypothesis → at least `spike`.
- Public POST → `spike` (never `adopt` without a write-path proof).
- Money, inventory, identity, bookings, or legal content → cannot be `park` or
  `ignore` without a written decision.
- Admin-only route with no frontend reference → `ignore` with evidence.
- Two namespaces for one capability → audit before choosing; see
  `docs/integration-audit.md` style.
