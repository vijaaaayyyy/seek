import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supa/client";
import { App } from "@capacitor/app";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    next:
      typeof search.next === "string" &&
      search.next.startsWith("/") &&
      !search.next.startsWith("//")
        ? search.next
        : undefined,
  }),
  component: AuthCallbackPage,
  head: () =>
    pageSeo({
      // Transient OAuth hand-off — must never be indexed or linked.
      title: "Signing In | SEEK",
      description: "Completing sign-in to SEEK.",
      path: "/auth/callback",
      noindex: true,
    }),
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const nextFromSearch = Route.useSearch({ select: (s) => s.next ?? null });

  useEffect(() => {
    let cancelled = false;

    const resolveNext = () => {
      if (nextFromSearch) return nextFromSearch;
      try {
        const stored = sessionStorage.getItem("seek-auth-next");
        if (stored && stored.startsWith("/") && !stored.startsWith("//")) return stored;
      } catch {
        /* private mode */
      }
      return "/";
    };

    const redirect = (dest: string) => {
      try {
        sessionStorage.removeItem("seek-auth-next");
      } catch {
        /* */
      }
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
      if (!cancelled) redirect(resolveNext());
    };

    const finishErr = (msg: string) => {
      if (!cancelled) setError(msg);
    };

    const exchangeCode = async (code: string) => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (cancelled) return;

      if (error) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          finishOk();
          return;
        }

        const isPkce =
          /code verifier|pkce/i.test(error.message || "") ||
          error.message?.includes("code_verifier");

        if (isPkce) {
          finishErr(
            "Sign-in could not finish in this browser session. Please try again from the same app or browser where you started — do not switch apps mid sign-in.",
          );
          return;
        }

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

        const hash = url.hash?.replace(/^#/, "");
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

    let capHandle: { remove: () => Promise<void> } | null = null;

    void (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        capHandle = await App.addListener("appUrlOpen", ({ url }) => {
          if (url.includes("auth/callback") || url.startsWith("com.seek.bible://")) {
            void handleCallbackUrl(url);
          }
        });
      } catch {
        /* web */
      }
    })();

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
      void capHandle?.remove();
    };
  }, [navigate, nextFromSearch]);

  return (
    <div className="flex min-h-[50dvh] items-center justify-center px-4 pt-3">
      <div className="glass flex w-full max-w-sm flex-col items-center gap-3 rounded-[28px] p-8 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-ink text-paper dark:bg-paper dark:text-ink">
          <span className="size-5 animate-spin rounded-full border-2 border-paper/40 border-t-paper dark:border-ink/40 dark:border-t-ink" />
        </span>
        {error ? (
          <div role="alert" className="font-sans text-sm text-ink dark:text-[#f5f0e8]">
            <p className="leading-relaxed">{error}</p>
            <button
              type="button"
              onClick={() =>
                void navigate({ to: "/login", search: { redirect: "/" }, replace: true })
              }
              className="mt-4 block w-full rounded-2xl bg-ink py-2.5 font-medium text-paper hover:opacity-90 dark:bg-[#f5f0e8] dark:text-[#0c0d12]"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <p className="font-sans text-sm text-muted dark:text-[#f5f0e8]/75">
            Completing your sign-in…
          </p>
        )}
      </div>
    </div>
  );
}
