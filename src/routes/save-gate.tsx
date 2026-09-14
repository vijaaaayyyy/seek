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
        <div className="overflow-hidden rounded-[28px] bg-paper px-5 pb-5 pt-8 shadow-sm ring-1 ring-line">
          <h1 className="font-serif text-[2.4rem] leading-none font-medium tracking-tight text-ink">
            Oh noo!
          </h1>

          <p className="mx-auto mt-3 max-w-[280px] font-sans text-[14px] leading-relaxed text-muted">
            You need an account to save this verse. Sign in or create one and
            we&apos;ll keep it with you on every device.
          </p>

          <div className="mt-5">
            <Link
              to="/login"
              search={{ redirect }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 font-sans text-[14px] font-medium text-paper transition-transform duration-150 active:scale-[0.97] dark:bg-paper dark:text-ink"
            >
              Go to Sign in or create acc
            </Link>
          </div>

          {/* Illustration only — crop hides the old mockup text/button */}
          <div
            className="relative mx-auto mt-6 w-full max-w-[300px] overflow-hidden"
            style={{ height: 130 }}
          >
            <img
              src="/morgan-merrick.jpg"
              alt="Giraffe on a scooter racing ahead while someone runs after it"
              className="absolute left-1/2 block max-w-none -translate-x-1/2 select-none"
              style={{
                width: "118%",
                top: "-64%",
              }}
              width={736}
              height={552}
              draggable={false}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <p className="mt-4 font-sans text-[13px] text-muted">
          Free · takes about 10 seconds
        </p>
      </div>
    </div>
  );
}
