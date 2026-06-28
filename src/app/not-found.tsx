"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass, ArrowRight } from "lucide-react";

const links = [
  { label: "Courses", href: "/courses" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "Resources", href: "/resources" },
  { label: "Store", href: "/store" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-white pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-blueprint opacity-50 mask-fade-b" />
      </div>

      <div className="container-narrow relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mb-8 h-40 w-40"
        >
          <div className="absolute inset-0 animate-pulse-ring rounded-full border border-brand-red/30" />
          <div
            className="absolute inset-0 animate-pulse-ring rounded-full border border-brand-red/30"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute inset-0 m-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-brand-red/40">
            <span className="text-display-lg text-gradient-red">404</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-display-lg text-gradient-ink"
        >
          This page is out of frame
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mx-auto mt-5 max-w-md text-base text-brand-dark-grey"
        >
          We couldn&rsquo;t find what you were looking for. The link may be broken, or the page may have moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" /> Back to home
          </Link>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 rounded-full border border-brand-black/10 px-6 py-3.5 text-sm font-semibold text-brand-black transition-all hover:border-brand-black/20"
          >
            <Compass className="h-4 w-4" /> Explore courses
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-brand-dark-grey/70"
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="font-medium transition-colors hover:text-brand-red">
                {l.label}
              </Link>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
