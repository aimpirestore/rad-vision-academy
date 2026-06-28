import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

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
