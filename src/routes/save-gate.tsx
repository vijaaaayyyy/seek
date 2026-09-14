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
    <div className="flex min-h-[calc(100dvh-11rem)] flex-col items-center justify-center px-3 py-6">
      <div className="w-full max-w-[360px] text-center">
        {/* Your uploaded image */}
        <div className="overflow-hidden rounded-[24px] bg-paper shadow-sm ring-1 ring-line">
          <img
            src="/morgan-merrick.jpg"
            alt="Oh noo — giraffe on a scooter"
            className="block h-auto w-full"
            width={736}
            height={552}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="mt-5">
          <Link
            to="/login"
            search={{ redirect }}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 font-sans text-[15px] font-medium text-paper transition-transform duration-150 active:scale-[0.98] dark:bg-paper dark:text-ink"
          >
            Go to Sign in or create acc
          </Link>
        </div>

        <p className="mt-3 font-sans text-[13px] text-muted">
          Free · takes about 10 seconds
        </p>
      </div>
    </div>
  );
}
