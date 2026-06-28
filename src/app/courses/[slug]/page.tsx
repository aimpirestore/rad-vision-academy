import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, BarChart3, CheckCircle2, ChevronRight, ShoppingCart, GraduationCap, Award } from "lucide-react";
import { Reveal } from "@/components/motion/Primitives";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Badge } from "@/components/ui/Badge";
import { getCourse, getAllCourseSlugs, resolveGumroadUrl } from "@/lib/data";
import { site, GUMROAD_STORE_URL } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

// Keep generateStaticParams for incremental static generation (ISR-friendly).
// Pages still revalidate via revalidatePath on publish.
export async function generateStaticParams() {
  const slugs = await getAllCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic rendering so newly-published courses appear without redeploy
export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/courses/${slug}` },
    openGraph: {
      title: `${course.title} — ${site.name}`,
      description: course.description,
      type: "website",
    },
  };
}

export default async function CourseDetailPage({ params }: Params) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  // Fetch all courses for related items
  const { getCourses } = await import("@/lib/data");
  const allCourses = await getCourses();
  const related = allCourses.filter((c) => c.slug !== slug).slice(0, 3);

  const buyUrl = resolveGumroadUrl(course.gumroadUrl);

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    instructor: {
      "@type": "Person",
      name: course.instructor,
    },
    offers: {
      "@type": "Offer",
      price: course.price.replace("$", ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: buyUrl,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Courses", item: `${site.url}/courses` },
      { "@type": "ListItem", position: 3, name: course.title, item: `${site.url}/courses/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Header */}
      <section className="relative overflow-hidden bg-brand-white pt-32 sm:pt-36 lg:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="absolute inset-0 bg-blueprint opacity-50 mask-fade-b" />
        </div>
        <div className="container-default relative pb-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-brand-dark-grey/70">
              <li><Link href="/" className="hover:text-brand-red">Home</Link></li>
              <li><ChevronRight className="h-3 w-3 opacity-50" /></li>
              <li><Link href="/courses" className="hover:text-brand-red">Courses</Link></li>
              <li><ChevronRight className="h-3 w-3 opacity-50" /></li>
              <li className="text-brand-black">{course.title}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="red">{course.category}</Badge>
                <Badge>{course.level}</Badge>
              </div>
              <h1 className="mt-5 text-display-xl text-gradient-ink">{course.title}</h1>
              <p className="mt-3 text-lg font-medium text-brand-red">{course.instructor}</p>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-dark-grey">{course.description}</p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-brand-dark-grey">
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-brand-red" /> {course.duration}</span>
                <span className="inline-flex items-center gap-2"><BarChart3 className="h-4 w-4 text-brand-red" /> {course.level}</span>
                <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4 text-brand-red" /> Self-paced</span>
              </div>
            </div>

            {/* Buy card */}
            <aside className="surface-elevated h-fit p-6 lg:sticky lg:top-28">
              <div className="relative mb-5 h-28 overflow-hidden rounded-2xl border border-brand-black/[0.06] bg-gradient-to-br from-brand-black to-brand-dark-grey">
                <div className="absolute inset-0 bg-blueprint-fine opacity-[0.12]" />
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-red/30 blur-2xl" />
                <div className="absolute bottom-4 left-5 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Course</p>
                  <p className="text-base font-bold">{course.price}</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-brand-black">{course.price}</p>
              <p className="mt-1 text-xs text-brand-dark-grey/70">One-time payment · Lifetime access via Gumroad</p>
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5"
              >
                <ShoppingCart className="h-4 w-4" /> Buy Now on Gumroad
              </a>
              <Link
                href="/contact"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-brand-black/10 px-6 py-3.5 text-sm font-semibold text-brand-black transition-all hover:border-brand-black/20"
              >
                Ask a question
              </Link>
              <ul className="mt-6 space-y-2.5 border-t border-brand-black/[0.06] pt-5 text-xs text-brand-dark-grey">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-red" /> Lifetime access & updates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-red" /> Secure checkout via Gumroad</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-red" /> Completion confirmation</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* What you&rsquo;ll learn */}
      <section className="py-20 sm:py-24">
        <div className="container-default grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <span className="eyebrow">What you&rsquo;ll learn</span>
            <h2 className="mt-4 text-display-lg text-gradient-ink">Outcomes you can rely on</h2>
            <p className="mt-4 text-base leading-relaxed text-brand-dark-grey">
              By the end of this course you&rsquo;ll have a reproducible method and the confidence to apply it in real clinical practice.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {course.highlights.map((h, i) => (
                <li key={i} className="surface flex items-start gap-3 p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                  <span className="text-sm font-medium text-brand-black">{h}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Instructor strip */}
      <section className="pb-8">
        <div className="container-default">
          <Reveal>
            <div className="surface-elevated flex flex-col items-center gap-5 p-8 text-center sm:flex-row sm:text-left">
              <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-brand-red-deep text-lg font-bold text-white shadow-glow">
                {course.instructor.split(" ").slice(-2, -1)[0]?.[0]}
                {course.instructor.split(" ").slice(-1)[0][0]}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <h3 className="text-lg font-bold text-brand-black">{course.instructor}</h3>
                  <Award className="h-4 w-4 text-brand-red" />
                </div>
                <p className="mt-1 text-sm text-brand-dark-grey">
                  Senior radiologist and course instructor. Brings real-world clinical experience into every lesson.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="py-20 sm:py-24">
        <div className="container-default">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="text-display-lg text-gradient-ink">Related courses</h2>
              <Link href="/courses" className="hidden text-sm font-semibold text-brand-red hover:underline sm:inline">
                View all
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {related.map((c) => {
              return (
                <Link key={c.slug} href={`/courses/${c.slug}`} className="group surface p-6 transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                  <Badge variant="soft">{c.category}</Badge>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-brand-black group-hover:text-brand-red">{c.title}</h3>
                  <p className="mt-2 text-sm text-brand-dark-grey">{c.blurb}</p>
                  <p className="mt-4 text-sm font-semibold text-brand-red">{c.price}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CTAFinal />
    </>
  );
}
