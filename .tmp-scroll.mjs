import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:8080";
const b = await chromium.launch();
const out = { errors: [] };

for (const [label, width, height] of [["desktop", 1280, 800], ["mobile", 390, 844]]) {
  const page = await b.newPage({ viewport: { width, height } });
  const errs = [];
  page.on("pageerror", (e) => errs.push("pageerror: " + String(e)));
  page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text()); });

  await page.goto(base + "/read/genesis/1", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const main = document.querySelector("main");
    if (main) main.scrollTop = main.clientHeight * 0.7;
  });
  await page.waitForTimeout(600);

  const headerInfo = await page.evaluate(() => {
    const bars = [...document.querySelectorAll("main [class*='glass-solid']")];
    const b = bars[0];
    if (!b) return { none: true };
    const r = b.getBoundingClientRect();
    const bg = getComputedStyle(b).backgroundColor;
    // how much verse text overlaps the bar's box (elements under it)
    const els = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const under = els.filter((e) => e !== b && e !== document.body && e !== document.documentElement && !e.closest("[class*='glass-solid']")).slice(0, 3).map((e) => e.tagName + "." + String(e.className).slice(0, 30));
    return { y: Math.round(r.y), h: Math.round(r.height), bg, under };
  });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  console.log(JSON.stringify({ label, headerInfo, overflow, errs }));
  await page.screenshot({ path: `screenshots/scroll-${label}.png`, fullPage: false });
  out.errors.push(...errs);
  await page.close();
}

console.log(JSON.stringify({ ok: out.errors.length === 0, errors: out.errors }));
await b.close();