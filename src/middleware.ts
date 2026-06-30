import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Middleware runs in the Edge Runtime by default. The build warning about
// process.version is harmless — it comes from @supabase/supabase-js internals
// but does not affect functionality. Supabase auth session refresh works fine.
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, favicon.svg
     * - public assets (images, etc.)
     * - sitemap.xml, robots.txt, manifest
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
