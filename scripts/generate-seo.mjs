import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BOOKS } from "../src/data/books.ts";

const SITE_DOMAIN = "stack2set.me";
const BASE = `https://${SITE_DOMAIN}`;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const SEARCH_AGENTS = [
  "Googlebot",
  "Googlebot-News",
  "Googlebot-Image",
  "Googlebot-Video",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "YandexBot",
  "Baiduspider",
  "Sogou",
  "Applebot",
  "SeznamBot",
];

function buildRobots() {
  const blocks = SEARCH_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /`);
  blocks.push("User-agent: *\nAllow: /");
  blocks.push(`Sitemap: ${BASE}/sitemap.xml`);
  return `${blocks.join("\n\n")}\n`;
}

function buildSitemap() {
  // Human-facing pages that should rank. Keep this list in sync with the
  // `noindex` flags in src/lib/seo.ts — anything marked noindex here (search,
  // saved, explore, login, profile, auth/callback) must NOT appear below, or
  // you hand Google a canonical to a page it is told not to index.
  //
  // Priority order mirrors intent: the landing page, then the Bible itself,
  // then the pages that explain the product and earn trust.
  const STATIC_PAGES = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/books", priority: "0.9", changefreq: "monthly" },
    { path: "/about", priority: "0.7", changefreq: "monthly" },
    { path: "/faq", priority: "0.6", changefreq: "monthly" },
    { path: "/groups", priority: "0.6", changefreq: "monthly" },
    { path: "/download", priority: "0.6", changefreq: "monthly" },
    { path: "/pricing", priority: "0.5", changefreq: "yearly" },
    { path: "/changelog", priority: "0.4", changefreq: "weekly" },
    { path: "/privacy", priority: "0.3", changefreq: "yearly" },
    { path: "/terms", priority: "0.3", changefreq: "yearly" },
    { path: "/report-bug", priority: "0.2", changefreq: "yearly" },
  ];

  const urls = STATIC_PAGES.map(
    (p) =>
      `<url><loc>${BASE}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
  );

  for (const book of BOOKS) {
    for (let chapter = 1; chapter <= book.chapters.length; chapter++) {
      urls.push(
        `<url><loc>${BASE}/read/${book.slug}/${chapter}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      );
    }
  }
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls.join("\n")}\n` +
    `</urlset>\n`
  );
}

const robots = buildRobots();
const sitemap = buildSitemap();

writeFileSync(join(OUT, "robots.txt"), robots);
writeFileSync(join(OUT, "sitemap.xml"), sitemap);
console.log(`[seo] wrote public/robots.txt (${robots.length} bytes)`);
console.log(
  `[seo] wrote public/sitemap.xml (${sitemap.length} bytes, ${sitemap.split("<url>").length - 1} urls)`,
);
