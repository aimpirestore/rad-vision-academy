"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/motion/Primitives";
import { SectionHeading } from "@/components/ui/Badge";

type Faq = { q: string; a: string };

export function FAQ({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-default">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Questions"
              title={<>Everything you need to know</>}
              description="Can't find what you're looking for? Reach out to our team — we usually reply within a business day."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="divide-y divide-brand-black/[0.06] border-y border-brand-black/[0.06]">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className={`text-base font-semibold transition-colors sm:text-lg ${isOpen ? "text-brand-red" : "text-brand-black"}`}>
                        {faq.q}
                      </span>
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-black/10 text-brand-black transition-colors">
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pr-12 text-sm leading-relaxed text-brand-dark-grey sm:text-base">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
