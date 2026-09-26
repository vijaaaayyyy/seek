import { useEffect, useState } from "react";
import { supabase, authEnabled, DEV_USER, type AppUser } from "./client";

export type { AppUser };

export type CurrentUserState = {
  user: AppUser | null;
  isPending: boolean;
};

/** Raw shape of a Supabase auth session user we map into `AppUser`. */
type SessionUser = {
  id: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
  email?: string | null;
};

/**
 * Current user + loading state.
 *   - Auth enabled -> the real signed-in Supabase user; `user` is `null` while
 *                            the session resolves (`isPending: true`) and when
 *                            signed out (`isPending: false`). Listens to auth
 *                            changes so sign-in/out propagate to every consumer.
 *   - Auth disabled -> `DEV_USER`, never pending.
 */
export function useCurrentUserState(): CurrentUserState {
  // Hooks must run in the same order on every render, so the `authEnabled`
  // check cannot short-circuit above them — it decides the *initial* state and
  // gates the subscription, and only then do we pick which state to return.
  const [state, setState] = useState<CurrentUserState>(() =>
    authEnabled ? { user: null, isPending: true } : { user: DEV_USER, isPending: false },
  );

  useEffect(() => {
    if (!authEnabled) return;

    let active = true;
    const match = (session: { user?: SessionUser } | null): CurrentUserState => ({
      user: session?.user ? appUserFrom(session.user) : null,
      isPending: false,
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (active) setState(match(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setState(match(session));
    });

    return () => {
      active = false;
      void listener.subscription.unsubscribe();
    };
  }, []);

  if (!authEnabled) return { user: DEV_USER, isPending: false };
  return state;
}

/** Convenience view of `useCurrentUserState().user` for display. */
export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}

function appUserFrom(u: SessionUser): AppUser {
  const meta = u.user_metadata ?? {};
  return {
    id: u.id,
    displayName: meta.name ?? u.email ?? null,
    primaryEmail: u.email ?? null,
    profileImageUrl: meta.avatar_url ?? null,
    isDevFallback: false,
  };
}