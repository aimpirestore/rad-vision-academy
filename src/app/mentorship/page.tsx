import type { Metadata } from "next";
import { Compass, GraduationCap, Target, MessageSquare, FileText, CalendarCheck, CheckCircle2, ArrowRight, ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/motion/Primitives";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getMentorshipServices, getTestimonials, resolveGumroadUrl } from "@/lib/data";

export const metadata: Metadata = {
  title: "1:1 Mentorship & Career Guidance",
  description:
    "Personalised radiology mentorship from senior clinicians — career guidance, residency strategy, FRCR preparation, interview coaching, and CV review.",
  alternates: { canonical: "/mentorship" },
};

const iconMap = {
  compass: Compass,
  graduation: GraduationCap,
  target: Target,
  message: MessageSquare,
  file: FileText,
  calendar: CalendarCheck,
} as const;

type Service = {
  title: string;
  description: string;
  outcomes: string[];
  icon: string;
  gumroadUrl?: string;
};

export default async function MentorshipPage() {
  const [services, testimonials] = await Promise.all([
    getMentorshipServices(),
    getTestimonials(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Mentorship"
        crumbs={[{ label: "Home", href: "/" }, { label: "Mentorship" }]}
        title={<>Personalised guidance for your radiology career</>}
        description="One-to-one mentorship with senior radiologists who have trained hundreds of successful candidates — across residency matching, FRCR, interviews, and long-term career planning."
      >
        <a
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5"
        >
          Book a Consultation <ArrowRight className="h-4 w-4" />
        </a>
      </PageHeader>

      {/* Services grid */}
      <section className="py-20 sm:py-24">
        <div className="container-default">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(services as Service[]).map((s, i) => {
              const Icon = iconMap[s.icon as keyof typeof iconMap] ?? Compass;
              const buyUrl = resolveGumroadUrl(s.gumroadUrl);
              const hasOwnUrl = !!s.gumroadUrl;
              return (
                <Reveal key={s.title} delay={(i % 3) * 0.08}>
                  <div className="group surface-elevated flex h-full flex-col p-7 transition-all hover:-translate-y-1">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red/[0.08] text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <h2 className="mt-5 text-lg font-bold tracking-tight text-brand-black">{s.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-brand-dark-grey">{s.description}</p>
                    <ul className="mt-5 space-y-2 border-t border-brand-black/[0.06] pt-5">
                      {s.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-2 text-sm text-brand-dark-grey">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                          {o}
                        </li>
                      ))}
                    </ul>
                    {hasOwnUrl && (
                      <a
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-xs font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> Book on Gumroad
                      </a>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process strip */}
      <section className="relative overflow-hidden bg-brand-light-grey/40 py-24">
        <div className="container-default">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow justify-center">How it works</span>
              <h2 className="mt-4 text-display-lg text-gradient-ink">A simple, supportive process</h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: "Reach out", d: "Tell us where you are and where you want to be — no question is too small." },
              { n: "02", t: "Get matched", d: "We pair you with a mentor whose experience fits your goals and geography." },
              { n: "03", t: "Build a plan", d: "Together you agree a concrete, prioritised action plan with milestones." },
              { n: "04", t: "Stay accountable", d: "Regular check-ins keep you moving — and adjusting as you progress." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="text-center sm:text-left">
                  <span className="text-sm font-bold text-brand-red">{s.n}</span>
                  <h3 className="mt-2 text-base font-bold tracking-tight text-brand-black">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark-grey">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials testimonials={testimonials} />
      <CTAFinal />
    </>
  );
}
