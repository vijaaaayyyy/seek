import { chromium } from "playwright";

const base = process.env.TARGET || "http://127.0.0.1:8080";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(1200);
const h1 = await page.evaluate(() => {
  const el = document.querySelector("h1");
  if (!el) return null;
  return { text: el.innerText, inner: el.innerHTML, width: el.getBoundingClientRect().width };
});
console.log(JSON.stringify(h1, null, 2));
await browser.close();
