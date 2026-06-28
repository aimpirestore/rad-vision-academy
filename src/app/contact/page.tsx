import type { Metadata } from "next";
import { Mail, MessageSquare, Globe2, Clock, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/motion/Primitives";
import { FAQ } from "@/components/sections/FAQ";
import { getSiteSettings, getSocialLinks, getFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact RAD Vision Academy",
  description:
    "Get in touch with RAD Vision Academy. Questions about courses, mentorship, institutional training, or partnerships — we'd love to hear from you.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [siteSettings, socialLinks, faqs] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
    getFaqs(),
  ]);

  const channels = [
    { icon: Mail, label: "Email", value: siteSettings.email, href: `mailto:${siteSettings.email}` },
    { icon: MessageSquare, label: "Response time", value: "Within 1 business day" },
    { icon: Globe2, label: "Coverage", value: "US · UK · EU · Gulf · Worldwide" },
    { icon: Clock, label: "Office hours", value: "Mon–Fri, 9:00–17:00 GMT" },
  ];

  const socials = [
    { icon: Twitter, href: socialLinks.twitter, label: "Twitter / X" },
    { icon: Linkedin, href: socialLinks.linkedin, label: "LinkedIn" },
    { icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
    { icon: Youtube, href: socialLinks.youtube, label: "YouTube" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title={<>Let&rsquo;s talk about your radiology journey</>}
        description="Whether you&rsquo;re picking your first course or planning institutional training, our team is here to help."
      />

      <section className="py-20 sm:py-24">
        <div className="container-default grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Left — info */}
          <Reveal>
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-brand-black">Reach us directly</h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-dark-grey">
                  We read every message. For the fastest response on courses and products, please mention what you&rsquo;re considering and your current stage.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {channels.map((c) => (
                  <div key={c.label} className="surface p-5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/[0.08] text-brand-red">
                      <c.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-dark-grey/60">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="mt-1 block text-sm font-semibold text-brand-black hover:text-brand-red">
                        {c.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-brand-black">{c.value}</p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-dark-grey/60">Follow along</p>
                <div className="mt-3 flex items-center gap-3">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-black/10 text-brand-dark-grey transition-all hover:border-brand-red hover:bg-brand-red hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <FAQ faqs={faqs} />
    </>
  );
}
