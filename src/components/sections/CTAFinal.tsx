"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { GUMROAD_STORE_URL } from "@/lib/utils";

export function CTAFinal() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-default">
        <Reveal>
          <div className="relative overflow-hidden rounded-5xl bg-brand-black px-6 py-16 text-center sm:px-12 sm:py-24">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-blueprint-fine opacity-[0.08]" />
              <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-red/30 blur-[120px]" />
              <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-brand-red/20 blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-red" />
                Start learning today
              </motion.span>

              <h2 className="mt-6 text-display-lg text-white">
                Your future in radiology <br className="hidden sm:block" />
                starts here.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base text-white/60 sm:text-lg">
                Join 12,000+ learners using RAD Vision Academy to read films faster, ace their exams, and land their dream roles.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="/courses" variant="primary">
                  Explore Courses
                </ButtonLink>
                <a
                  href={GUMROAD_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/5 hover:-translate-y-0.5"
                >
                  Visit the Store
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
