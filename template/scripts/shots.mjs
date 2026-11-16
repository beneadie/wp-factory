#!/usr/bin/env node
/**
 * shots.mjs — the visual review's camera.
 *
 *   npm run shots -- --url http://localhost:3000
 *   SITE_PREVIEW_URL=http://localhost:3000 npm run shots
 *
 * Writes home-desktop.png, home-mobile.png, inner-desktop.png and a full-page
 * variant of each to docs/verification/shots/. The first internal link on the
 * home page is used as the inner page unless --inner is passed.
 *
 * Playwright is optional. If it is not installed this prints the install
 * command and exits 0, so a site without the browser dependency can still run
 * the rest of its checks. The screenshots are the evidence; an agent must view
 * them, not infer appearance from the accessibility tree.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 && index + 1 < process.argv.length
    ? process.argv[index + 1]
    : "";
}

const baseUrl = argValue("--url") || process.env.SITE_PREVIEW_URL || "";
if (!baseUrl) {
  console.error("usage: npm run shots -- --url http://localhost:3000");
  process.exit(2);
}

const outDir = path.resolve(argValue("--output") || "docs/verification/shots");
await mkdir(outDir, { recursive: true });

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log("Playwright is not installed; screenshots were not taken.");
  console.log("Install it once, then rerun this command:");
  console.log("  npm i -D playwright && npx playwright install chromium");
  console.log(`  npm run shots -- --url ${baseUrl}`);
  process.exit(0);
}

const origin = new URL(baseUrl);

function firstInternalLink(html) {
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    let url;
    try {
      url = new URL(match[1], origin);
    } catch {
      continue;
    }
    if (url.origin !== origin.origin) continue;
    if (url.pathname === origin.pathname || url.pathname === "/") continue;
    if (url.pathname.startsWith("/api/")) continue;
    if (/^\/(_?styleguide)(\/|$)/.test(url.pathname)) continue;
    if (/\.(png|jpe?g|svg|webp|avif|gif|pdf|zip|css|js|xml|ico)$/i.test(url.pathname)) {
      continue;
    }
    return url.href;
  }
  return "";
}

async function settle(page, fullPage) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  if (!fullPage) return;
  // Lazy images below the fold need a scroll before a full-page capture.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

async function capture(page, url, name, viewport, fullPage) {
  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(300);
  await settle(page, fullPage);
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage });
  console.log(`wrote ${path.relative(process.cwd(), file)}`);
}

const browser = await chromium.launch({ headless: true }).catch((error) => {
  console.error(`could not launch Chromium: ${error.message}`);
  console.error("Install the browser once, then rerun:");
  console.error("  npx playwright install chromium");
  process.exit(1);
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const homeHtml = await page
    .goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 })
    .then((response) => response?.text() ?? "")
    .catch(() => "");
  const innerUrl = argValue("--inner") || firstInternalLink(homeHtml) || baseUrl;

  const desktop = { width: 1440, height: 900 };
  const mobile = { width: 390, height: 844 };

  await capture(page, baseUrl, "home-desktop.png", desktop, false);
  await capture(page, baseUrl, "home-desktop-full.png", desktop, true);
  await capture(page, baseUrl, "home-mobile.png", mobile, false);
  await capture(page, baseUrl, "home-mobile-full.png", mobile, true);
  await capture(page, innerUrl, "inner-desktop.png", desktop, false);
  await capture(page, innerUrl, "inner-desktop-full.png", desktop, true);

  console.log(`inner page: ${innerUrl}`);
  console.log("View the PNGs before judging the design.");
} finally {
  await browser.close();
}
