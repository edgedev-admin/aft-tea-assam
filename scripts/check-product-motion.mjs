// Browser regression check; Playwright is optional QA tooling, not a runtime dependency.
// Set AFT_PLAYWRIGHT_MODULE to an installed Playwright module path if not installed normally.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const modulePath = process.env.AFT_PLAYWRIGHT_MODULE;
const playwright = await import(modulePath ? pathToFileURL(path.resolve(modulePath)).href : "playwright");
const engine = process.env.AFT_TEST_BROWSER || "webkit";
const browser = await playwright[engine].launch({ headless: true, ...(process.env.AFT_TEST_CHANNEL ? { channel: process.env.AFT_TEST_CHANNEL } : {}) });
const base = process.argv[2] || "http://127.0.0.1:3100";
const output = path.resolve("artifacts/ios-hotfix");
await fs.mkdir(output, { recursive: true });
const results = [];
const errors = [];
try {
  for (const width of [375, 390, 430, 1440]) {
    const height = width > 700 ? 900 : 844;
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: width > 700 ? 1 : 3, isMobile: width < 700, hasTouch: width < 700, reducedMotion: "no-preference" });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".product-motion-feature-layer")).visibility === "visible");
    const sample = async (progress) => {
      await page.evaluate((amount) => {
        const section = document.querySelector(".product-motion");
        const live = section.querySelector(".product-motion-live");
        window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - innerHeight + amount * live.offsetHeight, behavior: "instant" });
      }, progress);
      await page.waitForTimeout(500);
      return page.evaluate(() => {
        const rect = (element) => { const r = element.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; };
        const centre = document.querySelector(".product-motion-feature-tile.is-centre");
        const image = centre.querySelector("img");
        return {
          stage: rect(document.querySelector(".product-motion-sticky")),
          slot: rect(document.querySelector(".product-motion-feature-slot.is-centre")),
          centre: rect(centre),
          centreTransform: getComputedStyle(centre).transform,
          source: image.currentSrc,
          rows: [...document.querySelectorAll(".product-motion-mosaic>.product-motion-row")].map(rect),
          rowTransform: getComputedStyle(document.querySelector(".product-motion-row")).transform,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
    };
    const start = await sample(0.14);
    assert(Math.abs(start.slot.left + start.slot.width / 2 - start.stage.left - start.stage.width / 2) <= 2, `${engine} ${width}: collection slot must be centered in row two`);
    assert(Math.abs(start.centre.left - start.slot.left) <= 2, `${engine} ${width}: rendered collection must originate at its measured slot`);
    assert.equal(start.rows.length, 3);
    assert(start.rows[0].top < start.rows[1].top && start.rows[1].top < start.rows[2].top);
    assert(start.rows.every((row) => row.height > 0 && row.height < start.stage.height / 2));
    if (width === 390) await page.screenshot({ path: path.join(output, `${engine}-390-before.png`) });
    const middle = await sample(0.25);
    assert(middle.centre.width > start.centre.width && middle.centre.width < middle.stage.width, `${engine} ${width}: expansion must follow scroll`);
    assert.notEqual(middle.rowTransform, start.rowTransform, `${engine} ${width}: surrounding rows must move`);
    assert.equal(middle.centreTransform, "none", "Centre artwork must not be scaled as a small raster layer");
    if (width === 390 || width === 1440) await page.screenshot({ path: path.join(output, `${engine}-${width}-middle.png`) });
    const full = await sample(0.361);
    assert(Math.abs(full.centre.left - full.stage.left) <= 2 && Math.abs(full.centre.width - full.stage.width) <= 2 && Math.abs(full.centre.height - full.stage.height) <= 2, `${engine} ${width}: full collection must align with the stage`);
    assert(Math.abs(full.stage.top - middle.stage.top) <= 1, `${engine} ${width}: stage must remain sticky`);
    assert.equal(full.source, middle.source, "Expansion must not swap image sources");
    if (width === 390) await page.screenshot({ path: path.join(output, `${engine}-390-full.png`) });
    for (const [progress, expected] of [[0.56, "Ajanta Gold"], [0.69, "High Societea"]]) {
      await sample(progress);
      const active = await page.evaluate(() => {
        const stage = document.querySelector(".product-motion-sticky").getBoundingClientRect();
        return [...document.querySelectorAll(".product-motion-scene")].find((scene) => Math.abs(scene.getBoundingClientRect().top - stage.top) <= 2)?.querySelector("h3")?.textContent;
      });
      assert.equal(active, expected, `${engine} ${width}: vertical campaign handoff at ${progress}; ${JSON.stringify(await page.evaluate(() => ({y:scrollY,height:document.querySelector('.product-motion').offsetHeight,scenes:[...document.querySelectorAll('.product-motion-scene')].map(e=>({id:e.dataset.campaign,top:e.getBoundingClientRect().top,transform:e.style.transform}))})))}`);
    }
    const reverse = await sample(0.14);
    assert(Math.abs(reverse.centre.left - start.centre.left) <= 2 && Math.abs(reverse.centre.width - start.centre.width) <= 2, `${engine} ${width}: reverse scroll must restore the same tile`);
    assert(!start.overflow && !middle.overflow && !full.overflow);
    if (width === 390) {
      await page.setViewportSize({ width, height: 756 });
      await page.waitForTimeout(500);
      const resized = await sample(0.361);
      assert(Math.abs(resized.centre.width - resized.stage.width) <= 2 && Math.abs(resized.centre.height - resized.stage.height) <= 2, "Viewport-height changes must preserve alignment");
      await page.emulateMedia({ reducedMotion: "reduce" });
      const reduced = await page.evaluate(() => ({ live: getComputedStyle(document.querySelector(".product-motion-live")).display, fallback: getComputedStyle(document.querySelector(".product-motion-static")).display }));
      assert.equal(reduced.live, "none");
      assert.equal(reduced.fallback, "block");
    }
    results.push({ engine, width, passed: true, start: start.centre, middle: middle.centre, full: full.centre });
    await context.close();
  }
  assert.deepEqual(errors, [], "No browser runtime errors");
  await fs.writeFile(path.join(output, `${engine}-checks.json`), JSON.stringify({ results, errors }, null, 2));
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally {
  await browser.close();
}
