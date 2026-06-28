"use client";

import { motion } from "framer-motion";
import { Scan, BrainCircuit, BookOpen, Users, Globe2, Microscope, Activity, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/motion/Primitives";
import { SectionHeading } from "@/components/ui/Badge";

const pillars = [
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    text: "Modular courses that build from first principles to advanced subspecialty reading — taught by practising radiologists.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Learning",
    text: "Adaptive resources, annotated case libraries, and tools that meet you where you are and accelerate your progress.",
  },
  {
    icon: Users,
    title: "1:1 Mentorship",
    text: "Career, residency, and FRCR guidance from senior mentors who have trained hundreds of successful candidates.",
  },
  {
    icon: Globe2,
    title: "Global Pathways",
    text: "Content designed for the US, UK, Europe, and the Gulf — respecting local systems, exams, and career routes.",
  },
  {
    icon: Scan,
    title: "Real Imaging",
    text: "High-resolution annotated teaching cases across every modality, the way you'll see them in practice.",
  },
  {
    icon: GraduationCap,
    title: "Exam-Ready",
    text: "FRCR, residency, and viva preparation built on pattern recognition and disciplined, timed practice.",
  },
];

export function Pillars() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-blueprint-fine opacity-50" />
      <div className="container-default relative">
        <Reveal>
          <SectionHeading
            eyebrow="Why RAD Vision"
            title={<>A complete learning system, <br className="hidden sm:block" />built for radiology</>}
            description="From your first chest X-ray to your FRCR viva, everything you need to read films with confidence — in one premium platform."
          />
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group surface relative overflow-hidden p-7"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-red/[0.05] blur-2xl transition-opacity duration-500 group-hover:bg-brand-red/[0.1]" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red/[0.08] text-brand-red transition-colors duration-300 group-hover:bg-brand-red group-hover:text-white">
                <p.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-brand-black">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-dark-grey">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
