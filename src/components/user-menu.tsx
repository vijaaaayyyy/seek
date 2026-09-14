import { Link } from "@tanstack/react-router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authEnabled, signOut } from "@/lib/supa/client";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import { cn } from "@/lib/utils";

/**
 * Header auth slot: nothing (skeleton) while the session resolves, a "Sign in"
 * pill when signed out, and an avatar menu with sign-out when signed in.
 */
export function UserMenu() {
  const { user, isPending } = useCurrentUserState();
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) {
    return <div className="size-11 shrink-0 animate-pulse rounded-full bg-ink/8" />;
  }

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full px-3.5">
        <Link to="/login" search={{ redirect: "/" }}>Sign in</Link>
      </Button>
    );
  }

  const label = user.displayName ?? user.primaryEmail ?? "Account";
  const initial = label.charAt(0).toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Your account"
          className="glass relative inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="size-9 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-9 place-items-center rounded-full bg-ink/10 text-sm font-semibold text-ink dark:bg-paper/15">
              {initial}
            </span>
          )}
          <span className="pointer-events-none absolute -right-0.5 -bottom-0.5 grid size-4 place-items-center rounded-full bg-ink/10">
            <ChevronDown className="size-3 text-ink" strokeWidth={2.2} />
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-50 w-56 rounded-3xl border border-line bg-paper p-2 text-ink shadow-[0_16px_48px_rgba(0,0,0,0.18)] dark:bg-ink dark:text-paper dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        >
          <div className="px-3 pt-2 pb-2">
            <p className="truncate font-sans text-sm font-semibold text-ink">{label}</p>
            {user.primaryEmail && (
              <p className="mt-0.5 truncate font-sans text-xs text-muted">{user.primaryEmail}</p>
            )}
          </div>
          <DropdownMenu.Separator className="mx-2 my-1 h-px bg-line" />
          <DropdownMenu.Item asChild>
            <Link
              to="/saved"
              className={cn(
                "flex items-center gap-2 rounded-2xl px-3 py-2.5 font-sans text-sm text-ink",
                "outline-none focus-visible:bg-ink/8",
              )}
            >
              <span>Saved verses</span>
            </Link>
          </DropdownMenu.Item>
          {authEnabled && (
            <DropdownMenu.Item
              disabled={signingOut}
              onSelect={(event) => {
                event.preventDefault();
                setSigningOut(true);
                // Success navigates away; on failure re-enable so it can be retried.
                void signOut().catch(() => setSigningOut(false));
              }}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-3 py-2.5 font-sans text-sm text-ink",
                "outline-none focus-visible:bg-ink/8",
              )}
            >
              <LogOut className="size-4 text-muted" />
              {signingOut ? "Signing out…" : "Sign out"}
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}