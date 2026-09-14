import { chromium } from "playwright";

const base = process.env.TARGET || "http://127.0.0.1:8080";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const hops = [];
const errs = [];
page.on("request", (r) => {
  const u = r.url();
  if (/authorize|accounts\.google|\/auth\/callback|supabase/i.test(u))
    hops.push("REQ " + u.slice(0, 190));
});
page.on("response", (r) => {
  const u = r.url();
  if (/authorize|callback/i.test(u)) hops.push("RES " + r.status() + " " + u.slice(0, 190));
});
page.on("pageerror", (e) => errs.push("PE:" + String(e).slice(0, 180)));
page.on("console", (m) => {
  if (m.type() === "error") errs.push("CE:" + m.text().slice(0, 180));
});

await page.goto(base + "/login", { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForTimeout(1500);
const body = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");
console.log("LOGIN:", body.slice(0, 180));

const gb = page.getByRole("button", { name: /Continue with Google/i });
if (await gb.count()) {
  await Promise.all([
    page.waitForNavigation({ timeout: 20000 }).catch(() => null),
    gb.first().click(),
  ]);
  await page.waitForTimeout(7000);
  console.log("URL:", page.url().slice(0, 220));
  console.log("BODY:", (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 250));
} else {
  console.log("NO GOOGLE BUTTON");
}
console.log("\nHOPS:\n" + hops.slice(0, 40).join("\n"));
console.log("\nERRS:\n" + errs.slice(0, 10).join("\n"));
await browser.close();
