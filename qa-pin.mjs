import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 1200 } });
await page.goto("https://pin.it/2myGcNNmS", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(5000);
const imgs = await page.evaluate(() => {
  return [...document.querySelectorAll("img")]
    .map(i => ({ src: i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight }))
    .filter(i => i.w > 200)
    .slice(0, 10);
});
console.log("IMAGES:", JSON.stringify(imgs, null, 2));
await page.screenshot({ path: "C:/Users/vijay/Downloads/qwd9HNzcrClxgHTe-grok-workspace/screenshots/pin.png", fullPage: false });
await browser.close();