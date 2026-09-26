/**
 * Generate the share card at public/og.jpg (1200x630).
 *
 * The card is the one image every shared SEEK link shows, so it has to say what
 * the site is without being read. It is built here as HTML and screenshotted,
 * rather than drawn with a canvas API, so the type is real Newsreader and the
 * layout can be checked in the same pass.
 *
 * Kept out of `npm run build` on purpose: it needs a Chromium download, and the
 * card only changes when the brand does. Re-run it by hand after editing this
 * file, then confirm with `node scripts/brand-check.mjs`.
 *
 *   node scripts/generate-og-card.mjs
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public/og.jpg");

// Mirrors the light theme tokens in src/styles.css.
const PAPER = "#f7f5f0";
const INK = "#1c1915";
const MUTED = "#6d655c";
const FAINT = "#9a9288";
const FOREST = "#3f4a42";

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: ${PAPER};
    color: ${INK};
    font-family: "Newsreader", "Iowan Old Style", Palatino, Georgia, serif;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 74px 84px 0;
    position: relative;
  }
  .eyebrow {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 19px;
    font-weight: 500;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: ${FAINT};
  }
  .verse {
    font-size: 62px;
    line-height: 1.18;
    font-weight: 400;
    letter-spacing: -0.012em;
    max-width: 15ch;
  }
  .verse .ref {
    display: block;
    margin-top: 26px;
    font-size: 25px;
    font-style: italic;
    color: ${MUTED};
    letter-spacing: 0;
  }
  .rule { width: 76px; height: 3px; background: ${FOREST}; opacity: 0.85; }
  .foot {
    display: flex;
    align-items: baseline;
    gap: 22px;
    padding-bottom: 40px;
  }
  .wordmark {
    font-size: 44px;
    font-weight: 600;
    letter-spacing: 0.2em;
    color: ${INK};
  }
  .tag {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 20px;
    color: ${MUTED};
    letter-spacing: 0.01em;
  }
  /* A quiet echo of the forest illustration in the app, kept low-contrast so
     it never competes with the verse at thumbnail size. */
  .trees {
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 168px;
    opacity: 0.1;
  }
</style>
</head>
<body>
  <p class="eyebrow">King James Bible</p>

  <div>
    <p class="verse" id="verse">
      The LORD is my shepherd; I shall not want.
      <span class="ref" id="ref">Psalm 23:1</span>
    </p>
  </div>

  <div class="foot">
    <span class="rule"></span>
    <span class="wordmark">SEEK</span>
    <span class="tag">free &middot; no account to read or search</span>
  </div>

  <svg class="trees" viewBox="0 0 1200 168" preserveAspectRatio="none" aria-hidden="true">
    <path fill="${FOREST}" d="M0 168V96l34-30 22 20 20-38 26 44 24-22 30 26 26-58 30 62 28-30 30 34 26-44 28 40 24-26 34 30 30-52 26 56 30-32 28 30 26-44 30 48 30-30 30 28 26-40 30 46 30-24 34 30 40-40 40 40v64z"/>
  </svg>
</body>
</html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  // The card is text, so a font that never loaded would silently change the
  // line breaks the layout was measured against.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);

  const report = await page.evaluate(() => {
    const v = document.getElementById("verse");
    const r = document.getElementById("ref");
    return {
      newsreader: document.fonts.check('400 62px "Newsreader"'),
      verseOverflows: v.scrollWidth > v.clientWidth + 1,
      refOverflows: r.scrollWidth > r.clientWidth + 1,
      bodyOverflows: document.body.scrollHeight > 630,
    };
  });

  const problems = [];
  if (!report.newsreader) problems.push("Newsreader did not load; metrics will differ");
  if (report.verseOverflows) problems.push("verse text overflows its box");
  if (report.refOverflows) problems.push("reference overflows its box");
  if (report.bodyOverflows) problems.push("card content is taller than 630px");

  const buf = await page.screenshot({ type: "jpeg", quality: 88 });
  // scripts/brand-check.mjs refuses cards at or above this; link scrapers skip
  // the image rather than render it slowly.
  const MAX = 600 * 1024;
  if (buf.length >= MAX) problems.push(`card is ${buf.length} bytes, over the ${MAX} budget`);

  if (problems.length) {
    console.error("og card NOT written:\n- " + problems.join("\n- "));
    process.exitCode = 1;
  } else {
    writeFileSync(OUT, buf);
    console.log(
      `wrote public/og.jpg (1200x630, ${buf.length} bytes, ${Math.round(
        (buf.length / MAX) * 100,
      )}% of the ${MAX} byte budget)`,
    );
  }
} finally {
  await browser.close();
}
