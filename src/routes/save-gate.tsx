import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/save-gate")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      typeof search.redirect === "string" &&
      search.redirect.startsWith("/") &&
      !search.redirect.startsWith("//")
        ? search.redirect
        : "/",
  }),
  component: SaveGatePage,
});

function SaveGatePage() {
  const { redirect } = Route.useSearch();

  return (
    <div className="flex min-h-[calc(100dvh-11rem)] flex-col items-center justify-center px-2 py-6">
      <div className="w-full max-w-[360px] text-center">
        <h1 className="font-serif text-[2.5rem] leading-none font-medium tracking-tight text-ink">
          Oh noo!
        </h1>
        <p className="mx-auto mt-3 max-w-[280px] font-sans text-[14px] leading-relaxed text-muted">
          You&apos;ve caught us at a bad time. Sign in so we can hold on to the
          verse you want to save.
        </p>

        <div className="mt-5">
          <Link
            to="/login"
            search={{ redirect }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 font-sans text-[14px] font-medium text-paper transition-transform duration-150 active:scale-[0.97] dark:bg-paper dark:text-ink"
          >
            Go to Sign in or create acc
          </Link>
        </div>

        {/*
          morgan-merrick.jpg is the full mockup. We crop to the lower
          portion so only the giraffe + runner illustration shows.
        */}
        <div className="mt-8 mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl">
          <img
            src="/morgan-merrick.jpg"
            alt="Giraffe on a scooter racing ahead while someone runs after it"
            className="block w-full h-auto"
            style={{
              // Show only the bottom ~40% of the mockup (the illustration)
              clipPath: "inset(58% 6% 8% 6%)",
              marginTop: "-58%",
              marginBottom: "-8%",
              transform: "scale(1.08)",
              transformOrigin: "center bottom",
            }}
            width={736}
            height={552}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}
