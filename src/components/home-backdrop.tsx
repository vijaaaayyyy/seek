/**
 * The cover behind the home page.
 *
 * Two layers, one element:
 *
 *  1. The still. A single image, drawn once, fixed to the viewport, so the
 *     picture never scrolls, never repeats, and never shows a seam. It reads as
 *     one continuous sheet from the hero down to the footer because there is
 *     only ever one copy of it on screen.
 *
 *  2. The live layer, if you switch it on. Set `VITE_HOME_BG_VIDEO` to the path
 *     of a looping clip and it plays over the still, which becomes its poster.
 *
 * The video is opt-in by env var rather than probed for with a `fetch`. An
 * earlier version HEAD-requested the file to see whether it was there, which
 * meant every visit logged a 404 to the console for a file that legitimately may
 * not exist yet - a permanent, meaningless error in the log. An env var is
 * explicit, costs no request, and cannot produce a false negative.
 *
 * The picture is pushed well down in luminance and sits under a leather wash, so
 * text keeps its contrast. A background photo that competes with body text is
 * the reason the earlier version read grey; this one is furniture.
 */
import { useEffect, useRef } from "react";

const STILL = "/art/home-bg.png";

/** Set to e.g. "/media/home-loop.mp4" to put a live layer over the still. */
const LIVE = (import.meta.env.VITE_HOME_BG_VIDEO as string | undefined)?.trim() || "";

export function HomeBackdrop() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasVideo = Boolean(LIVE);

  useEffect(() => {
    // Autoplay is refused whenever the visitor has asked for reduced motion, and
    // is often refused on low-power modes regardless. Treat refusal as normal.
    const el = videoRef.current;
    if (!el || !hasVideo) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    void el.play().catch(() => {
      /* browser declined; the poster frame is still correct */
    });
  }, [hasVideo]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {hasVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={LIVE}
          poster={STILL}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
      ) : (
        // `blur-[2px]` is not a filter flourish, it is honest damage control.
        // The source is 256x256 and covers a 1440px viewport, so it is upscaled
        // roughly 5.6x; a hair of blur makes the interpolation read as
        // depth-of-field rather than as a low-resolution asset. Swap in a
        // full-size original and this can come straight out.
        <img
          className="absolute inset-0 size-full scale-105 object-cover blur-[2px]"
          src={STILL}
          alt=""
        />
      )}

      {/* Leather wash. This is what makes one image sit under a full page of
          cream text without fighting it. */}
      <div className="absolute inset-0 bg-[#2a1d14]/72" />
      {/* Vignette to the corners, so the frame's gilt rules stay the brightest
          thing on screen. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_35%,transparent_35%,rgba(20,13,8,0.55)_100%)]" />
    </div>
  );
}
