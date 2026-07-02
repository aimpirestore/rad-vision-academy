import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServiceWorkerRegister } from "@/components/safety/ServiceWorkerRegister";
import { getNav, getSiteSettings, getSocialLinks, getSeoSettings } from "@/lib/data";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
};

const CANONICAL_BASE = "https://radvisionacademy.com";

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, seoSettings] = await Promise.all([
    getSiteSettings(),
    getSeoSettings(),
  ]);

  const name = siteSettings.brandName;
  const tagline = siteSettings.tagline;
  const description = siteSettings.footerCopyright || seoSettings.globalDescription;
  const canonicalBase = seoSettings.canonicalBase || CANONICAL_BASE;

  return {
    metadataBase: new URL(canonicalBase),
    title: {
      default: seoSettings.globalTitle || `${name} — ${tagline}`,
      template: `%s — ${name}`,
    },
    description,
    keywords: [
      "radiology education",
      "FRCR preparation",
      "radiology courses",
      "medical education",
      "radiology mentorship",
      "MBBS",
      "IMG residency",
      "radiology question bank",
      "reporting templates",
      "AI in radiology",
    ],
    authors: [{ name }],
    creator: name,
    publisher: name,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalBase,
      siteName: name,
      title: `${name} — ${tagline}`,
      description,
    },
    twitter: {
      card: seoSettings.twitterCard || "summary_large_image",
      title: `${name} — ${tagline}`,
      description,
      creator: "@radvisionacademy",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [mainNav, footerNav, siteSettings, socialLinks] = await Promise.all([
    getNav("header"),
    getNav("footer"),
    getSiteSettings(),
    getSocialLinks(),
  ]);

  const brandName = siteSettings.brandName;
  const brandEmail = siteSettings.email;
  const brandDescription = siteSettings.footerCopyright || "RAD Vision Academy — World-Class Radiology Education.";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: brandName,
    url: CANONICAL_BASE,
    logo: `${CANONICAL_BASE}/favicon.svg`,
    description: brandDescription,
    sameAs: Object.values({
      twitter: socialLinks.twitter,
      linkedin: socialLinks.linkedin,
      instagram: socialLinks.instagram,
      youtube: socialLinks.youtube,
    }).filter(Boolean),
    email: brandEmail,
  };

  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen bg-brand-white font-sans text-brand-black">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-black focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Navbar navItems={mainNav as { label: string; href: string; external?: boolean }[]} />
        <main id="main">{children}</main>
        <Footer
          siteName={brandName}
          siteDescription={brandDescription}
          siteEmail={brandEmail}
          socials={{
            twitter: socialLinks.twitter,
            linkedin: socialLinks.linkedin,
            instagram: socialLinks.instagram,
            youtube: socialLinks.youtube,
          }}
          footerNav={footerNav as Record<string, { label: string; href: string }[]>}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
