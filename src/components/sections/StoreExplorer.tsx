"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/cards/ProductCard";
import type { Product } from "@/lib/site";
import { cn } from "@/lib/utils";

const categories = ["All", "eBook", "Question Bank", "Reporting Template", "Study Notes", "Course", "Bundle"] as const;

export function StoreExplorer({ products }: { products: (Product & { gumroadUrl?: string })[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");

  const filtered = category === "All" ? products : products.filter((p) => p.category === category);

  return (
    <section className="py-20 sm:py-24">
      <div className="container-default">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                category === c
                  ? "bg-brand-red text-white shadow-glow"
                  : "border border-brand-black/10 bg-white text-brand-dark-grey hover:border-brand-red/30",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-brand-dark-grey">
          Showing <span className="font-bold text-brand-black">{filtered.length}</span> products
        </p>

        <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
