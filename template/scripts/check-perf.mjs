#!/usr/bin/env node
/**
 * check:perf — the perceived-performance and brand-asset gate.
 *
 * Static checks always run. If PERF_URL points at a running server it also
 * verifies the emitted icon/OG tags and the structural rules: exactly one h1,
 * declared image ratios, a visible LCP candidate, and no fonts.googleapis.com.
 * `scripts/check.sh --perf` starts that server.
 *
 * Browser-measured timings (pending paint, CLS, LCP) require Playwright. Install
 * it once with `npm i -D playwright && npx playwright install chromium`; when it
 * is not present this script records measurements as unavailable instead of
 * pretending they passed.
 *
 * Writes docs/verification/perf.json and exits non-zero on a failed check.
 */
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const results = [];
let failed = false;

async function exists(rel) {
  try {
    await stat(path.join(root, rel));
    return true;
  } catch {
    return false;
  }
}

async function text(rel) {
  try {
    return await readFile(path.join(root, rel), "utf8");
  } catch {
    return "";
  }
}

function record(name, ok, detail, required = true) {
  results.push({ name, ok: Boolean(ok), detail, required });
  if (required && !ok) failed = true;
}

function attribute(tag, name) {
  const match = tag.match(
    new RegExp(`(?:^|\\s)${name}\\s*=\\s*["']?([^"'\\s>]+)`, "i"),
  );
  return match ? match[1] : "";
}

