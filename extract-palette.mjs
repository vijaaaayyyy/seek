import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:8080/art/bible-originals.jpg", { waitUntil: "load", timeout: 60000 });

const pal = await page.evaluate(async () => {
  const img = document.querySelector("img");
  if (!img) return { error: "no img" };
  await img.decode();
  const c = document.createElement("canvas");
  const W = 160;
  const H = Math.round((img.naturalHeight / img.naturalWidth) * W);
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;

  const toHex = (r, g, b) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // average colour, and a dark/light split so we can find "leather" and "page"
  let tr = 0, tg = 0, tb = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) { tr += d[i]; tg += d[i + 1]; tb += d[i + 2]; n++; }
  const avg = [tr / n, tg / n, tb / n];

  // quantize to a coarse grid and keep the most common buckets = palette
  const buckets = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const key = [d[i], d[i + 1], d[i + 2]].map((v) => Math.round(v / 24) * 24).join(",");
    const bk = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 };
    bk.n++; bk.r += d[i]; bk.g += d[i + 1]; bk.b += d[i + 2];
    buckets.set(key, bk);
  }
  const top = [...buckets.values()].sort((a, b) => b.n - a.n).slice(0, 12)
    .map((b) => ({ hex: toHex(b.r / b.n, b.g / b.n, b.b / b.n), share: +(b.n / n * 100).toFixed(1), lum: +lum(b.r / b.n, b.g / b.n, b.b / b.n).toFixed(2) }));

  // darkest and lightest regions = candidate leather and page tones
  const dark = top.filter((t) => t.lum < 0.35).sort((a, b) => a.lum - b.lum);
  const light = top.filter((t) => t.lum > 0.6).sort((a, b) => b.lum - a.lum);

  return { size: [img.naturalWidth, img.naturalHeight], avg: toHex(...avg), avgLum: +lum(...avg).toFixed(2), top, dark, light };
});

console.log("  size      " + pal.size.join("x"));
console.log("  average   " + pal.avg + "  (lum " + pal.avgLum + ")");
console.log("  --- dominant palette (share %) ---");
pal.top.forEach((t) => console.log(`    ${t.hex}  ${String(t.share).padStart(5)}%  lum ${t.lum}`));
console.log("  --- darkest (leather candidates) ---");
pal.dark.slice(0, 4).forEach((t) => console.log(`    ${t.hex}  ${String(t.share).padStart(5)}%  lum ${t.lum}`));
console.log("  --- lightest (page candidates) ---");
pal.light.slice(0, 4).forEach((t) => console.log(`    ${t.hex}  ${String(t.share).padStart(5)}%  lum ${t.lum}`));
await browser.close();
