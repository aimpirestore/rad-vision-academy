import type { Metadata } from "next";
import Link from "next/link";
import { FileText, StickyNote, Layers, Compass, Wrench, Download, ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/motion/Primitives";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getResources } from "@/lib/data";
import { resolveGumroadUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Radiology Resources",
  description:
    "Download free radiology study resources from RAD Vision Academy — PDFs, study notes, reporting templates, career guides, and decision aids.",
  alternates: { canonical: "/resources" },
};

const typeIcon = {
  PDF: FileText,
  Notes: StickyNote,
  Template: Layers,
  Guide: Compass,
  Toolkit: Wrench,
} as const;

type Resource = {
  title: string;
  type: string;
  description: string;
  free?: boolean;
  fileUrl?: string;
};

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        crumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        title={<>Free resources to sharpen your reading</>}
        description="High-yield PDFs, notes, templates, and guides — used by thousands of learners worldwide. Free to download."
      />

      <section className="py-20 sm:py-24">
        <div className="container-default">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(resources as Resource[]).map((r, i) => {
              const Icon = typeIcon[r.type as keyof typeof typeIcon] ?? FileText;
              // Prefer a per-resource file URL, else fall back to Gumroad
              const href = resolveGumroadUrl(r.fileUrl);
              const external = !r.fileUrl;
              return (
                <Reveal key={r.title} delay={(i % 3) * 0.08}>
                  <div className="group surface-elevated flex h-full flex-col p-7 transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/[0.08] text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      {r.free && (
                        <span className="rounded-full bg-brand-red/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-red">
                          Free
                        </span>
                      )}
                    </div>
                    <span className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-dark-grey/60">
                      {r.type}
                    </span>
                    <h2 className="mt-1 text-lg font-bold tracking-tight text-brand-black">{r.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-dark-grey">{r.description}</p>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition-colors hover:text-brand-red-deep"
                    >
                      <Download className="h-4 w-4" /> Download free
                      {external && <ExternalLink className="h-3 w-3 opacity-60" />}
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Banner to paid resources */}
      <section className="pb-24">
        <div className="container-default">
          <Reveal>
            <div className="surface-elevated flex flex-col items-center justify-between gap-6 bg-gradient-to-br from-brand-light-grey to-white p-8 text-center sm:flex-row sm:p-12 sm:text-left">
              <div>
                <h2 className="text-display-lg text-gradient-ink">Want the full library?</h2>
                <p className="mt-3 max-w-xl text-base text-brand-dark-grey">
                  Our Residency Survival Bundle includes eBooks, notes, templates, and the question bank — together, for 35% less.
                </p>
              </div>
              <Link
                href="/store"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-black px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                Explore the store
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTAFinal />
    </>
  );
}
