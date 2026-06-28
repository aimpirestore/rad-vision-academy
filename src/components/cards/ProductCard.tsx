"use client";

import { motion } from "framer-motion";
import { BookOpen, FileText, Layers, StickyNote, GraduationCap, Package, ShoppingCart, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/site";
import { resolveGumroadUrl } from "@/lib/utils";

const categoryIcon = {
  eBook: BookOpen,
  "Question Bank": FileText,
  "Reporting Template": Layers,
  "Study Notes": StickyNote,
  Course: GraduationCap,
  Bundle: Package,
} as const;

export function ProductCard({ product }: { product: Product & { gumroadUrl?: string } }) {
  const Icon = categoryIcon[product.category];
  const buyHref = resolveGumroadUrl(product.gumroadUrl);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group surface-elevated relative flex flex-col overflow-hidden"
    >
      {/* Top visual */}
      <div className="relative h-36 overflow-hidden border-b border-brand-black/[0.06] bg-gradient-to-br from-brand-black to-brand-dark-grey p-5">
        <div className="absolute inset-0 bg-blueprint-fine opacity-[0.12]" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-red/30 blur-2xl transition-all duration-500 group-hover:bg-brand-red/50" />
        <div className="relative flex h-full items-end justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
            <Icon className="h-5 w-5" />
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70 backdrop-blur">
            {product.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold tracking-tight text-brand-black">{product.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-dark-grey">{product.blurb}</p>

        <div className="mt-5 flex items-center justify-between border-t border-brand-black/[0.06] pt-5">
          <div>
            <span className="text-lg font-bold text-brand-black">{product.price}</span>
            <span className="ml-2 text-xs text-brand-dark-grey/70">{product.format}</span>
          </div>
          <a
            href={buyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-2 text-xs font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Buy
            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
