import { useRouterState } from "@tanstack/react-router";

/**
 * The home cover: deep warm charcoal with one soft gold light behind the hero.
 * Mounted once in the root; painted only on `/` so other routes keep their own
 * surface.
 */
export function HomeBackdrop() {
  const isHome = useRouterState({
    select: (s) => s.location.pathname === "/" || s.location.pathname === "",
  });

  if (!isHome) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#1c1612]"
      data-home-backdrop="on"
    >
      <div className="absolute inset-0 bg-[url('/images/home-bg.gif')] bg-cover bg-center opacity-[0.35] mix-blend-screen [filter:invert(1)_sepia(1)_saturate(3)_hue-rotate(-12deg)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_42%_at_50%_18%,rgba(212,175,55,0.14),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(8,5,3,0.55)_100%)]" />
    </div>
  );
}
