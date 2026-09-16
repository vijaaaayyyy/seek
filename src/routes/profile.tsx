import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Bookmark,
  ChevronRight,
  LogOut,
  Mail,
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
  danger?: boolean;
};

function Section({ title, rows }: { title: string; rows: Row[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="mt-5">
      <p className="mb-2 px-1 font-sans text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {title}
      </p>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        {rows.map((row, i) => {
          const Icon = row.icon;
          const inner = (
            <>
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full",
                  row.danger
                    ? "bg-red-500/15 text-red-600 dark:text-red-300"
                    : "bg-wash text-ink",
                )}
              >
                <Icon className="size-4" strokeWidth={1.9} />
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 text-left font-sans text-[15px] font-medium",
                  row.danger ? "text-red-600 dark:text-red-300" : "text-ink",
                )}
              >
                {row.label}
              </span>
              {row.value && (
                <span className="max-w-[45%] truncate font-sans text-[13px] text-muted">
                  {row.value}
                </span>
              )}
              {(row.to || row.onClick) && (
                <ChevronRight
                  className="size-4 shrink-0 text-faint"
                  strokeWidth={1.8}
                />
              )}
            </>
          );
          const className = cn(
            "flex w-full items-center gap-3 px-3.5 py-3.5 transition-colors",
            i > 0 && "border-t border-line",
            "hover:bg-wash active:bg-wash",
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
  const email = user?.primaryEmail ?? null;
  const initial = name.charAt(0).toUpperCase();

  const themeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Palette;
  const themeLabel =
    theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

  return (
    <div className="mx-auto w-full max-w-md pb-6">
      <h1 className="text-center font-serif text-[1.4rem] font-medium tracking-tight text-ink">
        Profile
      </h1>

      <div className="mt-5 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          {isPending ? (
            <div className="size-14 animate-pulse rounded-full bg-wash" />
          ) : user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="size-14 rounded-full object-cover ring-2 ring-line"
            />
          ) : (
            <span className="grid size-14 place-items-center rounded-full bg-forest/20 font-serif text-xl font-medium text-forest">
              {initial}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-[17px] font-semibold text-ink">
              {isPending ? "Loading…" : name}
            </p>
            {email ? (
              <p className="mt-0.5 flex items-center gap-1.5 truncate font-sans text-[13px] text-muted">
                <Mail className="size-3.5 shrink-0" strokeWidth={1.8} />
                {email}
              </p>
            ) : (
              <p className="mt-0.5 font-sans text-[13px] text-muted">
                Sign in to sync your saves
              </p>
            )}
          </div>
        </div>

        {user && (
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-3">
            <div className="rounded-xl bg-wash px-3 py-2.5">
              <p className="font-sans text-[10px] font-semibold tracking-wide text-muted uppercase">
                Status
              </p>
              <p className="mt-0.5 font-sans text-[13px] font-medium text-ink">
                Signed in
              </p>
            </div>
            <div className="rounded-xl bg-wash px-3 py-2.5">
              <p className="font-sans text-[10px] font-semibold tracking-wide text-muted uppercase">
                Saves
              </p>
              <p className="mt-0.5 font-sans text-[13px] font-medium text-ink">
                On this device
              </p>
            </div>
          </div>
        )}
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
          { label: "Saved verses", icon: Bookmark, to: "/saved" },
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
                    void navigate({
                      to: "/login",
                      search: { redirect: "/profile" },
                    }),
                } satisfies Row,
              ]),
          ...(authEnabled && user
            ? [
                {
                  label: signingOut ? "Signing out…" : "Sign out",
                  icon: LogOut,
                  danger: true,
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
