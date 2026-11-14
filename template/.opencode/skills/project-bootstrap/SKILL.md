---
name: project-bootstrap
description: Use when you are given a domain or WordPress URL and need to turn it into a working site directory. Normalizes the origin, proves it is WordPress + WooCommerce, writes .env.local and the status/site-profile seeds, then hands off to project-orchestrator. Run this before any other skill on a new site.
---

# Project Bootstrap

The missing first step: a domain in, a site that can build out. Everything here
is read-only against WordPress. You write only inside this repo.

## Inputs

- A URL or bare domain, e.g. `acme.ie`, `https://www.acme.ie/`, `acme.ie/shop`.
- Optional client name. If absent, derive one from the host.

## 1. Normalize

Keep only the origin: scheme, host, port. Drop any path, query, fragment and
trailing slash. Default to `https://` when no scheme is given. Do not silently
drop `www.` — if the site only works with it, keep it and record that.

```bash
WP="https://acme.ie"          # no trailing slash, no path
```

Derive the slug from the client name (`a-z`, `0-9`, dashes, lower case), falling
back to the host. Slug is the directory and repo name.

## 2. Prove what it is

Every check is a read. Record the raw evidence in `docs/wp-discovery/site-profile.md`.

```bash
curl -sSfL "$WP/wp-json/" | head -c 2000          # WordPress present?
curl -sSfL "$WP/wp-json/wp/v2/types" | head -c 2000
curl -sSfL "$WP/wp-json/wc/store/v1/products?per_page=1" -D -
curl -sSfL "$WP/wp-json/wc/store/v1/products/categories?per_page=1"
```

Abort instead of guessing when:

| Finding | Action |
|---|---|
| `/wp-json/` 404 or HTML | Not WordPress. Stop: `BLOCKED — not WordPress`. |
| No `wc/store/v1` namespace | WordPress without WooCommerce. Set `SITE_MODE=content` and continue: build the pages, menus and content the backend actually exposes. Never scaffold commerce. |
| Store API 401/403 | Private store. Stop and record the credential blocker. |
| Products return `[]` | `store` mode with an empty catalogue. Record it; the base build can proceed but the result is not a storefront. |

Note the site name, description, locale, currency and product count from the
responses (`X-WP-Total`, `X-WC-Store-API-Nonce`, the store response's
`currency_code` and `locale`). Do not invent values for anything the API does
not return.

## 3. Write the site config

Create `.env.local` from `.env.example` if it does not exist, with the values
you just observed:

```
WP_BASE_URL=https://acme.ie
SITE_MODE=store            # or content when there is no Store API
SITE_NAME=Acme Wool
SITE_DESCRIPTION=<site description, or "A storefront for Acme Wool.">
SITE_URL=http://localhost:3000
SITE_LOCALE=<observed locale, e.g. en_IE>
SITE_CURRENCY=<observed currency, e.g. EUR>
```

`SITE_MODE` is a fact, not a preference: `store` only when the WooCommerce Store
API answered. In `content` mode do not write a currency you did not observe,
and do not scaffold products, cart or checkout anywhere.

`SITE_URL` stays a placeholder until the site is deployed; it is not guessed
from the WordPress origin.

If `.env.local` already exists, update only the keys you have evidence for. Never
commit it — it is gitignored.

## 4. Seed the durable artifacts

`docs/site/00-status.md` — fill `Site:` and `WordPress origin:`, set
`Phase 0 Intake: NOT STARTED`, and leave the rest as they are. No bullets.

`docs/wp-discovery/site-profile.md` — create it with:

- origin, final URL after redirects, HTTP status
- site name/description, locale, currency
- WordPress version and namespaces from `/wp-json/`
- Store API reachability and product/category counts
- anything surprising (basic auth, redirect chain, multi-site, CDN)

## 5. Hand off

Stop. Do not start Phase 0 in this skill and do not edit `src/`.

Tell the operator, in one short block: slug, normalized origin, site mode
(`store` or `content`), platform verdict (WordPress + WooCommerce / WordPress
only / neither), product count if any, and the next skill
(`project-orchestrator`, Phase 0 `wp-intake`).

## Rules

- WordPress is the source of truth. A capability you cannot see in a response
  does not exist.
- Read-only: no POST, no `admin-ajax`, no form submissions. Only `wp-spikes` may
  mutate, and only later.
- Never put the origin or the brand in a component; it belongs in `.env.local`
  and `docs/site/`.
