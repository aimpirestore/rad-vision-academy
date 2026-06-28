"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { HeroSceneLoader } from "@/components/three/HeroSceneLoader";
import { ButtonLink } from "@/components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-white pt-28 sm:pt-32 lg:pt-36">
      {/* Background layers — very subtle */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-blueprint opacity-[0.55] mask-fade-b" />
        <div className="absolute -top-32 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brand-red/[0.06] blur-[120px]" />
      </div>

      <div className="container-wide relative grid items-center gap-10 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28">
        {/* Left — copy */}
        <div className="relative z-10 max-w-xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-red/15 bg-brand-red/[0.06] px-3.5 py-1.5 text-xs font-semibold text-brand-red"
          >
            <Sparkles className="h-3.5 w-3.5" />
            International Medical Education
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
            className="mt-6 text-display-xl text-gradient-ink"
          >
            World-Class Radiology Education
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-brand-dark-grey"
          >
            Empowering future radiologists through expert education, mentorship,
            digital learning, and AI-powered learning resources.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <ButtonLink href="/courses" variant="primary">
              Explore Courses
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" withArrow={false}>
              <Calendar className="h-4 w-4" />
              Book Consultation
            </ButtonLink>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-medium text-brand-dark-grey/70"
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
              12,000+ learners worldwide
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
              Trusted in 75+ countries
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
              FRCR & residency ready
            </span>
          </motion.div>
        </div>

        {/* Right — 3D scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="relative aspect-square w-full max-w-[560px] justify-self-center lg:max-h-[620px]"
        >
          <div className="absolute inset-0">
            <HeroSceneLoader />
          </div>
          {/* Floating labels overlay */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="pointer-events-none absolute left-2 top-10 rounded-2xl border border-brand-black/[0.06] bg-white/80 px-3.5 py-2 shadow-soft backdrop-blur"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-dark-grey/60">MRI Series</p>
            <p className="text-sm font-bold text-brand-black">T2 FLAIR</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="pointer-events-none absolute bottom-12 right-2 rounded-2xl border border-brand-black/[0.06] bg-white/80 px-3.5 py-2 shadow-soft backdrop-blur"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-dark-grey/60">AI Triage</p>
            <p className="flex items-center gap-1.5 text-sm font-bold text-brand-black">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-red" />
              Priority: High
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="flex justify-center pb-8"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-brand-black/15 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-brand-red"
          />
        </div>
      </motion.div>
    </section>
  );
}
