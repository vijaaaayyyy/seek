import { Link } from "@tanstack/react-router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bookmark, ChevronDown, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authEnabled, signOut } from "@/lib/supa/client";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import { SwapText } from "@/components/swap-text";
import { cn } from "@/lib/utils";

/**
 * Header auth slot: skeleton while session resolves, "Sign in" when signed out,
 * avatar menu with account details when signed in.
 */
export function UserMenu() {
  const { user, isPending } = useCurrentUserState();
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) {
    return (
      <div className="size-10 shrink-0 animate-pulse rounded-full bg-wash" />
    );
  }

  if (!user) {
    return (
      <Button
        asChild
        variant="outline"
        size="sm"
        className="group shrink-0 rounded-full border-line bg-surface px-3.5 text-ink"
      >
        <Link to="/login" search={{ redirect: "/" }}>
          <SwapText>Sign in</SwapText>
        </Link>
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
          className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-8 place-items-center rounded-full bg-forest/20 text-sm font-semibold text-forest">
              {initial}
            </span>
          )}
          <span className="pointer-events-none absolute -right-0.5 -bottom-0.5 grid size-4 place-items-center rounded-full border border-line bg-surface">
            <ChevronDown className="size-3 text-ink" strokeWidth={2.2} />
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-50 w-64 rounded-2xl border border-line bg-surface p-2 text-ink shadow-[0_16px_48px_rgba(0,0,0,0.22)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
        >
          <div className="px-3 pt-2 pb-2">
            <p className="truncate font-sans text-sm font-semibold text-ink">
              {label}
            </p>
            {user.primaryEmail && (
              <p className="mt-0.5 truncate font-sans text-xs text-muted">
                {user.primaryEmail}
              </p>
            )}
          </div>
          <DropdownMenu.Separator className="mx-2 my-1 h-px bg-line" />
          <DropdownMenu.Item asChild>
            <Link
              to="/profile"
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 font-sans text-sm text-ink",
                "outline-none hover:bg-wash focus-visible:bg-wash",
              )}
            >
              <UserRound className="size-4 text-muted" />
              Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to="/saved"
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 font-sans text-sm text-ink",
                "outline-none hover:bg-wash focus-visible:bg-wash",
              )}
            >
              <Bookmark className="size-4 text-muted" />
              Saved verses
            </Link>
          </DropdownMenu.Item>
          {authEnabled && (
            <DropdownMenu.Item
              disabled={signingOut}
              onSelect={(event) => {
                event.preventDefault();
                setSigningOut(true);
                void signOut().catch(() => setSigningOut(false));
              }}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 font-sans text-sm text-red-600 dark:text-red-300",
                "outline-none hover:bg-wash focus-visible:bg-wash",
              )}
            >
              <LogOut className="size-4" />
              {signingOut ? "Signing out…" : "Sign out"}
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
