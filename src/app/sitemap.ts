import type { MetadataRoute } from "next";
import { site, courses, posts } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/courses",
    "/mentorship",
    "/resources",
    "/blog",
    "/store",
    "/contact",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const courseRoutes = courses.map((c) => ({
    url: `${site.url}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...postRoutes];
}
