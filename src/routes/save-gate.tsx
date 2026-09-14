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
        {/*
          The image includes a drawn "Go Back" button.
          We cover that spot with a real Link so tapping it goes to sign-in.
        */}
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

          {/* Invisible hit area over the drawn "Go Back" button (~center of image) */}
          <Link
            to="/login"
            search={{ redirect }}
            aria-label="Go to Sign in or create account"
            className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full"
            style={{
              // Positioned over the black "Go Back" pill in the mockup
              top: "42%",
              width: "42%",
              height: "9%",
            }}
          />

          {/* Visible replacement button sitting on top of "Go Back" */}
          <Link
            to="/login"
            search={{ redirect }}
            className="absolute left-1/2 z-20 flex -translate-x-1/2 items-center justify-center rounded-full bg-ink px-4 font-sans text-[12px] font-medium text-paper shadow-md transition-transform active:scale-[0.97] dark:bg-paper dark:text-ink"
            style={{
              top: "41.5%",
              height: "10%",
              minWidth: "48%",
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
