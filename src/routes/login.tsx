import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { BookOpen, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BibleReadingAnimation } from "@/components/bible-reading-animation";
import { signIn, signInEmail, signUpEmail } from "@/lib/supa/client";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      typeof search.redirect === "string" &&
      search.redirect.startsWith("/") &&
      !search.redirect.startsWith("//")
        ? search.redirect
        : "/",
  }),
  component: LoginPage,
});

type Mode = "signin" | "create";

const PROVIDERS = [
  { provider: "google", label: "Google", icon: GoogleIcon },
  { provider: "github", label: "GitHub", icon: GithubIcon },
] as const;

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Already signed in → leave the login form (avatar in header is enough).
  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: redirect || "/" });
    }
  }, [isPending, user, redirect, navigate]);

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setError(null);
    setInfo(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (mode === "create" && name.trim().length < 2) {
      setError("Add your name so we know what to call you.");
      return;
    }
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result =
        mode === "create"
          ? await signUpEmail(cleanEmail, password, name.trim())
          : await signInEmail(cleanEmail, password);
      if (result.error) {
        setError(friendlyAuthError(result.error));
        setBusy(false);
        return;
      }
      if (mode === "create") {
        setInfo("Check your email to confirm your account, then sign in.");
        setBusy(false);
        return;
      }
      void navigate({ to: redirect || "/" });
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    setBusy(true);
    setError(null);
    try {
      await signIn(provider, { callbackURL: redirect || "/" });
    } catch {
      setError("Could not start sign-in. Please try again.");
      setBusy(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-pulse rounded-full bg-ink/10" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-8">
      <div className="mb-6 flex items-center gap-2 text-forest">
        <BookOpen className="size-5" strokeWidth={1.8} />
        <span className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase">
          King James Bible
        </span>
      </div>
      <h1 className="font-serif text-[2rem] font-medium text-ink">
        {mode === "signin" ? "Welcome back" : "Create account"}
      </h1>
      <p className="mt-2 text-center font-sans text-[14px] text-muted">
        {mode === "signin"
          ? "Sign in to save verses and keep your place."
          : "Join SEEK to bookmark and sync across devices."}
      </p>

      <div className="mt-6 flex w-full gap-1 rounded-full bg-wash p-1">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={cn(
            "flex-1 rounded-full py-2 font-sans text-[13px] font-medium transition-colors",
            mode === "signin" ? "bg-surface text-ink shadow-sm" : "text-muted",
          )}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => switchMode("create")}
          className={cn(
            "flex-1 rounded-full py-2 font-sans text-[13px] font-medium transition-colors",
            mode === "create" ? "bg-surface text-ink shadow-sm" : "text-muted",
          )}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 w-full space-y-3">
        {mode === "create" && (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            disabled={busy}
          />
        )}
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={busy}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "create" ? "new-password" : "current-password"}
            disabled={busy}
            className="pl-10"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 font-sans text-[13px] text-red-700 dark:text-red-300">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-lg bg-forest/10 px-3 py-2 font-sans text-[13px] text-forest">
            {info}
          </p>
        )}

        <Button type="submit" disabled={busy} className="h-11 w-full rounded-full">
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <div className="my-6 flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="font-sans text-[11px] tracking-wide text-muted uppercase">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <div className="flex w-full flex-col gap-2">
        {PROVIDERS.map(({ provider, label, icon: Icon }) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void handleOAuth(provider)}
            className="h-11 w-full justify-center gap-2 rounded-full"
          >
            <Icon className="size-4" />
            Continue with {label}
          </Button>
        ))}
      </div>

      {!Capacitor.isNativePlatform() && (
        <div className="mt-10">
          <BibleReadingAnimation />
        </div>
      )}
    </div>
  );
}

function friendlyAuthError(err: { message?: string } | string): string {
  const msg = typeof err === "string" ? err : err.message ?? "";
  if (/invalid login/i.test(msg)) return "Email or password is incorrect.";
  if (/already registered|already exists/i.test(msg))
    return "That email is already registered. Try signing in.";
  if (/email not confirmed/i.test(msg))
    return "Confirm your email before signing in.";
  return msg || "Something went wrong. Please try again.";
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.3 14.6 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.6S6.9 20.8 12 20.8c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.21 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}
