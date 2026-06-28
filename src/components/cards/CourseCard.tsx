"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BarChart3, ArrowUpRight, ShoppingCart } from "lucide-react";
import type { Course } from "@/lib/site";
import { Badge } from "@/components/ui/Badge";
import { resolveGumroadUrl } from "@/lib/utils";

const levelStyles = {
  Beginner: "default",
  Intermediate: "soft",
  Advanced: "red",
  "All Levels": "outline",
} as const satisfies Record<Course["level"], "default" | "red" | "outline" | "soft">;

export function CourseCard({ course }: { course: Course & { gumroadUrl?: string } }) {
  const buyHref = resolveGumroadUrl(course.gumroadUrl);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group surface-elevated relative flex flex-col overflow-hidden"
    >
      {/* Visual top panel */}
      <div className="relative h-44 overflow-hidden border-b border-brand-black/[0.06] bg-gradient-to-br from-brand-light-grey to-white">
        <div className="absolute inset-0 bg-blueprint opacity-60" />
        <div className="absolute inset-0 bg-scan-rings" />
        {/* Floating mock scan window */}
        <div className="absolute left-6 top-6 h-24 w-32 rounded-xl border border-brand-black/10 bg-white/80 shadow-soft backdrop-blur">
          <div className="flex h-5 items-center gap-1 border-b border-brand-black/5 px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-black/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-black/15" />
          </div>
          <div className="relative h-[calc(100%-1.25rem)] p-2">
            <div className="h-full w-full rounded-md bg-gradient-to-br from-brand-black/[0.04] to-brand-red/[0.06]" />
            <div className="absolute left-1/2 top-2 h-px w-8/12 -translate-x-1/2 bg-brand-red/40" />
            <motion.div
              className="absolute left-2 right-2 h-px bg-brand-red/70"
              animate={{ top: ["8%", "88%", "8%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
        <Badge variant={levelStyles[course.level]} className="absolute right-4 top-4">
          {course.level}
        </Badge>
        <span className="absolute bottom-4 left-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark-grey/60">
          {course.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold tracking-tight text-brand-black">{course.title}</h3>
        <p className="mt-1 text-sm font-medium text-brand-red">{course.instructor}</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-dark-grey">{course.blurb}</p>

        <div className="mt-5 flex items-center gap-4 text-xs font-medium text-brand-dark-grey/80">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {course.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" /> {course.level}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-brand-black/[0.06] pt-5">
          <span className="text-lg font-bold text-brand-black">{course.price}</span>
          <div className="flex items-center gap-2">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-black/70 transition-colors hover:text-brand-red"
            >
              Details <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href={buyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-2 text-xs font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5"
            >
              <ShoppingCart className="h-3.5 w-3.5" /> Buy Now
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
