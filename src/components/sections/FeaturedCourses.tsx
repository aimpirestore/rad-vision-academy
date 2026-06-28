"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Primitives";
import { SectionHeading } from "@/components/ui/Badge";
import { CourseCard } from "@/components/cards/CourseCard";
import type { Course } from "@/lib/site";

export function FeaturedCourses({ courses }: { courses: (Course & { gumroadUrl?: string })[] }) {
  const featured = courses.slice(0, 3);
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-default">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Flagship Courses"
              title={<>Learn from courses that get results</>}
              description="Each course is designed, taught, and continuously updated by practising radiologists."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/courses"
              className="group inline-flex items-center gap-1.5 rounded-full border border-brand-black/10 px-5 py-2.5 text-sm font-semibold text-brand-black transition-all hover:border-brand-red hover:text-brand-red"
            >
              View all courses
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((course, i) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
