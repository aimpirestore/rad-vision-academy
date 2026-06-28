import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

/**
 * Service role key — read directly here so it can NEVER be imported into
 * client code via the shared `env.ts` module. This is the ONLY place in the
 * codebase that touches the service role key.
 */
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Server-side Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Reads/writes cookies for session management.
 *
 * IMPORTANT: This client still uses the Anon key. For admin operations
 * that need to bypass RLS, use `createAdminClient()` instead.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // setAll called from a Server Component — cookie manipulation
          // is not allowed in that context. The middleware will handle it.
        }
      },
    },
  });
}

/**
 * Admin-level Supabase client that uses the Service Role key.
 * This BYPASSES Row Level Security — use ONLY in trusted server-side code
 * (Server Actions, Route Handlers, seed scripts).
 *
 * NEVER import this in a "use client" component or expose to the browser.
 */
export function createAdminClient() {
  if (!SERVICE_ROLE_KEY) {
    throw new Error(
      "[supabase] SUPABASE_SERVICE_ROLE_KEY is missing. " +
        "Set it in .env.local (dev) or in your hosting platform's environment variables (prod).",
    );
  }

  return createServerClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // Admin client has no session cookies — uses service role directly
      },
    },
  });
}
