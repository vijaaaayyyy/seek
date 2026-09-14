import { createMiddleware } from "@tanstack/react-start";

/**
 * Auth middleware for server functions — the standard way to get the caller's
 * verified Supabase user id.
 *
 * The browser Supabase client keeps the session in `localStorage`, which the
 * server can't read, so the client side forwards the current access token
 * (`sendContext.accessToken`) and the server side verifies it with the Supabase
 * API before trusting `context.userId`.
 *
 *   import { createServerFn } from "@tanstack/react-start";
 *   import { getSql } from "@/lib/db";
 *   import { authMiddleware } from "@/lib/supa/middleware";
 *
 *   export const listTodos = createServerFn({ method: "GET" })
 *     .middleware([authMiddleware])
 *     .handler(async ({ context }) => {
 *       const sql = await getSql();
 *       return sql`select * from todos where user_id = ${context.userId}`;
 *     });
 */
export const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getAccessToken } = await import("./client");
    return next({ sendContext: { accessToken: (await getAccessToken()) ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { requireUserId } = await import("./require-user.server");
    const userId = await requireUserId(context.accessToken);
    return next({ context: { userId } });
  });