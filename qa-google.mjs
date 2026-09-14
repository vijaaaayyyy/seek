import { chromium } from "playwright";

const base = process.env.TARGET_URL || "https://seek-bib");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const hoops = [];
const consoleErrs = [];
page.on("request", (r) => {
  const u = r.url();
  if (/authorize|accounts\.google|supabase\.co|auth\/callback/.test(u)) hoops.push("REQ " + u.slice(0, 190));
});
page.on("response", (r) => {
  const u = r.url();
  if (/authorize|callback/.test(u)) hoops.push("RES " + r.status() + " " + u.slice(0, 190));
});
page.on("console", (m) => { if (m.type() === "error") consoleErrs.push("C:" + m.text().slice(0, 160)); });
page.on("pageerror", (e) => consoleErrs.push("PE:" + String(e).slice(0, 160)));

await page.goto(base.replace(/"/g, "") + "/login", { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForTimeout(1500);
console.log("LOGIN:", (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 160));

const gb = page.getByRole("button", { name: /Continue with Google/i });
if (await gb.count()) {
  await Promise.all([
    page.waitForNavigation({ timeout: 40000 }).catch(() => null),
    gb.first().click(),
  ]);
  await page.waitForTimeout(8000);
  console.log("LANDED URL:", page.url().slice(0, 200));
  console.log("LANDED BODY:", (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 220));
}
console.log("---OBSERVED REQS/RESPS---");
console.log(hoops.slice(0, 40).join("\n"));
console.log("---CONSOLE ERRORS---");
console.log(consoleErrs.slice(0, 12).join("\n") || "(none)");
await browser.close();