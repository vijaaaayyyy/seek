import { chromium } from "playwright";

const target = process.env.TARGET || "http://127.0.0.1:8080";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(target + "/", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(1800vin");
const h1 = await page.evaluate(() => {
  const el = document.querySelector("h1");
  if (!el) return null;
  return { text: el.innerText, html: el.innerHTML, renderedLines: el.getClientRects().length };
});
console.log(JSON.stringify(h1, null, 2));
const top = await page.evaluate(() => document.title);
console.log("TITLE:", top);
await browser.close();