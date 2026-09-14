import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supa/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const next = Route.useSearch({
    select: (s) => {
      const raw = (s as { next?: unknown }).next;
      return typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
    },
  });

  useEffect(() => {
    let cancelled = false;

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      setError("Sign-in did not finish. Please try again.");
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (cancelled) return;
        if (error) {
          setError("Sign-in could not be completed. Please try again.");
          return;
        }
        void navigate({ to: next, replace: true });
      })
      .catch(() => {
        if (cancelled) return;
        setError("Sign-in could not be completed. Please try again.");
      });

    return () => {
      cancelled = true;
    };
  }, [navigate, next]);

  return (
    <div className="pt-3">
      <div className="glass flex flex-col items-center gap-3 rounded-[28px] p-8 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-ink text-paper dark:bg-paper dark:text-ink">
          <span className="size-5 animate-spin rounded-full border-2 border-paper/40 border-t-paper dark:border-ink/40 dark:border-t-ink" />
        </span>
        {error ? (
          <p role="alert" className="font-sans text-sm text-ink">
            {error}
            <button
              type="button"
              onClick={() => void navigate({ to: "/login", search: { redirect: "/" }, replace: true })}
              className="mt-2 block w-full rounded-2xl bg-ink/10 py-2 text-[#000] hover:bg-ink/15 dark:bg-paper/15 dark:text-paper"
            >
              Back to sign in
            </button>
          </p>
        ) : (
          <p className="font-sans text-sm text-muted">Completing your sign-in…</p>
        )}
      </div>
    </div>
  );
}