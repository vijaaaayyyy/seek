/**
 * Single source of truth for SEEK's technical/SEO identity.
 *
 * The domain is intentionally `stack2set.me` — it is the site's real, permanent
 * address and must NOT be changed. The *brand* is SEEK, and nothing in this file
 * (or anywhere else in the app) refers to the domain's previous developer-site
 * identity. Canonical URLs, the sitemap and robots.txt all derive from here so
 * the host can only ever be spelled one way.
 */

export const SITE_DOMAIN = "stack2set.me";
export const CANONICAL_ORIGIN = `https://${SITE_DOMAIN}`;

/** Brand name as it should appear in titles, schema and social cards. */
export const SITE_NAME = "SEEK";

/** The only Scripture translation SEEK serves — never claim more than this. */
export const TRANSLATION = "King James Version (KJV)";

export const SITE_DESCRIPTION =
  "Search and read the King James Bible on SEEK. Find a verse by a half-remembered word, a fragment, or the meaning you meant — all 66 books, 1,189 chapters, free.";

/**
 * Absolute canonical URL for a route path. Accepts `books`, `/books`, `/books/`
 * and normalises all of them to the one canonical spelling, so trailing-slash
 * variants can never emit a second, competing canonical.
 */
export function canonical(path: string): string {
  const trimmed = `/${String(path).replace(/^\/+|\/+$/g, "")}`;
  return `${CANONICAL_ORIGIN}${trimmed === "/" ? "/" : trimmed}`;
}

export type PageSeo = {
  /** Unique, descriptive, ends in `| SEEK`. */
  title: string;
  /** Unique, factual, ~140-160 characters. */
  description: string;
  /** Route path this page is canonically known by. */
  path: string;
  /**
   * True for pages that must never be indexed — personalised, transient, or
   * private (search results, saved verses, profile, login, auth callbacks).
   * Those still get a canonical + `follow` so link equity flows correctly.
   */
  noindex?: boolean;
};

const INDEX_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1";
const NOINDEX_ROBOTS = "noindex, follow";

/**
 * The standard `head` block for a page: one unique title, one unique meta
 * description, a robots directive, and a self-referencing canonical.
 *
 * Open Graph / Twitter tags are deliberately NOT emitted here. The platform's
 * PWA middleware strips every `og:*` / `twitter:*` tag from the served HTML and
 * re-emits them from `src/lib/og/site.json` + the on-disk `public/og.jpg`, so
 * tags added at the route level are discarded. The share-card identity is
 * therefore maintained in those two places, not per route.
 */
export function pageSeo(page: PageSeo) {
  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { name: "robots", content: page.noindex ? NOINDEX_ROBOTS : INDEX_ROBOTS },
    ],
    links: [{ rel: "canonical", href: canonical(page.path) }],
  };
}

/**
 * `WebSite` + `Organization` for the whole site. Emitted on the homepage only —
 * repeating it on every page is noise. No ratings, reviews, authors or dates are
 * claimed, because none are true.
 */
export function siteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "Seek",
    url: `${CANONICAL_ORIGIN}/`,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${CANONICAL_ORIGIN}/`,
      logo: {
        "@type": "ImageObject",
        url: `${CANONICAL_ORIGIN}/icons/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${CANONICAL_ORIGIN}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
