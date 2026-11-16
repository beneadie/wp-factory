#!/usr/bin/env python3
"""Choose a visual template from the evidence discovery already wrote.

The runner calls this only when a site has no TEMPLATE in .env.local. The rules
below are the contract's mapping: Store API + products -> shop, a food menu ->
hospitality, timetables/bookings -> appointment, and so on. A match only counts
when the surrounding text is not a denial ("no Store API", "| Absent |").

Weak evidence never picks a random specialist template. It defaults to
`practice` and writes that decision, with the evidence it considered, to
docs/site/template-choice.md. Nothing is chosen silently.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

SOURCES = (
    "docs/wp-discovery/site-profile.md",
    "docs/wp-discovery/capability-register.md",
)

# One rule per evidence phrase. Weight is deliberately uneven: a Store API or a
# "get a quote" is much stronger than the word "product" in passing. `exclude`
# filters contexts that mean something else (a site nav menu is not a food menu).
RULES = (
    {
        "template": "shop",
        "label": "Store API",
        "pattern": r"\bstore\s+api\b",
        "weight": 8,
    },
    {
        "template": "shop",
        "label": "WooCommerce Store API route",
        "pattern": r"(?:\bwc/store\b|/wc/store(?:/v\d+)?)",
        "weight": 4,
        "exclude": r"(?:→|->)\s*404\b|\breturns?\s+404\b|\brest_no_route\b|\babsent\b|\bno route\b|\bblocked\b",
    },
    {
        "template": "shop",
        "label": "products/catalogue",
        "pattern": r"\b(products?|catalog(?:ue)?)\b",
        "weight": 2,
    },
    {
        "template": "hospitality",
        "label": "food/opening hours",
        "pattern": r"\b(our food|food menu|opening hours|reservations?|book a table|dishes|drinks)\b",
        "weight": 6,
    },
    {
        "template": "hospitality",
        "label": "menu (not site navigation)",
        "pattern": r"\bmenus?\b",
        "weight": 2,
        "exclude": r"\b(nav|navigation|menu-primary|menu-item|menu item|wp/v2/menus|menu structure|page tree|primary menu|header|footer)\b",
    },
    {
        "template": "appointment",
        "label": "timetable/classes/bookings",
        "pattern": r"\b(timetables?|classes|bookings?|book a class|schedule|appointments?)\b",
        "weight": 5,
        "exclude": r"\b(css|classname|classnames|database schema)\b",
    },
    {
        "template": "property",
        "label": "listings/for sale/availability",
        "pattern": r"\b(listings?|for sale|availability|properties|bedrooms?)\b",
        "weight": 5,
        "exclude": r"\b(stock availability|in stock|out of stock|low_stock|stock_availability)\b",
    },
    {
        "template": "practice",
        "label": "nested services/team",
        "pattern": r"\b(nested services|services tree|our services|our team|team|practitioners?|clinic|professional services)\b",
        "weight": 4,
    },
    {
        "template": "trades",
        "label": "quote/areas covered",
        "pattern": r"\b(get a quote|quotes?|areas covered|callout|emergency call)\b",
        "weight": 5,
    },
    {
        "template": "portfolio",
        "label": "work/projects/gallery",
        "pattern": r"\b(our work|projects?|gallery|case studies|portfolio)\b",
        "weight": 5,
        "exclude": r"\b(project-orchestrator|project directory|node project)\b",
    },
    {
        "template": "community",
        "label": "news/events/donate/volunteer/documents",
        "pattern": r"\b(news|events?|donate|donation|volunteers?|documents|notices?)\b",
        "weight": 4,
    },
)

NEGATIVE = re.compile(
    r"\b(no|not|none|without|absent|missing|zero|never|out of scope)\b", re.I
)
NEGATIVE_STATUS = ("absent", "missing", "blocked", "parked", "ignored")


def table_status(line: str) -> tuple[str, int] | None:
    """Return (first cell, end offset) for a markdown row whose status is absent.

    A capability register row such as
    `| Commerce (products, cart) | Absent | ... |` must not count "products" as
    evidence that this site is a shop.
    """
    stripped = line.strip()
    if not stripped.startswith("|"):
        return None
    cells = [cell.strip() for cell in stripped.strip("|").split("|")]
    if len(cells) < 2:
        return None
    if not cells[1].lower().startswith(NEGATIVE_STATUS):
        return None
    # The first cell ends at the first pipe after the leading one.
    end = line.find("|", line.find("|") + 1)
    return cells[0], end


def is_negated(line: str, start: int) -> bool:
    """True when the phrase is being denied, not asserted."""
    prefix = line[max(0, start - 80):start]
    suffix = line[start:start + 80]
    if NEGATIVE.search(prefix):
        return True
    if re.search(
        r"\b(absent|missing|not present|none|out of scope|blocked|parked|ignored)\b",
        suffix,
        re.I,
    ):
        return True
    status = table_status(line)
    if status is not None:
        cell, end = status
        if start < end and cell:
            return True
    return False


def score_site(site: Path) -> dict:
    scores = {rule["template"]: 0 for rule in RULES}
    evidence: list[dict] = []
    files_read: list[str] = []

    for rel in SOURCES:
        path = site / rel
        if not path.exists():
            continue
        files_read.append(rel)
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
        for number, line in enumerate(lines, start=1):
            # A bullet list under an "Absent" paragraph is a list of things the
            # site does not have, even when an individual bullet names a route.
            recent = " ".join(lines[max(0, number - 5):number - 1])
            section_absent = bool(
                re.search(r"\b(absent|verified as absent|not present)\b", recent, re.I)
            )
            if section_absent and re.match(r"^\s*[-*]\s", line):
                continue
            for rule in RULES:
                if rule.get("exclude") and re.search(rule["exclude"], line, re.I):
                    continue
                for match in re.finditer(rule["pattern"], line, re.I):
                    if is_negated(line, match.start()):
                        continue
                    scores[rule["template"]] += rule["weight"]
                    evidence.append(
                        {
                            "template": rule["template"],
                            "label": rule["label"],
                            "file": rel,
                            "line": number,
                            "text": line.strip()[:240],
                        }
                    )
                    # One line is one vote for a rule, however often it repeats
                    # the word.
                    break

    ranked = sorted(scores.items(), key=lambda item: (-item[1], item[0]))
    best, best_score = ranked[0]
    runner_score = ranked[1][1] if len(ranked) > 1 else 0

    if best_score >= 4 and best_score > runner_score:
        chosen = best
        confidence = "evidence"
    else:
        chosen = "practice"
        confidence = "weak"

    return {
        "chosen": chosen,
        "confidence": confidence,
        "scores": scores,
        "best": best,
        "best_score": best_score,
        "runner_score": runner_score,
        "evidence": evidence,
        "files_read": files_read,
    }


def write_choice(site: Path, result: dict, slug: str) -> Path:
    docs = site / "docs/site"
    docs.mkdir(parents=True, exist_ok=True)
    target = docs / "template-choice.md"

    chosen = result["chosen"]
    scores = result["scores"]
    ranked = sorted(scores.items(), key=lambda item: (-item[1], item[0]))
    evidence = [item for item in result["evidence"] if item["template"] == chosen]
    if not evidence:
        evidence = result["evidence"][:8]

    lines = [
        f"# Template choice — {slug}",
        "",
        f"Chosen: `{chosen}`",
        f"Confidence: {result['confidence']}",
        "",
    ]
    if result["confidence"] == "weak":
        lines += [
            "No template had enough unambiguous evidence. The factory defaults to",
            "`practice` rather than guessing; change `TEMPLATE` in `.env.local` if",
            "that is wrong.",
            "",
        ]
    else:
        lines += [
            f"Score {result['best_score']} for `{result['best']}`; runner-up "
            f"`{ranked[1][0]}` scored {result['runner_score']}."
            if len(ranked) > 1
            else f"Score {result['best_score']} for `{result['best']}`.",
            "",
        ]

    lines += [
        "## Evidence" if result["confidence"] == "evidence" else "## Evidence considered",
        "",
    ]
    if evidence:
        for item in evidence[:16]:
            text = item["text"].replace("`", "'")
            lines.append(
                f"- `{item['file']}:{item['line']}` — \"{text}\" "
                f"({item['template']} / {item['label']})"
            )
    else:
        lines.append("- No template-specific evidence in the discovery docs.")
    lines += ["", "## Scores", "", "| Template | Score |", "|---|---|"]
    for name, score in ranked:
        lines.append(f"| `{name}` | {score} |")

    lines += [
        "",
        "## Rule",
        "",
        "This file is written by `factory/template_choice.py` from",
        "`docs/wp-discovery/site-profile.md` and",
        "`docs/wp-discovery/capability-register.md`. `TEMPLATE` in `.env.local` is",
        "authoritative once set; re-run the factory only after editing it if this",
        "choice is wrong.",
        "",
        f"Chosen at {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}.",
        "",
    ]
    target.write_text("\n".join(lines), encoding="utf-8")
    return target


def main() -> int:
    parser = argparse.ArgumentParser(description="Pick a template from discovery evidence")
    parser.add_argument("--site", required=True, help="site directory")
    parser.add_argument("--slug", help="slug for the report title")
    parser.add_argument("--write", action="store_true", help="write docs/site/template-choice.md")
    parser.add_argument("--json", action="store_true", help="print the full result as JSON")
    args = parser.parse_args()

    site = Path(args.site).expanduser().resolve()
    if not site.is_dir():
        raise SystemExit(f"not a site directory: {site}")

    result = score_site(site)
    slug = args.slug or site.name
    if args.write:
        write_choice(site, result, slug)

    if args.json:
        print(json.dumps({**result, "slug": slug}, indent=2))
    else:
        # The runner reads the last line: one bare template name.
        print(result["chosen"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
