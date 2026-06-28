/**
 * RAD Vision Academy — Data Access Layer
 *
 * Server-side async functions that query Supabase for content.
 * Every function falls back to the hardcoded site.ts defaults
 * when the database is unreachable or empty, so the site
 * NEVER breaks during setup.
 *
 * Public pages should import from here, NOT from site.ts directly.
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  courses as _courses,
  products as _products,
  posts as _posts,
  mentorshipServices as _mentorshipServices,
  resources as _resources,
  testimonials as _testimonials,
  stats as _stats,
  faqs as _faqs,
  founders as _founders,
  values as _values,
  timeline as _timeline,
  mainNav as _mainNav,
  footerNav as _footerNav,
  site as _site,
  GUMROAD_STORE_URL,
  type Course,
  type Product,
  type Post,
} from "@/lib/site";

// ============================================================
// Helpers
// ============================================================

/** Whether Supabase is configured (env vars present). */
function hasSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Normalize a slug: lowercase, hyphens, no special chars. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ============================================================
// Courses
// ============================================================

export async function getCourses(): Promise<Course[]> {
  if (!hasSupabase()) return _courses;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) return _courses;
    return data.map((c: any) => ({
      slug: c.slug,
      title: c.title,
      instructor: c.instructor,
      duration: c.duration,
      level: c.level,
      category: c.category,
      blurb: c.blurb,
      description: c.description,
      highlights: c.highlights ?? [],
      price: c.price,
      gumroadUrl: c.gumroad_url,
    }));
  } catch {
    return _courses;
  }
}

export async function getCourse(
  slug: string,
): Promise<(Course & { gumroadUrl?: string }) | null> {
  if (!hasSupabase()) {
    return _courses.find((c) => c.slug === slug) ?? null;
  }
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (!data) return _courses.find((c) => c.slug === slug) ?? null;
    return {
      slug: data.slug,
      title: data.title,
      instructor: data.instructor,
      duration: data.duration,
      level: data.level,
      category: data.category,
      blurb: data.blurb,
      description: data.description,
      highlights: data.highlights ?? [],
      price: data.price,
      gumroadUrl: data.gumroad_url,
    };
  } catch {
    return _courses.find((c) => c.slug === slug) ?? null;
  }
}

export async function getAllCourseSlugs(): Promise<string[]> {
  if (!hasSupabase()) return _courses.map((c) => c.slug);
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("courses")
      .select("slug")
      .eq("status", "published");
    if (!data || data.length === 0) return _courses.map((c) => c.slug);
    return data.map((c: any) => c.slug);
  } catch {
    return _courses.map((c) => c.slug);
  }
}

// ============================================================
// Products
// ============================================================

export async function getProducts(): Promise<(Product & { gumroadUrl?: string })[]> {
  if (!hasSupabase()) return _products;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) return _products;
    return data.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      blurb: p.blurb,
      price: p.price,
      format: p.format,
      gumroadUrl: p.gumroad_url,
    }));
  } catch {
    return _products;
  }
}

// ============================================================
// Blog Posts
// ============================================================

export async function getPosts(): Promise<(Post & { featured?: boolean })[]> {
  if (!hasSupabase()) return _posts;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (!data || data.length === 0) return _posts;
    return data.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      author: p.author,
      date: p.published_at?.split("T")[0] ?? "",
      readingTime: p.reading_time,
      featured: p.featured,
      body: p.body,
    }));
  } catch {
    return _posts;
  }
}

export async function getPost(
  slug: string,
): Promise<(Post & { body?: string; featured?: boolean }) | null> {
  if (!hasSupabase()) {
    return _posts.find((p) => p.slug === slug) ?? null;
  }
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (!data) return _posts.find((p) => p.slug === slug) ?? null;
    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      author: data.author,
      date: data.published_at?.split("T")[0] ?? "",
      readingTime: data.reading_time,
      featured: data.featured,
      body: data.body,
    };
  } catch {
    return _posts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!hasSupabase()) return _posts.map((p) => p.slug);
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published");
    if (!data || data.length === 0) return _posts.map((p) => p.slug);
    return data.map((p: any) => p.slug);
  } catch {
    return _posts.map((p) => p.slug);
  }
}

