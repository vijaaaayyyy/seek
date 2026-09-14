import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { BookOpen, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BibleReadingAnimation } from "@/components/bible-reading-animation";
import { signIn, signInEmail, signUpEmail } from "@/lib/supa/client";
import { cn } from "@/lib/utils";

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
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

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
      await navigate({ to: redirect || "/", replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  async function handleProvider(provider: "google" | "github") {
    setError(null);
    try {
      await signIn(provider, { callbackURL: redirect });
      // OAuth navigates away to the provider — no further work here.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in could not start.");
    }
  }

  return (
    <div className="pt-3">
      <div className="glass flex items-center gap-3 rounded-[28px] p-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-paper dark:bg-paper dark:text-ink">
          <BookOpen className="size-6" strokeWidth={1.7} />
        </span>
        <div>
          <p className="font-sans text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
            King James Bible
          </p>
          <h1 className="mt-0.5 font-serif text-[1.6rem] leading-none font-medium tracking-tight text-ink">
            {mode === "create" ? "Create your account" : "Welcome back"}
          </h1>
        </div>
      </div>

      <div className="glass-segmented relative mt-5 grid h-12 grid-cols-2 rounded-full p-1">
        <div
          aria-hidden
          className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/2)] rounded-full bg-ink/10 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-paper/12"
          style={{ transform: mode === "create" ? "translateX(100%)" : "translateX(0)" }}
        />
        {(["signin", "create"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={cn(
              "relative z-10 rounded-full font-sans text-sm font-medium transition-colors",
              mode === m ? "text-ink" : "text-muted",
            )}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        {mode === "create" && (
          <div className="relative">
            <Mail className="pointer-events-none absolute top-3.5 left-4 size-5 text-faint" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="pl-12"
            />
          </div>
        )}
        <div className="relative">
          <Mail className="pointer-events-none absolute top-3.5 left-4 size-5 text-faint" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            className="pl-12"
          />
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute top-3.5 left-4 size-5 text-faint" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "create" ? "new-password" : "current-password"}
            className="pl-12"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-2xl bg-mark/60 px-4 py-3 font-sans text-sm text-ink">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-2xl bg-forest/10 px-4 py-3 font-sans text-sm text-forest">
            {info}
          </p>
        )}

        <Button type="submit" disabled={busy} className="w-full rounded-2xl">
          {busy
            ? "Please wait…"
            : mode === "create"
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="font-sans text-[11px] tracking-[0.14em] text-faint uppercase">
          Or continue with
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="space-y-2.5">
        {PROVIDERS.map((p) => (
          <button
            key={p.provider}
            type="button"
            onClick={() => void handleProvider(p.provider)}
            className="glass flex h-12 w-full items-center justify-center gap-2 rounded-2xl font-sans text-sm font-medium text-ink transition-transform duration-150 active:scale-[0.97] hover:bg-ink/5"
          >
            <p.icon />
            Continue with {p.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <BibleReadingAnimation />
      </div>

      <p className="mt-6 px-1 text-center font-sans text-[13px] leading-relaxed text-muted">
        {mode === "create" ? (
          <>
            Already have an account?{" "}
            <button type="button" onClick={() => switchMode("signin")} className="text-forest underline-offset-4 hover:underline">
              Sign in instead
            </button>
          </>
        ) : (
          <>
            New here?{" "}
            <button type="button" onClick={() => switchMode("create")} className="text-forest underline-offset-4 hover:underline">
              Create an account
            </button>{" "}
            to keep your saved verses on any device.
          </>
        )}
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.25.45-2.28 1.18-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.77-.01 3.15 0 .31.2.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function friendlyAuthError(message: string | undefined): string {
  if (!message) return "That didn't work. Please try again.";
  const text = message.toLowerCase();
  if (text.includes("already") || text.includes("exist")) {
    return "An account with that email already exists. Try signing in.";
  }
  if (text.includes("invalid email")) return "That email address doesn't look right.";
  if (text.includes("password") && text.includes("length")) {
    return "Password must be at least 8 characters long.";
  }
  if (text.includes("invalid login") || text.includes("credentials")) {
    return "That email and password don't match an account here.";
  }
  return message;
}