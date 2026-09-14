import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push("PE:" + String(e).slice(0, 180)));
page.on("console", (m) => { if (m.type() === "error") errs.push("C:" + m.text().slice(0, 180)); });

const base = process.env.TARGET_URL || "https://seek-bible.vercel.app";
const hops = [];
page.on("request", (r) => {
  const u = r.url();
  if (/authorize|callback|accounts\.google|supabase/.test(u)) hops.push("REQ " + u.slice(0, 170));
});

await page.goto(base + "/login", { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForTimeout(1800);
console.log("LOGIN:", (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 180));

const gb = page.getByRole("button", { name: /Continue with Google/i });
if (await gb.count()) {
  await Promise.all([
    page.waitForNavigation({ timeout: 30000 }).catch(() => null),
    gb.first().click(),
  ]);
  await page.waitForTimeout(6000);
  console.log("LANDED:", (await page.evaluate(() => location.href)).slice(0, 200));
  console.log("BODY:", (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 250));
}
console.log("HOPS:\n" + hops.slice(0, 40).join("\n"));
console.log("ERRS:\n" + errs.slice(0, 10).join("\n"));
await browser.close();