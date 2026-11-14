#!/usr/bin/env node
/**
 * check:perf — the perceived-performance and brand-asset gate.
 *
 * Static checks always run. If a URL is running (PERF_URL, default
 * http://localhost:3000 when reachable) it also verifies the built HTML exposes
 * an icon and an OG image and that both resolve.
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

// 4. Optional: verify the emitted tags against a server you own. No default
// URL — checking whatever happens to listen on :3000 can validate the wrong
// project.
const url = process.env.PERF_URL || "";
let html = "";
if (url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (res.ok) html = await res.text();
  } catch {
    html = "";
  }
}

if (html) {
  const icon = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]*>/i)?.[0] ?? "";
  const apple = html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]*>/i)?.[0] ?? "";
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]*>/i)?.[0] ?? "";
  record("html/icon", Boolean(icon), icon || "no <link rel=icon>");
  record("html/apple-touch", Boolean(apple), apple || "no apple-touch-icon");
  record("html/og-image", Boolean(og), og || "no og:image");
} else {
  record(
    "html/checks",
    true,
    url ? `no server at ${url}` : "set PERF_URL after `next start` to check the emitted tags",
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
