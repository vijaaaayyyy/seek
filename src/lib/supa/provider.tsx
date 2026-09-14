import type { ReactNode } from "react";

/**
 * App-wide Supabase provider mounted once near the root (in `src/routes/__root.tsx`):
 *
 *   <AuthProvider><Outlet /></AuthProvider>
 *
 * The browser Supabase client reads the session from localStorage and fires
 * auth-change events that `useCurrentUserState` subscribes to, so sign-in and
 * sign-out propagate to every consumer automatically. No context is needed —
 * this is the single, stable mount point if one ever is.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}