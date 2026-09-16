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
      return typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//")
        ? raw
        : "/";
    },
  });

  useEffect(() => {
    let cancelled = false;

    const redirect = (dest: string) => {
      if (dest.startsWith("com.seek.bible://")) {
        window.location.href = dest;
        return;
      }
      if (/^https?:\/\//i.test(dest)) {
        try {
          if (new URL(dest).origin === window.location.origin) {
            window.location.href = dest;
            return;
          }
        } catch {
          /* fall through */
        }
      }
      if (dest.startsWith("/") && !dest.startsWith("//")) {
        void navigate({ to: dest, replace: true });
        return;
      }
      void navigate({ to: "/", replace: true });
    };

    const finishOk = () => {
      if (!cancelled) redirect(next);
    };

    const finishErr = (msg: string) => {
      if (!cancelled) setError(msg);
    };

    const exchangeCode = async (code: string) => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (cancelled) return;
      if (error) {
        finishErr(error.message || "Sign-in could not be completed. Please try again.");
        return;
      }
      finishOk();
    };

    const tryExistingSession = async (): Promise<boolean> => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        finishOk();
        return true;
      }
      return false;
    };

    const handleCallbackUrl = async (callbackUrl: string) => {
      try {
        const url = new URL(callbackUrl);

        const oauthError =
          url.searchParams.get("error_description") ||
          url.searchParams.get("error") ||
          null;
        if (oauthError) {
          finishErr(oauthError.replace(/\+/g, " "));
          return;
        }

        const code = url.searchParams.get("code");
        if (code) {
          await exchangeCode(code);
          return;
        }

        const hash = url.hash?.startsWith("#") ? url.hash.slice(1) : url.hash;
        if (hash) {
          const params = new URLSearchParams(hash);
          const hashError = params.get("error_description") || params.get("error");
          if (hashError) {
            finishErr(hashError.replace(/\+/g, " "));
            return;
          }
          if (params.get("access_token")) {
            if (await tryExistingSession()) return;
            await new Promise((r) => setTimeout(r, 400));
            if (await tryExistingSession()) return;
          }
        }

        if (await tryExistingSession()) return;

        finishErr("Sign-in did not finish. Please try again.");
      } catch {
        if (!cancelled) {
          finishErr("Sign-in could not be completed. Please try again.");
        }
      }
    };

    const listener = App.addListener("appUrlOpen", ({ url }) => {
      if (url.includes("auth/callback") || url.startsWith("com.seek.bible://")) {
        void handleCallbackUrl(url);
      }
    });

    void handleCallbackUrl(window.location.href);

    const timeout = window.setTimeout(() => {
      if (!cancelled) {
        void tryExistingSession().then((ok) => {
          if (!ok) finishErr("Sign-in timed out. Please try again.");
        });
      }
    }, 12_000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      void listener.then((handle) => handle.remove());
    };
  }, [navigate, next]);

  return (
    <div className="flex min-h-[50dvh] items-center justify-center pt-3">
      <div className="glass flex w-full max-w-sm flex-col items-center gap-3 rounded-[28px] p-8 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-ink text-paper dark:bg-paper dark:text-ink">
          <span className="size-5 animate-spin rounded-full border-2 border-paper/40 border-t-paper dark:border-ink/40 dark:border-t-ink" />
        </span>
        {error ? (
          <div role="alert" className="font-sans text-sm text-ink">
            <p>{error}</p>
            <button
              type="button"
              onClick={() =>
                void navigate({ to: "/login", search: { redirect: "/" }, replace: true })
              }
              className="mt-3 block w-full rounded-2xl bg-ink/10 py-2.5 text-ink hover:bg-ink/15 dark:bg-paper/15 dark:text-paper"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <p className="font-sans text-sm text-muted">Completing your sign-in…</p>
        )}
      </div>
    </div>
  );
}
