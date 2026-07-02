/**
 * Centralized Supabase environment variable access — PUBLIC values only.
 *
 * This module is imported by BOTH client and server code. It must NEVER export
 * the service role key, because that would create an accidental surface area
 * for a key leak into the browser bundle.
 *
 * The service role key is read directly inside `server.ts` instead.
 *
 * ── Why hardcoded fallbacks? ─────────────────────────────────────────
 * Next.js inlines `process.env.NEXT_PUBLIC_*` at BUILD time. On hosting
 * platforms (Hostinger / Netlify) where env vars aren't always present at
 * build, the app ships with empty strings → "Invalid API key" at runtime.
 *
 * The anon key is DESIGNED to be public — it only grants access that Row
 * Level Security explicitly allows. Bundling it as a fallback is the standard
 * Supabase deployment pattern and is safe.
 */

const FALLBACK_URL = "https://yjjbiofujzrfpfmyrddy.supabase.co";
const FALLBACK_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqamJpb2Z1anpyZnBmbXlyZWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwOTg5OTAsImV4cCI6MjA5NzY3NDk5MH0.I_r7oFPAi1pesvmnxw6_bm8sG0hw4Ni9n4F0NOYkuvc";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON;

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.info(
    "[supabase] Using bundled fallback public credentials. " +
      "Set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY to override.",
  );
}

/** Public Supabase project URL (safe to expose). */
export const SUPABASE_URL = supabaseUrl;

/** Public anon key (safe to expose; protected by Row Level Security). */
export const SUPABASE_ANON_KEY = supabaseAnonKey;
