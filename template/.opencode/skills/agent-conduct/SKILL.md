---
name: agent-conduct
description: Load first on every build, before any other skill. Rules for changing shared skills, templates and factory files without deleting capability, overfitting to one site, or narrowing scope by accident.
---

# Agent Conduct

Rules for working on the factory itself and on a generated site. They exist
because a scope instruction about one thing has repeatedly been applied to
everything.

## The one rule

**Change what was named, at the level it was named.**

If the operator says "the template should not be a shop", change the template.
Do not remove shop support from the factory, the skills, the phases or the gate.

## Non-negotiables

- **Never delete a capability to satisfy a scope complaint.** Gate it by
  applicability: mode, phase condition, or "when present". Removing it is a
  last resort that the operator must ask for explicitly.
- **Classification is not a decision.** The default is unknown. `store` and
  `content` are both outcomes of discovery, never the assumed case.
- **Do not port code between sites.** Skills describe the bar and the evidence;
  each build writes its own code against the origin's API and URL shapes.
- **Do not rewrite a skill from one test case.** One prospect is not a pattern.
  Generalise the lesson, never the site.
- **No literal leaks.** A shared skill, template or prompt may not contain a
  client's name, domain, URL slug, product term, gateway ID, currency, colour or
  font. Examples are unnamed and conditional ("a redirect gateway", "a booking
  product").
- **Examples must stay.** Listing cart, checkout, bookings, calendars, option
  selection, gift cards and wholesale as things to look for is correct. Listing
  them as things every site has is not.
- **Ambiguity is a question, not a choice.** If a requirement can be read two
  ways, ask. Do not resolve it by picking the extreme.
- **Before changing a shared file, list what guidance would disappear** and
  replace it with equal or better guidance. A net loss is a regression.
- **Prove against the live API.** Never fill a gap from memory, and never leave a
  fixture where real data was required.
- **Report scope changes before acting.** "I am also removing X" belongs in the
  message before the edit, not after.

## What to check before calling a change done

- [ ] Does anything still work that used to work? If not, why?
- [ ] Is every site-specific value confined to `docs/site/` or `.env.local`?
- [ ] Is the new behaviour gated by mode or by discovery, not by assumption?
- [ ] Would this change make sense for the next prospect, not just this one?
- [ ] Did any guidance get deleted without a replacement?

## Anti-patterns

- "The template is neutral, so the factory can only build content sites."
- Turning a per-site fact into a template default.
- Deleting a discovery step because the current site did not need it.
- Narrowing a test matrix to the pages the current build happens to have.
- Copying a working implementation from a previous site into the base.
