/**
 * Centralized Supabase environment variable access — PUBLIC values only.
 *
 * This module is imported by BOTH client and server code. It must NEVER export
 * the service role key, because that would create an accidental surface area
 * for a key leak into the browser bundle.
 *
 * The service role key is read directly inside `server.ts` instead.
 *
 * Next.js inlines `process.env.NEXT_PUBLIC_*` at BUILD time, so the values
 * must be present in the build environment (local `.env.local`, or the
 * Netlify/Hostinger dashboard for production builds).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [
    !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
    !supabaseAnonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]
    .filter(Boolean)
    .join(", ");

  // eslint-disable-next-line no-console
  console.error(
    `[supabase] Missing environment variable(s): ${missing}\n` +
      `These are required to connect to Supabase.\n` +
      `- Local dev:   add them to .env.local (see .env.example)\n` +
      `- Production:  set them in Netlify/Hostinger environment variables, then redeploy.\n` +
      `Find the values at: https://supabase.com/dashboard/project/_/settings/api`,
  );
}

/** Public Supabase project URL (safe to expose). */
export const SUPABASE_URL = supabaseUrl;

/** Public anon key (safe to expose; protected by Row Level Security). */
export const SUPABASE_ANON_KEY = supabaseAnonKey;
