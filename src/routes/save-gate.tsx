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
        <div className="overflow-hidden rounded-[28px] bg-paper px-5 py-10 shadow-sm ring-1 ring-line">
          <h1 className="font-serif text-[2.4rem] leading-none font-medium tracking-tight text-ink">
            Oh noo!
          </h1>

          <p className="mx-auto mt-3 max-w-[280px] font-sans text-[14px] leading-relaxed text-muted">
            You need an account to save this verse. Sign in or create one and
            we&apos;ll keep it with you on every device.
          </p>

          <div className="mt-6">
            <Link
              to="/login"
              search={{ redirect }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 font-sans text-[14px] font-medium text-paper transition-transform duration-150 active:scale-[0.97] dark:bg-paper dark:text-ink"
            >
              Go to Sign in or create acc
            </Link>
          </div>
        </div>

        <p className="mt-4 font-sans text-[13px] text-muted">
          Free · takes about 10 seconds
        </p>
      </div>
    </div>
  );
}
