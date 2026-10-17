import { chromium } from "playwright";
import { PNG } from "pngjs";

const url = process.argv[2] || "http://127.0.0.1:8080/";
const modes = (process.argv[3] || "light,dark").split(",");

const srgb = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const blend = (fg, bg, a) => fg.map((c, i) => c * a + bg[i] * (1 - a));

const SEL = "p,span,a,button,h1,h2,h3,h4,li,label,td,th,dt,dd";

const browser = await chromium.launch();
let total = 0;
let bad = 0;

for (const mode of modes) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text().slice(0, 140)));

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate((m) => {
    localStorage.setItem("seek-theme", m);
    document.documentElement.classList.toggle("dark", m === "dark");
  }, mode);
  await page.reload({ waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(Number(process.env.SETTLE || 1200));

  // Pass 1: real foreground colours, while the text is still painted. Hand the
  // computed colour to a canvas and read the pixel back, so oklab()/color-mix()
  // resolve to the sRGB a screen actually shows.
  const colors = await page.evaluate((sel) => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    const toRgb = (css) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000";
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return { rgb: [d[0], d[1], d[2]], alpha: d[3] / 255 };
    };
    const out = [];
    for (const el of document.querySelectorAll(sel)) {
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (Number(cs.opacity) < 0.9) continue;
      if (el.closest("[aria-hidden='true']")) continue;
      if (el.getAttribute("aria-hidden") === "true") continue; // hover-swap copies
      if (el.closest(".sr-only") || el.classList.contains("sr-only")) continue;
      const text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) continue;
      // Tight glyph box, not the element box: a rounded translucent pill has
      // legitimately dark pixels in its corners, and no glyph is ever drawn
      // there, so sampling the element box would invent failures.
      const range = document.createRange();
      let node = null;
      for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { node = n; break; }
      if (!node) continue;
      range.selectNodeContents(node);
      const g = range.getBoundingClientRect();
      range.detach?.();
      if (g.width < 3 || g.height < 3) continue;
      if (g.bottom < 0 || g.top > innerHeight || g.right < 0 || g.left > innerWidth) continue;
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      const fg = toRgb(cs.color);
      out.push({
        text: text.slice(0, 30),
        fg: fg.rgb,
        alpha: fg.alpha,
        size,
        need: size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5,
        cls: el.className?.toString?.().slice(0, 44) || "",
        rect: { x: Math.round(g.x), y: Math.round(g.y), w: Math.round(g.width), h: Math.round(g.height) },
      });
    }
    return out;
  }, SEL);

  // Pass 2 exists only to capture a screenshot with the glyphs masked out.
  // The colours and glyph rects were already read above, and `color:
  // transparent` changes no layout, so they still describe this frame exactly.
  await page.addStyleTag({
    content: `*, *::before, *::after {
      color: transparent !important;
      -webkit-text-fill-color: transparent !important;
      text-shadow: none !important;
    }`,
  });
  await page.waitForTimeout(400);
  const bare = PNG.sync.read(await page.screenshot());

  const fails = [];
  for (const n of colors) {
    const r = n.rect;
    if (n.alpha < 0.3) continue; // watermark textures, not content

    const samples = [];
    for (let x = Math.max(0, r.x); x < Math.min(r.x + r.w, bare.width - 1); x += 1) {
      for (let y = Math.max(0, r.y); y < Math.min(r.y + r.h, bare.height - 1); y += 1) {
        const p = (bare.width * y + x) << 2;
        samples.push([bare.data[p], bare.data[p + 1], bare.data[p + 2]]);
      }
    }
    if (samples.length < 8) continue;
    total++;

    // Worst case in the region: light text is hurt most by the brightest
    // background pixel, dark text by the darkest.
    const isLight = lum(n.fg) > 0.5;
    let worst = samples[0];
    for (const s of samples) {
      if (isLight ? lum(s) > lum(worst) : lum(s) < lum(worst)) worst = s;
    }
    const cr = ratio(blend(n.fg, worst, n.alpha), worst);
    if (cr < n.need) {
      bad++;
      fails.push(
        `     ${cr.toFixed(2)}:1 (need ${n.need}) ${n.size}px "${n.text}" fg=${n.fg}@${n.alpha.toFixed(2)} worst-bg=${worst} .${n.cls}`,
      );
    }
  }

  console.log(`  ===== ${mode} ===== ${fails.length} below threshold of ${colors.length} visible text nodes`);
  fails.slice(0, 12).forEach((f) => console.log(f));
  if (fails.length > 12) console.log(`     ...and ${fails.length - 12} more`);
  if (errors.length) console.log("  errors: " + [...new Set(errors)].slice(0, 3).join(" | "));
  await page.close();
}

console.log(`  TOTAL ${bad}/${total} below threshold`);
await browser.close();
