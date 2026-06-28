import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Calendar, ChevronRight, ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "@/components/motion/Primitives";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { getPost, getAllPostSlugs, getPosts } from "@/lib/data";
import { site } from "@/lib/site";
import { sanitizeHtml } from "@/lib/security/sanitize";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic rendering so newly-published posts appear without redeploy
export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const allPosts = await getPosts();
  const related = allPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
  const fallback = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const recommendations = related.length > 0 ? related : fallback;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    datePublished: post.date,
    articleSection: post.category,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}/blog/${slug}` },
    ],
  };

  // Render the post body. Posts in DB store rich text (HTML) in `body`.
  // Hardcoded fallback posts don't have a body, so use the default prose block.
  // SECURITY: Sanitize all CMS HTML through DOMPurify before rendering to
  // strip any <script>, event handlers, or javascript: URLs (stored XSS).
  const hasBody = typeof post.body === "string" && post.body.trim().length > 0;
  const safeBody = hasBody ? sanitizeHtml(post.body as string) : "";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <article className="relative overflow-hidden bg-brand-white pt-32 sm:pt-36 lg:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="absolute inset-0 bg-blueprint opacity-40 mask-fade-b" />
        </div>

        <div className="container-narrow relative pb-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-brand-dark-grey/70">
              <li><Link href="/" className="hover:text-brand-red">Home</Link></li>
              <li><ChevronRight className="h-3 w-3 opacity-50" /></li>
              <li><Link href="/blog" className="hover:text-brand-red">Blog</Link></li>
              <li><ChevronRight className="h-3 w-3 opacity-50" /></li>
              <li className="max-w-[200px] truncate text-brand-black">{post.title}</li>
            </ol>
          </nav>

          <Badge variant="red">{post.category}</Badge>
          <h1 className="mt-4 text-display-lg text-gradient-ink">{post.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-5 border-b border-brand-black/[0.06] pb-8 text-sm text-brand-dark-grey">
            <span className="font-semibold text-brand-black">{post.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-red" /> {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-red" /> {post.readingTime}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="container-narrow relative pb-20">
          <div
            className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-a:text-brand-red prose-strong:text-brand-black"
            // When post.body exists (CMS-authored), render it; otherwise fall back
            // to the default prose block so seeded posts still render nicely.
          >
            <p className="text-lg font-medium leading-relaxed text-brand-dark-grey">{post.excerpt}</p>

            {hasBody ? (
              <div dangerouslySetInnerHTML={{ __html: safeBody }} />
            ) : (
              <>
                <h2>Why this matters</h2>
                <p>
                  Radiology rewards a systematic approach. When you read a study the same way every time, you stop relying on
                  luck and start relying on method. This article distills the practical principles that experienced
                  radiologists use every day.
                </p>

                <h2>The core principle</h2>
                <p>
                  The single most important habit is consistency: a reproducible search pattern that you apply to every study.
                  Most misses in radiology are not knowledge failures — they are <strong>search failures</strong>, where a
                  finding was visible but never looked at.
                </p>
                <blockquote>
                  Read every film the same way. Discipline beats genius on a busy on-call shift.
                </blockquote>

                <h2>A practical framework</h2>
                <p>
                  Build your reading around four habits: confirm the patient and study, work through anatomy in a fixed order,
                  actively compare to prior imaging, and close the loop with a clear, structured report.
                </p>
                <ul>
                  <li><strong>Confirm:</strong> right patient, right study, right indication.</li>
                  <li><strong>Survey:</strong> a fixed anatomical sweep, every time.</li>
                  <li><strong>Compare:</strong> priors change everything — find them early.</li>
                  <li><strong>Conclude:</strong> a clear, actionable impression.</li>
                </ul>

                <h2>Putting it into practice</h2>
                <p>
                  Reading is only half the work. Deliberate practice — timed case review, structured reporting, and honest
                  feedback from a mentor — is what turns understanding into automatic skill. That&rsquo;s the philosophy behind
                  every course and resource at RAD Vision Academy.
                </p>
              </>
            )}
          </div>

          {/* Author card */}
          <div className="mt-12 flex items-center gap-4 rounded-3xl border border-brand-black/[0.06] bg-brand-light-grey/50 p-6">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-brand-red-deep text-sm font-bold text-white">
              {post.author.split(" ").slice(-2, -1)[0]?.[0]}
              {post.author.split(" ").slice(-1)[0][0]}
            </span>
            <div>
              <p className="text-sm font-bold text-brand-black">{post.author}</p>
              <p className="text-xs text-brand-dark-grey">Radiologist &amp; contributor at {site.name}</p>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="border-t border-brand-black/[0.06] py-20 sm:py-24">
        <div className="container-default">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="text-display-lg text-gradient-ink">Keep reading</h2>
              <Link href="/blog" className="hidden text-sm font-semibold text-brand-red hover:underline sm:inline">
                All articles
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {recommendations.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group surface p-6 transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                <Badge variant="soft">{p.category}</Badge>
                <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-brand-black group-hover:text-brand-red">{p.title}</h3>
                <p className="mt-2 text-sm text-brand-dark-grey">{p.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-red">
                  Read <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / contact nudge */}
      <section className="pb-24">
        <div className="container-default">
          <Reveal>
            <div className="surface-elevated flex flex-col items-center gap-4 p-8 text-center sm:p-12">
              <h2 className="text-display-lg text-gradient-ink">Get weekly radiology pearls</h2>
              <p className="max-w-xl text-base text-brand-dark-grey">
                Join our newsletter for high-yield cases, career guidance, and the latest from our clinicians.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" /> Get in touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
