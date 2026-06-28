"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Primitives";
import { SectionHeading } from "@/components/ui/Badge";

type Testimonial = { quote: string; name: string; role: string };

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-blueprint opacity-40" />
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-brand-red/[0.05] blur-[100px]" />
      </div>
      <div className="container-default relative">
        <Reveal>
          <SectionHeading
            eyebrow="Loved by clinicians"
            title={<>Real progress, from real learners</>}
            description="From medical students to consultant radiologists — hear from clinicians who advanced their careers with us."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="surface-elevated relative flex flex-col gap-5 p-8"
            >
              <Quote className="h-8 w-8 text-brand-red/30" />
              <blockquote className="flex-1 text-lg leading-relaxed text-brand-black">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-brand-black/[0.06] pt-5">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                  {t.name.split(" ").slice(-2, -1)[0]?.[0]}
                  {t.name.split(" ").slice(-1)[0][0]}
                </span>
                <div>
                  <p className="text-sm font-bold text-brand-black">{t.name}</p>
                  <p className="text-xs text-brand-dark-grey">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
