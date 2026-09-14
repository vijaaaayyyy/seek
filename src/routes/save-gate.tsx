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
      <div className="w-full max-w-[360px]">
        <div className="relative overflow-hidden rounded-[24px] bg-paper shadow-sm ring-1 ring-line">
          <img
            src="/morgan-merrick.jpg"
            alt="Oh noo — giraffe on a scooter"
            className="block h-auto w-full select-none"
            width={736}
            height={552}
            draggable={false}
            loading="eager"
            decoding="async"
          />

          {/* Real button covering the drawn "Go Back" pill in the image */}
          <Link
            to="/login"
            search={{ redirect }}
            className="absolute left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink px-4 font-sans text-[12px] font-medium leading-none text-paper shadow-md transition-transform active:scale-[0.97] dark:bg-paper dark:text-ink"
            style={{
              // Centered on the black "Go Back" button in the mockup
              top: "36%",
              height: "7.5%",
              minWidth: "52%",
              whiteSpace: "nowrap",
            }}
          >
            Go to Sign in or create acc
          </Link>
        </div>

        <p className="mt-4 text-center font-sans text-[13px] text-muted">
          Free · takes about 10 seconds
        </p>
      </div>
    </div>
  );
}
