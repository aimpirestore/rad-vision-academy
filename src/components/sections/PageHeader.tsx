"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function PageHeader({ eyebrow, title, description, crumbs, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-brand-white pt-32 sm:pt-36 lg:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-blueprint opacity-50 mask-fade-b" />
        <div className="absolute -top-24 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-brand-red/[0.05] blur-[120px]" />
      </div>

      <div className="container-default relative pb-16">
        {crumbs && (
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-label="Breadcrumb"
            className="mb-8"
          >
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-brand-dark-grey/70">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-brand-red">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-brand-black">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3 opacity-50" />}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        <div className="max-w-3xl">
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="eyebrow"
            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
            className="mt-4 text-display-xl text-gradient-ink"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-dark-grey"
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
