import { createRequire } from "node:module";
const require = createRequire("/home/ben/.npm/_npx/9833c18b2d85bc59/node_modules/");
const { chromium } = require("playwright");

/**
 * Screenshot a composed preset.
 *
 *   node shot.mjs <url> <name> [--motion]
 *
 * Default: reduced motion, so off-screen `.reveal` blocks are at their final
 * state and a full-page capture is not full of blank sections.
 * --motion: emulate no preference, scroll the page to fire every reveal, then
 * capture, so motion is exercised rather than skipped.
 */
const args = process.argv.slice(2);
const motion = args.includes("--motion");
const [url, name] = args.filter((a) => !a.startsWith("--"));

const browser = await chromium.launch({
  executablePath: "/snap/bin/chromium",
  args: ["--no-sandbox"],
});

for (const [label, width, height] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: motion ? "no-preference" : "reduce",
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(600);

  if (motion) {
    // Walk the page so every IntersectionObserver fires, then return to top.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += Math.round(height / 12)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(180);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  }

  await page.screenshot({
    path: `${process.env.SHOT_DIR ?? "/tmp/opencode/shots"}/${name}-${label}.png`,
    fullPage: true,
  });
  await page.close();
  console.log(`${name}-${label}.png`);
}

await browser.close();
