import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/** Browser-side Supabase client (session stored in localStorage). */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/** True when sign-in UI should be shown. */
export const authEnabled = true;

export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: boolean;
};

/** Stable fallback used ONLY when auth is disabled. */
export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

/** Start an OAuth sign-in (Google / GitHub). Leads to `/auth/callback`. */
export async function signIn(
  provider: "google" | "github",
  opts: { callbackURL?: string } = {},
): Promise<void> {
  const callbackURL = opts.callbackURL ?? "/";
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo:
        window.location.origin + "/auth/callback?next=" + encodeURIComponent(callbackURL),
    },
  });
  if (error) throw error;
}

/** Email + password sign-in. */
export async function signInEmail(
  email: string,
  password: string,
): Promise<{ error?: string }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message };
}

/** Create an email + password account (verification email auto-sent). */
export async function signUpEmail(
  email: string,
  password: string,
  name: string,
): Promise<{ error?: string }> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  return { error: error?.message };
}

/** Sign out and go home. */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = "/";
}

/** The current access token — forwarded to server functions. */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}