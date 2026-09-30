/**
 * The cover behind the home page: a long sheet of vellum hanging in the air.
 *
 * The brief was a long parchment that moves the way cloth moves when there is a
 * draught in the room, so this is built as a hanging sheet rather than as a
 * flat background image.
 *
 * How the wave is made, and why this way:
 *
 *  - The sheet is cut into a row of narrow vertical panels, each painted with
 *    the same seamless vellum tile and offset by one tile-width per panel, so
 *    the texture is continuous across the whole sheet with no seam and no
 *    repeat. Each panel then breathes on its own phase (`--wave-i`), and a
 *    travelling gradient on each panel supplies the crest and trough. Stacked,
 *    those read as one sheet of paper lifting and settling.
 *
 *  - It is DOM, not canvas and not a video. Nothing to decode, no second
 *    decoder competing with the page, and it keeps working when a video would
 *    be refused (reduced motion, low power, save-data). It also costs nothing
 *    when the tab is in the background, because CSS animations are throttled by
 *    the browser rather than by a rAF loop I would have to pause myself.
 *
 *  - `prefers-reduced-motion` removes the animation in CSS and leaves a still
 *    sheet, which still reads as vellum because the texture and the deckled
 *    edges are paint, not movement.
 *
 * Mounted once, in the root, because `AppShell` renders its children twice - a
 * `hidden lg:flex` branch and a mobile branch - so a backdrop placed in the
 * page existed twice and burned battery decoding a second copy for a picture
 * nobody could see.
 */
import { useRouterState } from "@tanstack/react-router";

const VELLUM = "/art/vellum.png";

/**
 * Panel count. Each panel is a slice of the sheet, so this is also the width of
 * the wave's finest detail: more panels means a smoother curve and a larger
 * number of composited layers. 14 keeps the silhouette smooth on a wide screen
 * while staying cheap; the gradient on each panel fills the gaps between them.
 */
const PANELS = 14;

export function HomeBackdrop() {
  const isHome = useRouterState({
    select: (s) => s.location.pathname === "/" || s.location.pathname === "",
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      // Kept in the tree on every route, but only painted on home. Off home the
      // page shows its own calf, and there is nothing to unmount.
      data-home-backdrop={isHome ? "on" : "off"}
    >
      <div
        className="absolute inset-[-3%] [--wave-amp:9px] md:[--wave-amp:13px]"
        style={
          {
            // The sheet is one tile wide per panel; shifting the background by
            // -100% of the panel's own width steps the texture along seamlessly.
            "--wave-lag": "-0.46s",
            "--wave-dur": "7.4s",
          } as React.CSSProperties
        }
      >
        {Array.from({ length: PANELS }, (_, i) => (
          <div
            key={i}
            className="parchment-panel"
            style={
              {
                left: `${(i / PANELS) * 100}%`,
                width: `${100 / PANELS + 0.6}%`,
                // one tile per panel, stepped by whole tiles across the sheet
                backgroundImage: `url(${VELLUM})`,
                backgroundSize: `${PANELS * 100}% 100%`,
                backgroundPosition: `${(i * 100) / PANELS}% 0`,
                "--wave-i": i,
              } as React.CSSProperties
            }
          >
            <span />
          </div>
        ))}
      </div>

      {/* The sheet is lit from the front and falls away at the edges, so the
          top and bottom of a long hanging sheet sit in their own shadow. */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_78%_at_50%_28%,transparent_28%,rgba(16,10,6,0.42)_78%,rgba(12,7,4,0.62)_100%)]" />
      {/* Deckle: the torn, fibrous edge of a sheet that was made by hand. Two
          gradients rather than an image, so it stays sharp at any size. */}
      <div className="absolute inset-x-0 top-0 h-[7vh] bg-[linear-gradient(180deg,rgba(12,7,4,0.85),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-[9vh] bg-[linear-gradient(0deg,rgba(12,7,4,0.88),transparent)]" />
      {/* A breath of calf over the whole sheet, so cream type has something to
          sit on without the artwork having to be bleached out. */}
      <div className="absolute inset-0 bg-[#2a1d14]/62" />
    </div>
  );
}
