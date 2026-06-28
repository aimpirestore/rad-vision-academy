import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

/**
 * Supabase middleware client. Refreshes the auth session on every request
 * and ensures the session cookie is passed through correctly.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If env vars are missing, skip session refresh rather than crashing every
  // request. The admin routes will simply redirect unauthenticated users to
  // login; public pages fall back to static content via the data layer.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Refresh the session so it stays active
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /admin routes — redirect to login if not authenticated
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow the login page and auth callback
    if (
      request.nextUrl.pathname === "/admin/login" ||
      request.nextUrl.pathname === "/admin/auth/callback"
    ) {
      return supabaseResponse;
    }

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