// ============================================================
// Mentorship Services
// ============================================================

export async function getMentorshipServices() {
  if (!hasSupabase()) return _mentorshipServices;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("mentorship_services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) return _mentorshipServices;
    return data.map((m: any) => ({
      title: m.title,
      description: m.description,
      outcomes: m.benefits ?? [],
      icon: m.icon,
      gumroadUrl: m.gumroad_url,
    }));
  } catch {
    return _mentorshipServices;
  }
}

// ============================================================
// Resources
// ============================================================

export async function getResources() {
  if (!hasSupabase()) return _resources;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("resources")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) return _resources;
    return data.map((r: any) => ({
      title: r.title,
      type: r.type,
      description: r.description,
      free: r.free,
      fileUrl: r.file_url,
    }));
  } catch {
    return _resources;
  }
}

// ============================================================
// Testimonials
// ============================================================

export async function getTestimonials() {
  if (!hasSupabase()) return _testimonials;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) return _testimonials;
    return data.map((t: any) => ({
      quote: t.quote,
      name: t.name,
      role: t.role,
    }));
  } catch {
    return _testimonials;
  }
}

// ============================================================
// Stats (homepage)
// ============================================================

export async function getStats() {
  if (!hasSupabase()) return _stats;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("homepage_settings")
      .select("stats")
      .single();
    if (!data?.stats || (data.stats as any[]).length === 0) return _stats;
    return data.stats;
  } catch {
    return _stats;
  }
}

// ============================================================
// Homepage settings
// ============================================================

export async function getHomepageSettings() {
  const defaults = {
    heroHeading: "World-Class Radiology Education",
    heroSubheading:
      "Empowering Future Radiologists Through Expert Education, Mentorship, Digital Learning, and AI-Powered Learning Resources.",
    heroCtaPrimaryLabel: "Explore Courses",
    heroCtaPrimaryHref: "/courses",
    heroCtaSecondaryLabel: "Book Consultation",
    heroCtaSecondaryHref: "/contact",
    featuredCourseSlugs: [
      "foundations-of-radiology",
      "frcr-rapid-reporting",
      "ct-abdomen-pelvis-mastery",
    ],
  };
  if (!hasSupabase()) return defaults;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("homepage_settings")
      .select("*")
      .single();
    if (!data) return defaults;
    return {
      heroHeading: data.hero_heading ?? defaults.heroHeading,
      heroSubheading: data.hero_subheading ?? defaults.heroSubheading,
      heroCtaPrimaryLabel: data.hero_cta_primary_label ?? defaults.heroCtaPrimaryLabel,
      heroCtaPrimaryHref: data.hero_cta_primary_href ?? defaults.heroCtaPrimaryHref,
      heroCtaSecondaryLabel: data.hero_cta_secondary_label ?? defaults.heroCtaSecondaryLabel,
      heroCtaSecondaryHref: data.hero_cta_secondary_href ?? defaults.heroCtaSecondaryHref,
      featuredCourseSlugs: data.featured_course_slugs ?? defaults.featuredCourseSlugs,
    };
  } catch {
    return defaults;
  }
}

// ============================================================
// Navigation
// ============================================================

export async function getNav(location: "header" | "footer" | "quick" = "header"): Promise<
  | { label: string; href: string; external?: boolean }[]
  | Record<string, { label: string; href: string }[]>
> {
  if (!hasSupabase()) {
    if (location === "header") return [..._mainNav];
    // footer is grouped
    return JSON.parse(JSON.stringify(_footerNav));
  }
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("navigation_items")
      .select("*")
      .eq("location", location)
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) {
      if (location === "header") return [..._mainNav];
      return JSON.parse(JSON.stringify(_footerNav));
    }
    return data.map((n: any) => ({
      label: n.label,
      href: n.href,
      external: n.external,
    }));
  } catch {
    if (location === "header") return [..._mainNav];
    return JSON.parse(JSON.stringify(_footerNav));
  }
}

// ============================================================
// Social links
// ============================================================