function hasDeclaredRatio(tag, html, index) {
  if (/\bclass\s*=\s*["'][^"']*\baspect-/i.test(tag)) return true;
  if (/\bstyle\s*=\s*["'][^"']*aspect-ratio\s*:/i.test(tag)) return true;
  // SiteImage reserves the ratio on the slot wrapper, not on the img itself.
  const before = html.slice(Math.max(0, index - 600), index);
  const slots = before.match(
    /<(?:span|div|figure)\b[^>]*data-image-slot[^>]*>/gi,
  );
  const slot = slots ? slots[slots.length - 1] : "";
  return Boolean(slot && /\baspect-/i.test(slot));
}

function structuralChecks(html, label) {
  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");

  const h1Count = (body.match(/<h1\b/gi) || []).length;
  record(
    `html/${label}/h1`,
    h1Count === 1,
    `${h1Count} <h1> element(s)`,
    true,
  );

  const images = [...body.matchAll(/<img\b[^>]*>/gi)];
  const unsized = images.filter((match) => {
    const tag = match[0];
    const width = attribute(tag, "width");
    const height = attribute(tag, "height");
    return (
      !(width && height) && !hasDeclaredRatio(tag, body, match.index ?? 0)
    );
  });
  record(
    `html/${label}/img-dimensions`,
    unsized.length === 0,
    unsized.length === 0
      ? `${images.length} img(s) sized`
      : `${unsized.length}/${images.length} lack width+height or aspect-ratio: ${unsized[0][0].slice(0, 120)}`,
    true,
  );

  // The LCP candidate is the first image, or the h1 when there is no image. An
  // entrance animation must not start it at opacity: 0.
  const firstImg = images[0]?.[0] ?? "";
  const firstH1 = body.match(/<h1\b[^>]*>/i)?.[0] ?? "";
  const lcpTags = [firstImg, firstH1].filter(Boolean);
  const hidden = lcpTags.filter(
    (tag) =>
      /\bopacity-0\b/i.test(tag) ||
      /opacity\s*:\s*0(?:[;\s"']|$)/i.test(tag),
  );
  record(
    `html/${label}/lcp-visible`,
    hidden.length === 0,
    hidden.length === 0
      ? "LCP candidate starts visible"
      : `LCP candidate starts at opacity:0: ${hidden[0].slice(0, 120)}`,
    true,
  );

  record(
    `html/${label}/self-hosted-fonts`,
    !/fonts\.googleapis\.com/i.test(html),
    /fonts\.googleapis\.com/i.test(html)
      ? "served HTML loads fonts.googleapis.com"
      : "no fonts.googleapis.com in served HTML",
    true,
  );
}

function firstInternalHref(html, base) {
  let baseUrl;
  try {
    baseUrl = new URL(base);
  } catch {
    return "";
  }
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    let url;
    try {
      url = new URL(match[1], baseUrl);
    } catch {
      continue;
    }
    if (url.origin !== baseUrl.origin) continue;
    if (url.pathname === baseUrl.pathname || url.pathname === "/") continue;
    if (url.pathname.startsWith("/api/")) continue;
    if (/^\/(_?styleguide)(\/|$)/.test(url.pathname)) continue;
    if (
      /\.(png|jpe?g|svg|webp|avif|gif|pdf|zip|css|js|xml|ico)$/i.test(
        url.pathname,
      )
    ) {
      continue;
    }
    return url.href;
  }
  return "";
}

async function fetchHtml(target) {
  try {
    const res = await fetch(target, { redirect: "follow" });
    return res.ok ? await res.text() : "";
  } catch {
    return "";
  }
}

async function collect(dir, acc = []) {
  let entries = [];
  try {
    entries = await readdir(path.join(root, dir), { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      await collect(rel, acc);
    } else if (/\.(tsx?|css|mjs)$/.test(entry.name)) {
      acc.push(await text(rel));
    }
  }
  return acc;
}

// 1. The build must exist and be newer than the source; this gate runs after
// `npm run build`.
const buildFile = path.join(root, ".next/BUILD_ID");
let buildFresh = false;
try {
  const build = await stat(buildFile);
  let newest = 0;
  async function newestMtime(rel) {
    let entries = [];
    try {
      entries = await readdir(path.join(root, rel), { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const child = path.join(rel, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") continue;
        await newestMtime(child);
      } else if (/\.(tsx?|css|mjs)$/.test(entry.name)) {
        const info = await stat(path.join(root, child));
        if (info.mtimeMs > newest) newest = info.mtimeMs;
      }
    }
  }
  await newestMtime("src");
  buildFresh = build.mtimeMs >= newest - 2000;
} catch {
  buildFresh = false;
}
record("build", buildFresh, ".next/BUILD_ID newer than src/");

// 2. Brand assets. Absence is allowed only when discovery recorded it.
const brandDoc = await text("docs/site/06-brand-assets.md");
const brandMissing = /none found|no favicon|missing favicon|not present/i.test(brandDoc);
const appFiles = await readdir(path.join(root, "src/app")).catch(() => []);
const hasIcon =
  appFiles.some((f) => /^icon\.(png|jpe?g|svg|ico)$/.test(f)) ||
  (await exists("public/favicon.ico"));
const hasApple = appFiles.some((f) => /^apple-icon\.(png|jpe?g|svg|ico)$/.test(f));
const layoutSource = await text("src/app/layout.tsx");
const hasOg =
  appFiles.some((f) => /^opengraph-image\./.test(f)) || /openGraph/.test(layoutSource);

record("brand/favicon", hasIcon || brandMissing, brandMissing ? "recorded missing" : "icon or /favicon.ico", !brandMissing);
record("brand/apple-touch", hasApple || brandMissing, brandMissing ? "recorded missing" : "apple-icon", !brandMissing);
record("brand/og-image", hasOg || brandMissing, brandMissing ? "recorded missing" : "opengraph-image or metadata.openGraph", !brandMissing);

// 3. The mechanisms that make async work visible must exist in the source.
const sources = await collect("src");
const joined = sources.join("\n");
record("nav/pending", joined.includes("data-navigation-pending"), "page-level pending state");
record("media/placeholder", joined.includes("data-image-placeholder"), "visible image placeholder");
record("motion/reduced", /prefers-reduced-motion/.test(await text("src/app/globals.css")), "reduced-motion reset");

// 4. Optional: verify the emitted tags and structure against a server you own.
// No default URL — checking whatever happens to listen on :3000 can validate the
// wrong project.
const url = process.env.PERF_URL || "";
let html = "";
let innerUrl = "";
if (url) {
  html = await fetchHtml(url);
  if (html) innerUrl = firstInternalHref(html, url);
}

if (html) {
  structuralChecks(html, "home");
  if (innerUrl) {
    const innerHtml = await fetchHtml(innerUrl);
    if (innerHtml) {
      structuralChecks(innerHtml, "inner");
    } else {
      record("html/inner", false, `could not fetch ${innerUrl}`, false);
    }
  }

  const icon = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]*>/i)?.[0] ?? "";
  const apple = html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]*>/i)?.[0] ?? "";
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]*>/i)?.[0] ?? "";
  // A tag that cannot exist is not a failure: if discovery recorded the origin
  // has no such asset, there is nothing to emit.
  record(
    "html/icon",
    brandMissing || Boolean(icon),
    brandMissing ? "recorded missing" : icon || "no <link rel=icon>",
    !brandMissing,
  );
  record(
    "html/apple-touch",
    brandMissing || Boolean(apple),
    brandMissing ? "recorded missing" : apple || "no apple-touch-icon",
    !brandMissing,
  );
  record(
    "html/og-image",
    brandMissing || Boolean(og),
    brandMissing ? "recorded missing" : og || "no og:image",
    !brandMissing,
  );
} else {
  record(
    "html/checks",
    true,
    url ? `no server at ${url}` : "set PERF_URL after `next start` to check the emitted tags",
    false,
  );
  record(
    "html/structural",
    true,
    "set PERF_URL after `next start` to check h1, image ratios, LCP opacity and fonts",
    false,
  );
}

const output = {
  generatedAt: new Date().toISOString(),
  url: html ? url : null,
  measured: {
    browser: false,
    note:
      "Pending-paint, CLS and LCP timings need Playwright: npm i -D playwright && npx playwright install chromium.",
  },
  results,
  pass: !failed,
};

await mkdir(path.join(root, "docs/verification"), { recursive: true });
await writeFile(
  path.join(root, "docs/verification/perf.json"),
  `${JSON.stringify(output, null, 2)}\n`,
);

for (const item of results) {
  const mark = item.ok ? "ok" : item.required ? "FAIL" : "warn";
  console.log(`${mark.padEnd(4)} ${item.name}: ${item.detail}`);
}
console.log(failed ? "check:perf failed" : "check:perf passed");
process.exit(failed ? 1 : 0);
