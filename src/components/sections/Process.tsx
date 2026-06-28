"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Primitives";

const steps = [
  {
    n: "01",
    title: "Assess your level",
    text: "Take our quick diagnostic or talk to a mentor to find the right starting point for your stage and goals.",
  },
  {
    n: "02",
    title: "Learn the system",
    text: "Follow structured courses and case libraries that build a reproducible method — not just facts.",
  },
  {
    n: "03",
    title: "Practice deliberately",
    text: "Drill with timed question banks, reporting templates, and annotated cases until it's automatic.",
  },
  {
    n: "04",
    title: "Get mentorship",
    text: "Refine your technique with 1:1 guidance for residency, FRCR, interviews, and your career.",
  },
];

export function Process() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-default">
        <Reveal>
          <div className="surface-elevated relative overflow-hidden p-8 sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-30" />
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-red/[0.06] blur-[100px]" />

            <div className="relative">
              <span className="eyebrow">The RAD Vision Method</span>
              <h2 className="mt-4 max-w-2xl text-display-lg text-gradient-ink">
                A clear path from first scan to fluent reader
              </h2>

              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                  >
                    <span className="text-sm font-bold text-brand-red">{s.n}</span>
                    <h3 className="mt-3 text-lg font-bold tracking-tight text-brand-black">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-dark-grey">{s.text}</p>
                    {i < steps.length - 1 && (
                      <div className="absolute right-0 top-1 hidden h-px w-8 bg-gradient-to-r from-brand-red/30 to-transparent lg:block" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
