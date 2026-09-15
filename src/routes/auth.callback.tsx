import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supa/client";
import { App } from "@capacitor/app";

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

    const handleCallback = async (callbackUrl: string) => {
        try {
            const url = new URL(callbackUrl);
            const code = url.searchParams.get("code");

            if (!code) {
                setError("Sign-in did not finish. Please try again.");
                return;
            }

            const { error } = await supabase.auth.exchangeCodeForSession(code);

            if (cancelled) return;

            if (error) {
                setError("Sign-in could not be completed. Please try again.");
                return;
            }

            redirect(next);
        } catch {
            if (!cancelled) {
                setError("Sign-in could not be completed. Please try again.");
            }
        }
    };

    /**
     * Route the user back after a successful exchange. Custom schemes only via
     * a top-level navigation (the router cannot navigate to them); web paths
     * use the router; same-origin https is honored. Never open redirects.
     */
    const redirect = (dest: string) => {
        if (dest.startsWith("com.seek.bible://")) {
            window.location.href = dest;
            return;
        }
        if (/^https?:\/\//i.test(dest)) {
            try {
                if (new URL(dest).origin === window.location.origin) {
                    window.location.href = dest;
                }
            } catch {
                /* malformed URL — fall through to home */
            }
            return;
        }
        if (dest.startsWith("/") && !dest.startsWith("//")) {
            void navigate({ to: dest, replace: true });
            return;
        }
        void navigate({ to: "/", replace: true });
    };

    // Android / Capacitor deep-link callback
    const listener = App.addListener("appUrlOpen", ({ url }) => {
        if (url.startsWith("com.seek.bible://auth/callback")) {
            void handleCallback(url);
        }
    });

    // Normal web callback
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
        void handleCallback(window.location.href);
    } else {
        setError("Sign-in did not finish. Please try again.");
    }

    return () => {
        cancelled = true;
        void listener.then((handle) => handle.remove());
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