import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  LogOut,
  Moon,
  Palette,
  Sun,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { authEnabled, signOut } from "@/lib/supa/client";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

type Row = {
  label: string;
  to?: string;
  icon: typeof UserRound;
  value?: string;
  onClick?: () => void;
};

function Section({ title, rows }: { title: string; rows: Row[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="mt-5">
      <p className="mb-2 px-1 font-sans text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
        {title}
      </p>
      <div className="overflow-hidden rounded-[22px] bg-white/70 ring-1 ring-black/5 backdrop-blur-xl dark:bg-white/8 dark:ring-white/10">
        {rows.map((row, i) => {
          const Icon = row.icon;
          const inner = (
            <>
              <span className="flex size-9 items-center justify-center rounded-full bg-ink/6 text-ink dark:bg-white/10">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1 text-left font-sans text-[15px] text-ink">
                {row.label}
              </span>
              {row.value && (
                <span className="font-sans text-[13px] text-muted">{row.value}</span>
              )}
              <ChevronRight className="size-4 shrink-0 text-faint" strokeWidth={1.8} />
            </>
          );
          const className = cn(
            "flex w-full items-center gap-3 px-3.5 py-3.5 transition-colors",
            i > 0 && "border-t border-line/80",
            "active:bg-ink/4",
          );
          if (row.to) {
            return (
              <Link key={row.label} to={row.to} className={className}>
                {inner}
              </Link>
            );
          }
          return (
            <button
              key={row.label}
              type="button"
              onClick={row.onClick}
              className={className}
            >
              {inner}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const name = user?.displayName ?? "Guest";
  const email = user?.primaryEmail ?? "Sign in to sync your saves";
  const initial = name.charAt(0).toUpperCase();

  const themeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Palette;
  const themeLabel =
    theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

  return (
    <div className="mx-auto w-full max-w-md pb-4">
      <h1 className="text-center font-serif text-[1.35rem] font-medium tracking-tight text-ink">
        Profile
      </h1>

      <div className="mt-5 flex items-center gap-3.5 rounded-[22px] bg-white/70 px-4 py-4 ring-1 ring-black/5 backdrop-blur-xl dark:bg-white/8 dark:ring-white/10">
        {isPending ? (
          <div className="size-14 animate-pulse rounded-full bg-ink/10" />
        ) : user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            className="size-14 rounded-full object-cover ring-2 ring-white/60"
          />
        ) : (
          <span className="grid size-14 place-items-center rounded-full bg-forest/15 font-serif text-xl font-medium text-forest">
            {initial}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[16px] font-semibold text-ink">{name}</p>
          <p className="mt-0.5 truncate font-sans text-[13px] text-muted">{email}</p>
        </div>
      </div>

      {!user && !isPending && (
        <Link
          to="/login"
          search={{ redirect: "/profile" }}
          className="mt-3 flex items-center justify-center rounded-full bg-ink px-4 py-3.5 font-sans text-[14px] font-medium text-paper transition-transform active:scale-[0.98]"
        >
          Sign in
        </Link>
      )}

      <Section
        title="Library"
        rows={[
          { label: "Saved verses", icon: BookOpen, to: "/saved" },
          { label: "Browse Bible", icon: BookOpen, to: "/books" },
        ]}
      />

      <Section
        title="Preferences"
        rows={[
          {
            label: "Theme",
            icon: themeIcon,
            value: themeLabel,
            onClick: toggle,
          },
        ]}
      />

      <Section
        title="Account"
        rows={[
          ...(user
            ? []
            : [
                {
                  label: "Sign in",
                  icon: UserRound,
                  onClick: () =>
                    void navigate({ to: "/login", search: { redirect: "/profile" } }),
                } satisfies Row,
              ]),
          ...(authEnabled && user
            ? [
                {
                  label: signingOut ? "Signing out…" : "Sign out",
                  icon: LogOut,
                  onClick: () => {
                    if (signingOut) return;
                    setSigningOut(true);
                    void signOut().catch(() => setSigningOut(false));
                  },
                } satisfies Row,
              ]
            : []),
        ]}
      />
    </div>
  );
}
