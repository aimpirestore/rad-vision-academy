import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Stats } from "@/components/sections/Stats";
import { Pillars } from "@/components/sections/Pillars";
import { FeaturedCourses } from "@/components/sections/FeaturedCourses";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getCourses, getTestimonials, getStats, getFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "World-Class Radiology Education — International Medical Education",
  description:
    "RAD Vision Academy empowers future radiologists with world-class courses, mentorship, digital products, and AI-powered learning resources. Trusted by 12,000+ learners in 75+ countries.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [courses, testimonials, stats, faqs] = await Promise.all([
    getCourses(),
    getTestimonials(),
    getStats(),
    getFaqs(),
  ]);

  return (
    <>
      <Hero />
      <Marquee />
      <Stats stats={stats} />
      <Pillars />
      <FeaturedCourses courses={courses} />
      <Process />
      <Testimonials testimonials={testimonials} />
      <FAQ faqs={faqs} />
      <CTAFinal />
    </>
  );
}
