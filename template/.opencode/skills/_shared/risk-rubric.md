# Risk Rubric

Score each residual route or capability from 0 to 3 on five axes.

| Axis | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Stakes | cosmetic | content | read-only account | money, inventory, identity, bookings, legal |
| Exposure | admin-only | auth-only | public GET | public write |
| Data-bearing | empty | HTML/embed only | partial fields | full structured records |
| Reference | not used | script loaded | linked in nav/sitemap | used in the live checkout/booking flow |
| Novelty | duplicate | cosmetic variant | new shopper action | new domain concept (subscriptions, rentals, B2B, …) |

## Thresholds

- `0–3`: ignore or park with a one-line reason.
- `4–7`: probe; usually park unless it supports a known journey.
- `8–11`: add to the capability register and assign a gate.
- `12–15`: blocker. Write a spike before any UI work.

Override: any route that touches money, inventory, identity, bookings, or legal
content is at least a `spike`, regardless of score.

## Time-box

- Known capability: probe until you have the contract (route, auth, required
  args, response shape, extensions).
- Suspected capability: 10 minutes per route family, max 20 families per pass.
- Unknown-domain concept: stop and escalate. Do not reverse-engineer a novel
  business model from route names alone.
