/** Route-aware immersive backgrounds using on-repo nature assets. */

export const BACKGROUNDS = [
  "/canopy-hero.jpg",
  "/canopy-hero.webp",
  "/footer-pin.jpg",
  "/footer-bg.jpg",
  "/footer-bg-textfree.jpg",
  "/banner-day.webp",
  "/banner-night.webp",
  "/footer-parchment.jpg",
  "/og.jpg",
  "/canopy-hero.jpg",
] as const;

export type BgIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const ROUTE_BG: Record<string, BgIndex> = {
  "/": 0,
  "/books": 2,
  "/saved": 3,
  "/profile": 5,
  "/search": 1,
  "/explore": 4,
  "/download": 6,
  "/about": 2,
  "/login": 5,
  "/pricing": 3,
  "/faq": 1,
  "/contact": 4,
  "/privacy": 7,
  "/terms": 7,
  "/changelog": 1,
  "/groups": 2,
  "/demo": 0,
  "/report-bug": 6,
};

function hashToIndex(s: string): BgIndex {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 10) as BgIndex;
}

export function bgForPath(pathname: string): BgIndex {
  if (ROUTE_BG[pathname] !== undefined) return ROUTE_BG[pathname];
  if (pathname.startsWith("/read")) return 6;
  if (pathname.startsWith("/auth")) return 5;
  return hashToIndex(pathname);
}

export function bgSrc(index: BgIndex): string {
  return BACKGROUNDS[index];
}

export function preloadBackgrounds(indices: BgIndex[] = [0, 2, 3, 6]) {
  if (typeof window === "undefined") return;
  for (const i of indices) {
    const img = new Image();
    img.src = BACKGROUNDS[i];
  }
}
