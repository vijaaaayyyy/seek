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
    <div className="flex min-h-[calc(100dvh-11rem)] flex-col items-center justify-center px-1 py-4">
      <div className="w-full max-w-[380px] text-center">
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

        {/* Your uploaded illustration */}
        <div className="mt-6 -mx-1">
          <img
            src="/morgan-merrick.jpg"
            alt="Giraffe on a scooter racing ahead while someone runs after it"
            className="mx-auto h-auto w-full object-contain"
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
