import { chromium } from "playwright";

const base = (process.env.TARGET_URL || "https://seek-bible.vercel.app").trim();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const hops = [];
const consoleErrs = [];
page.on("request", (r) => {
  const u = r.url();
  if (/authorize|accounts\.google|supabase\.co|googleapis|callback/i.test(u)) hops.push("REQ " + u.slice(0, 180));
});
page.on("response", (r) => {
  const u = r.url();
  if (/authorize|callback/i.test(u)) hops.push("RES " + r.status() + " " + u.slice(0, 180));
});
page.on("pageerror", (e) => consoleErrs.push("PE:" + String(e).slice(0, 180)));
page.on("console", (m) => {
  if (m.type() === "error") consoleErrs.push("C:" + m.text().slice(0, 180));
});

await page.goto(base + "/login", { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForTimeout(2000);
console.log("LOGIN:", (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 170));

const gbtn = page.getByRole("button", { name: /Continue with Google/i });
if (await gbtn.count()) {
  await page.waitForTimeout(500);
  await gbtn.first().click();
  await page.waitForTimeout(9000);
  console.log("URL NOW:", page.url().slice(0, 220));
  console.log("BODY NOW:", (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 220));
} else {
  console.log("NO GOOGLE BUTTON FOUND");
}

console.log("\n--- HOPS ---");
console.log(hops.slice(0, 30).join("\n"));
console.log("\n--- ERRORS ---");
console.log(consoleErrs.slice(0, 10).join("\n") || "(none)");
await browser.close();
