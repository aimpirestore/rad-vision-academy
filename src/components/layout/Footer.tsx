import Link from "next/link";
import { Twitter, Linkedin, Instagram, Youtube, Mail, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GUMROAD_STORE_URL } from "@/lib/utils";

type NavItem = { label: string; href: string };
type FooterNavGroup = Record<string, NavItem[]>;

type FooterProps = {
  siteName: string;
  siteDescription: string;
  siteEmail: string;
  socials: {
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
  footerNav: FooterNavGroup;
};

export function Footer({ siteName, siteDescription, siteEmail, socials, footerNav }: FooterProps) {
  const year = new Date().getFullYear();
  const socialLinks = [
    { Icon: Twitter, href: socials.twitter, label: "Twitter / X" },
    { Icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
    { Icon: Instagram, href: socials.instagram, label: "Instagram" },
    { Icon: Youtube, href: socials.youtube, label: "YouTube" },
  ];

  return (
    <footer className="relative overflow-hidden bg-brand-black text-white">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute inset-0 bg-blueprint-fine" />
      </div>
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-red/20 blur-[120px]" />

      <div className="container-wide relative">
        {/* CTA strip */}
        <div className="grid gap-8 border-b border-white/10 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="text-display-lg text-white">
              Ready to advance your <span className="text-gradient-red">radiology</span> career?
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/60">
              Join thousands of medical students, residents, and clinicians learning with RAD Vision Academy.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5"
            >
              Explore Courses <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href={GUMROAD_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5"
            >
              Visit Store <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {siteDescription}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-brand-red hover:bg-brand-red hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerNav).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Newsletter</h3>
            <p className="mt-4 text-sm text-white/60">
              Weekly high-yield radiology pearls, case studies, and career guidance.
            </p>
            <form className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                placeholder="you@hospital.org"
                aria-label="Email address"
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-black transition-all hover:bg-white/90"
              >
                Subscribe
              </button>
            </form>
            <a
              href={`mailto:${siteEmail}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4" /> {siteEmail}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-white/50 sm:flex-row">
          <p>&copy; {year} {siteName}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted for the future of radiology education.
          </p>
        </div>
      </div>
    </footer>
  );
}
