"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CourseCard } from "@/components/cards/CourseCard";
import type { Course } from "@/lib/site";
import { cn } from "@/lib/utils";

const categories = ["All", "Core", "Exam Prep", "Subspecialty", "Future"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export function CourseExplorer({ courses }: { courses: (Course & { gumroadUrl?: string })[] }) {
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All Levels");

  const filtered = courses.filter((c) => {
    const catOk = category === "All" || c.category === category;
    const lvlOk = level === "All Levels" || c.level === level;
    return catOk && lvlOk;
  });

  return (
    <section className="py-20 sm:py-24">
      <div className="container-default">
        {/* Filters */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-dark-grey/60">Category</span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  category === c
                    ? "bg-brand-black text-white shadow-soft"
                    : "border border-brand-black/10 bg-white text-brand-dark-grey hover:border-brand-black/20",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-dark-grey/60">Level</span>
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  level === l
                    ? "bg-brand-red text-white shadow-glow"
                    : "border border-brand-black/10 bg-white text-brand-dark-grey hover:border-brand-red/30",
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-brand-dark-grey">
          Showing <span className="font-bold text-brand-black">{filtered.length}</span> of {courses.length} courses
        </p>

        {/* Grid */}
        <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((course) => (
              <motion.div
                key={course.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-semibold text-brand-black">No courses match those filters.</p>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setLevel("All Levels");
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
