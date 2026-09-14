import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:8080";
const b = await chromium.launch();
const out = { errors: [] };

for (const [label, width, height] of [["desktop", 1280, 800], ["mobile", 390, 844]]) {
  const page = await b.newPage({ viewport: { width, height } });
  const errs = [];
  page.on("pageerror", (e) => errs.push("pageerror: " + String(e)));
  page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text()); });

  await page.goto(base + "/search?q=love", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const preUrl = page.url();
  const saveBtn = page.getByRole("button", { name: "Save verse" }).first();
  const before = await saveBtn.count();
  await saveBtn.click();
  await page.waitForTimeout(1200);
  const postUrl = page.url();
  const navigated = postUrl !== preUrl;
  const sheetText = await page.locator('[role="dialog"]').allInnerTexts().catch(() => []);
  const imagesInSheet = await page.locator('[role="dialog"] img').count();
  const sheetVisible = await page.locator('[role="dialog"]').isVisible().catch(() => false);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);

  console.log(JSON.stringify({ label, saveBtnPresent: !!before, navigated, sheetVisible, sheetText: sheetText[0]?.replace(/\s+/g, " ").trim().slice(0, 220), imagesInSheet, overflow, errs }));
  await page.screenshot({ path: `screenshots/sheet-${label}.png` });
  out.errors.push(...errs);
  await page.close();
}

console.log(JSON.stringify({ ok: out.errors.length === 0, errors: out.errors }));
await b.close();