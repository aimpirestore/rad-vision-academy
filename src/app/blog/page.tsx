import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { BlogExplorer } from "@/components/sections/BlogExplorer";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Radiology Blog & Articles",
  description:
    "High-yield radiology articles, case studies, and career guidance from RAD Vision Academy's clinicians. Exam preparation, subspecialty deep-dives, and AI in radiology.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        title={<>Insights from practising radiologists</>}
        description="Deep-dives, case discussions, exam strategy, and career guidance — written by clinicians, for clinicians."
      />
      <BlogExplorer posts={posts} />
      <CTAFinal />
    </>
  );
}
