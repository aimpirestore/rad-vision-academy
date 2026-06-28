import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** The official RAD Vision Academy Gumroad storefront. */
export const GUMROAD_STORE_URL = "https://radvisionacademy.gumroad.com/";

/** Build a Gumroad product URL (falls back to the main storefront). */
export function gumroadUrl(productId?: string) {
  if (!productId) return GUMROAD_STORE_URL;
  return `https://radvisionacademy.gumroad.com/l/${productId}`;
}

/**
 * Resolve a Gumroad buy URL for a record.
 * If the record has its own `gumroad_url` (set in the admin), use it.
 * Otherwise fall back to the storefront. Client-safe (no Supabase import).
 */
export function resolveGumroadUrl(recordUrl?: string | null): string {
  if (recordUrl && recordUrl.trim()) return recordUrl;
  return GUMROAD_STORE_URL;
}

/** Format an ISO date string into a human-readable date. */
export function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
