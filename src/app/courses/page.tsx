import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { CourseExplorer } from "@/components/sections/CourseExplorer";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getCourses, getTestimonials, getFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Radiology Courses",
  description:
    "Browse premium radiology courses from RAD Vision Academy — foundations, subspecialty, FRCR preparation, and AI in radiology. Taught by practising radiologists.",
  alternates: { canonical: "/courses" },
};

export default async function CoursesPage() {
  const [courses, testimonials, faqs] = await Promise.all([
    getCourses(),
    getTestimonials(),
    getFaqs(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Courses"
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses" }]}
        title={<>Premium courses, taught by radiologists</>}
        description="Structured, evidence-based courses that build a reproducible system for reading imaging — from your first chest X-ray to advanced subspecialty practice."
      />
      <CourseExplorer courses={courses} />
      <Testimonials testimonials={testimonials} />
      <FAQ faqs={faqs} />
      <CTAFinal />
    </>
  );
}
