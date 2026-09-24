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
  const urls = [
    `<url><loc>${BASE}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${BASE}/books</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
  ];
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