export async function getSocialLinks() {
  const defaults = _site.social;
  if (!hasSupabase()) return defaults;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("social_links").select("*").single();
    if (!data) return defaults;
    return {
      twitter: data.twitter || defaults.twitter,
      linkedin: data.linkedin || defaults.linkedin,
      instagram: data.instagram || defaults.instagram,
      youtube: data.youtube || defaults.youtube,
      tiktok: data.tiktok || "",
      whatsapp: data.whatsapp || "",
      email: data.email || _site.email,
      phone: data.phone || _site.phone,
    };
  } catch {
    return defaults;
  }
}

// ============================================================
// Site settings
// ============================================================

export async function getSiteSettings() {
  const defaults = {
    brandName: _site.name,
    tagline: _site.tagline,
    logoUrl: undefined as string | undefined,
    faviconUrl: undefined as string | undefined,
    email: _site.email,
    phone: _site.phone,
    address: undefined as string | undefined,
    footerCopyright: undefined as string | undefined,
    newsletterText: undefined as string | undefined,
  };
  if (!hasSupabase()) return defaults;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("site_settings").select("*").single();
    if (!data) return defaults;
    return {
      brandName: data.brand_name ?? defaults.brandName,
      tagline: data.tagline ?? defaults.tagline,
      logoUrl: data.logo_url ?? undefined,
      faviconUrl: data.favicon_url ?? undefined,
      email: data.email ?? defaults.email,
      phone: data.phone ?? defaults.phone,
      address: data.address ?? undefined,
      footerCopyright: data.footer_copyright ?? undefined,
      newsletterText: data.newsletter_text ?? undefined,
    };
  } catch {
    return defaults;
  }
}

// ============================================================
// SEO settings
// ============================================================

export async function getSeoSettings() {
  const defaults = {
    globalTitle: "",
    globalDescription: _site.description,
    ogImageUrl: "",
    twitterCard: "summary_large_image" as const,
    canonicalBase: _site.url,
  };
  if (!hasSupabase()) return defaults;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("seo_settings").select("*").single();
    if (!data) return defaults;
    return {
      globalTitle: data.global_title,
      globalDescription: data.global_description ?? defaults.globalDescription,
      ogImageUrl: data.og_image_url,
      twitterCard: data.twitter_card || defaults.twitterCard,
      canonicalBase: data.canonical_base || defaults.canonicalBase,
    };
  } catch {
    return defaults;
  }
}

// ============================================================
// Analytics settings
// ============================================================

export async function getAnalyticsSettings() {
  const defaults = { gaId: "", searchConsoleId: "", clarityId: "", metaPixelId: "" };
  if (!hasSupabase()) return defaults;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("analytics_settings").select("*").single();
    if (!data) return defaults;
    return {
      gaId: data.ga_id,
      searchConsoleId: data.search_console_id,
      clarityId: data.clarity_id,
      metaPixelId: data.meta_pixel_id,
    };
  } catch {
    return defaults;
  }
}

// ============================================================
// Founders, Values, Timeline, FAQs
// ============================================================

export async function getFounders() {
  if (!hasSupabase()) return _founders;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("founders")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) return _founders;
    return data.map((f: any) => ({
      name: f.name,
      role: f.role,
      bio: f.bio,
      initials: f.initials,
      imageUrl: f.image_url,
    }));
  } catch {
    return _founders;
  }
}

export async function getValues() {
  if (!hasSupabase()) return _values;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("brand_values")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) return _values;
    return data.map((v: any) => ({
      title: v.title,
      text: v.text,
      icon: v.icon,
    }));
  } catch {
    return _values;
  }
}

export async function getTimeline() {
  if (!hasSupabase()) return _timeline;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("timeline")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) return _timeline;
    return data.map((t: any) => ({
      year: t.year,
      title: t.title,
      text: t.text,
    }));
  } catch {
    return _timeline;
  }
}

export async function getFaqs() {
  if (!hasSupabase()) return _faqs;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!data || data.length === 0) return _faqs;
    return data.map((f: any) => ({ q: f.question, a: f.answer }));
  } catch {
    return _faqs;
  }
}

// ============================================================
// Utility: resolve Gumroad URL for a record
// ============================================================

export function resolveGumroadUrl(recordUrl?: string): string {
  if (recordUrl && recordUrl.trim()) return recordUrl;
  return GUMROAD_STORE_URL;
}
