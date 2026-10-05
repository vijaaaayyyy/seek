/**
 * The cover behind the home page: a photograph.
 *
 * A full-bleed image, fixed, so the same frame is behind the hero and stays put
 * as the page scrolls to the footer. The picture is the artwork, so the work
 * here is everything that makes type legible *on an arbitrary photograph*,
 * which is a different problem from painting a background whose luminance you
 * chose yourself:
 *
 *  - A scrim, not a solid fill. The wash has to take the contrast out of the
 *    image without hiding it, and a flat `background-color` at the alpha needed
 *    for 4.5:1 under cream type turns the photograph into wallpaper. So it is a
 *    set of gradients: heavier at the top and bottom where the header and the
 *    search bar sit, lighter through the middle where the wordmark goes.
 *
 *  - The wash is deliberately *not* a palette colour. Home is the one surface
 *    that is not the app's paper, and the scrim is tuned against this specific
 *    image. Tying it to `--paper` would make the legibility of the home page
 *    depend on which of the five palettes the reader happened to pick.
 *
 *  - The type on top is cream with a shadow, and the interactive controls are
 *    light glass pills, so they carry their own background rather than trusting
 *    the photograph behind them.
 *
 * On the stacking: this is `z-0`, not `-z-10`. A negative z-index puts the
 * backdrop behind the body's own background, and because `html.home-canopy`
 * paints a background on the html element the body background is no longer
 * propagated to the canvas - it paints as an ordinary block background, which
 * happens *after* negative z-index descendants. The result was a backdrop laid
 * out correctly, loading its texture with no failed requests, and completely
 * invisible. `z-0` with the app content above it is the ordering that paints.
 */
import { useRouterState } from "@tanstack/react-router";

const COVER = "/art/home-cover.jpg";

export function HomeBackdrop() {
  const isHome = useRouterState({
    select: (s) => s.location.pathname === "/" || s.location.pathname === "",
  });

  // The cover belongs to the home page only. It used to render on every route,
  // which was invisible in dark mode (dark scrim on a dark page) and very much
  // not in light mode: the scrims darkened the top of every inner page, so the
  // page title and lede were near-black type on a near-black field.
  if (!isHome) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-home-backdrop={isHome ? "on" : "off"}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${COVER})` }}
      />

      {/*
        The scrim. Three layers doing different jobs:
          - a vertical wash, heaviest top and bottom, for the header and the
            search bar;
          - a broad centre lift, so the wordmark has a calmer field to sit in
            without the whole image being darkened;
          - a soft centre column, which is what actually carries the `SEEK`
            wordmark and the search pill.
        All three are black, so they darken the photograph without recolouring
        it.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,10,8,0.72) 0%, rgba(12,10,8,0.34) 22%, rgba(12,10,8,0.30) 50%, rgba(12,10,8,0.46) 80%, rgba(12,10,8,0.74) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 75% at 50% 42%, rgba(10,8,6,0.46) 0%, rgba(10,8,6,0.16) 45%, transparent 72%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-[24%] h-[38%]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 50%, rgba(8,7,5,0.44) 0%, transparent 78%)",
        }}
      />
    </div>
  );
}
