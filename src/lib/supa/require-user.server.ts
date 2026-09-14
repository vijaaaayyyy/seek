import { createClient } from "@supabase/supabase-js";

/**
 * Server-side utilities for verifying the forwarded Supabase access token.
 *
 * `requireUserId` is called by `authMiddleware` (middleware.ts). It
 * verifies the token against Supabase Auth and returns the caller's user id —
 * NEVER a client-sent id.
 */
export async function requireUserId(accessToken: string | undefined): Promise<string> {
  if (!accessToken) throw new Error("Sign in to continue.");

  const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY as string;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Auth is not configured.");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    throw new Error("Your session has expired. Sign in again.");
  }
  return data.user.id;
}