"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/site";
import { formatDate, cn } from "@/lib/utils";

type PostItem = Post & { featured?: boolean };

export function BlogExplorer({ posts }: { posts: PostItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const filtered = posts.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q);
    const matchesCat = category === "All" || p.category === category;
    return matchesQuery && matchesCat;
  });

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p.slug !== featured?.slug);

  return (
    <section className="py-20 sm:py-24">
      <div className="container-default">
        {/* Search + filter */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dark-grey/50" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              aria-label="Search articles"
              className="w-full rounded-full border border-brand-black/10 bg-white py-3 pl-11 pr-4 text-sm text-brand-black placeholder:text-brand-dark-grey/50 focus:border-brand-red focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-xs font-semibold transition-all",
                  category === c
                    ? "bg-brand-red text-white shadow-glow"
                    : "border border-brand-black/10 bg-white text-brand-dark-grey hover:border-brand-red/30",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <motion.div layout className="mt-12">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className="surface-elevated relative grid overflow-hidden lg:grid-cols-2">
                <div className="relative h-56 overflow-hidden border-b border-brand-black/[0.06] bg-gradient-to-br from-brand-black to-brand-dark-grey p-8 lg:h-auto lg:border-b-0 lg:border-r">
                  <div className="absolute inset-0 bg-blueprint-fine opacity-[0.12]" />
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-red/30 blur-[80px]" />
                  <div className="relative flex h-full flex-col justify-between text-white">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] backdrop-blur">
                      Featured
                    </span>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                        {featured.category}
                      </span>
                      <p className="mt-2 text-2xl font-bold leading-tight">{featured.title}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
                  <p className="text-base leading-relaxed text-brand-dark-grey">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-brand-dark-grey/70">
                    <span className="font-semibold text-brand-black">{featured.author}</span>
                    <span>{formatDate(featured.date)}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readingTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red transition-colors group-hover:text-brand-red-deep">
                    Read article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {rest.map((post) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="surface-elevated flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1">
                    <div className="relative h-32 overflow-hidden border-b border-brand-black/[0.06] bg-gradient-to-br from-brand-light-grey to-white">
                      <div className="absolute inset-0 bg-blueprint opacity-60" />
                      <div className="absolute inset-0 bg-scan-rings" />
                      <span className="absolute left-5 top-5 rounded-full border border-brand-black/[0.06] bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-dark-grey backdrop-blur">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold leading-snug tracking-tight text-brand-black group-hover:text-brand-red">
                        {post.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-dark-grey">{post.excerpt}</p>
                      <div className="mt-5 flex items-center justify-between border-t border-brand-black/[0.06] pt-4 text-xs text-brand-dark-grey/70">
                        <span className="font-semibold text-brand-black">{post.author}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-semibold text-brand-black">No articles found.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
