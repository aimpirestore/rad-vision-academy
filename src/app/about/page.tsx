import type { Metadata } from "next";
import { ShieldCheck, HeartPulse, Globe2, Sparkles, Target, Eye, Compass } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/motion/Primitives";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getFounders, getValues, getTimeline, getStats } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About RAD Vision Academy",
  description:
    "RAD Vision Academy's mission is to make world-class radiology education accessible to every clinician, everywhere. Learn about our story, founders, values, and global reach.",
  alternates: { canonical: "/about" },
};

const valueIcons = { ShieldCheck, HeartPulse, Globe2, Sparkles } as const;

type Value = { title: string; text: string; icon: string };
type Founder = { name: string; role: string; bio: string; initials: string; imageUrl?: string };
type TimelineItem = { year: string; title: string; text: string };
type Stat = { value: number; suffix?: string; label: string };

export default async function AboutPage() {
  const [founders, values, timeline, stats] = await Promise.all([
    getFounders(),
    getValues(),
    getTimeline(),
    getStats(),
  ]);

  const statArr = stats as Stat[];
  const countriesCount = statArr[1]?.value ?? 75;

  return (
    <>
      <PageHeader
        eyebrow="About us"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title={<>Radiology education, reimagined for a global generation</>}
        description="We exist to help every medical student, resident, and clinician read films with confidence — wherever they are in the world."
      />

      {/* Mission & Vision */}
      <section className="py-20 sm:py-24">
        <div className="container-default grid gap-6 lg:grid-cols-3">
          {[
            { icon: Compass, title: "Our Mission", text: "To make world-class radiology education structured, practical, and accessible to learners across every continent and healthcare system." },
            { icon: Eye, title: "Our Vision", text: "A world where every clinician — regardless of location or resources — can access the radiology training they need to deliver excellent patient care." },
            { icon: Target, title: "Our Promise", text: "Honest, evidence-based teaching. No fluff. No hype. Just the systematic, practical radiology knowledge that moves your career forward." },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.1}>
              <div className="surface-elevated h-full p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red/[0.08] text-brand-red">
                  <b.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h2 className="mt-5 text-xl font-bold tracking-tight text-brand-black">{b.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-dark-grey">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-30" />
        <div className="container-default relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">Our story</span>
            <h2 className="mt-4 text-display-lg text-gradient-ink">
              From a mentor&rsquo;s notebook to a global academy
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-dark-grey">
              <p>
                RAD Vision Academy started in {site.foundedYear} as a small mentorship practice — a handful of international medical graduates preparing for radiology training, guided by senior radiologists who believed every learner deserved honest, structured teaching.
              </p>
              <p>
                Word spread. The questions grew more ambitious. What began as one-to-one mentoring became structured courses, annotated case libraries, reporting templates, and exam preparation that has since reached learners in over {countriesCount} countries.
              </p>
              <p>
                Today, we combine that same personal mentorship with digital learning, AI-powered resources, and a global community — all built around one belief: that radiology is best taught as a reproducible system, not a list of facts.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-5xl border border-brand-black/[0.06] bg-gradient-to-br from-brand-black to-brand-dark-grey p-8 shadow-soft-xl">
              <div className="absolute inset-0 bg-blueprint-fine opacity-[0.1]" />
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-red/30 blur-[100px]" />
              <div className="relative flex h-full flex-col justify-between text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Since {site.foundedYear}</p>
                  <p className="mt-3 text-5xl font-bold">{statArr[0]?.value}{statArr[0]?.suffix}</p>
                  <p className="text-sm text-white/60">learners and counting</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {statArr.slice(1).map((s) => (
                    <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                      <p className="text-2xl font-bold">{s.value}{s.suffix}</p>
                      <p className="mt-1 text-xs text-white/60">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 sm:py-24">
        <div className="container-default">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow justify-center">Milestones</span>
              <h2 className="mt-4 text-display-lg text-gradient-ink">Seven years of progress</h2>
            </div>
          </Reveal>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(timeline as TimelineItem[]).map((t, i) => (
              <Reveal key={t.year} delay={i * 0.1}>
                <div className="surface relative h-full p-6">
                  <span className="text-sm font-bold text-brand-red">{t.year}</span>
                  <h3 className="mt-2 text-base font-bold tracking-tight text-brand-black">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark-grey">{t.text}</p>
                  {i < (timeline as TimelineItem[]).length - 1 && (
                    <div className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-full bg-brand-red/20 lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-24 sm:py-32">
        <div className="container-default">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow justify-center">What we stand for</span>
              <h2 className="mt-4 text-display-lg text-gradient-ink">Brand values</h2>
            </div>
          </Reveal>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(values as Value[]).map((v, i) => {
              const Icon = valueIcons[v.icon as keyof typeof valueIcons] ?? ShieldCheck;
              return (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="surface h-full p-7">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red/[0.08] text-brand-red">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold tracking-tight text-brand-black">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-dark-grey">{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 sm:py-24">
        <div className="container-default">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow justify-center">Meet the founders</span>
              <h2 className="mt-4 text-display-lg text-gradient-ink">Led by practising radiologists</h2>
            </div>
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
            {(founders as Founder[]).map((f, i) => (
              <Reveal key={f.name} delay={i * 0.1}>
                <div className="surface-elevated flex h-full flex-col items-center p-8 text-center">
                  {f.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.imageUrl}
                      alt={f.name}
                      className="h-20 w-20 rounded-full object-cover shadow-glow"
                    />
                  ) : (
                    <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-brand-red-deep text-xl font-bold text-white shadow-glow">
                      {f.initials}
                    </span>
                  )}
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-brand-black">{f.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-brand-red">{f.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-dark-grey">{f.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Global reach */}
      <section className="relative overflow-hidden bg-brand-light-grey/40 py-24">
        <div className="container-default">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow justify-center">Global reach</span>
              <h2 className="mt-4 text-display-lg text-gradient-ink">Trusted across {countriesCount}+ countries</h2>
              <p className="mt-4 text-base text-brand-dark-grey">
                Our learners come from leading hospitals, universities, and training programmes around the world.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-3">
              {site.countries.map((c) => (
                <span key={c} className="rounded-full border border-brand-black/[0.06] bg-white px-4 py-2 text-sm font-medium text-brand-dark-grey shadow-soft">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTAFinal />
    </>
  );
}
