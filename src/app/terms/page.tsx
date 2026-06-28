import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { getSiteSettings } from "@/lib/data";
import { GUMROAD_STORE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions that govern your use of the RAD Vision Academy website and digital products.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const siteSettings = await getSiteSettings();
  const brandName = siteSettings.brandName;
  const email = siteSettings.email;

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
        title={<>Terms of Service</>}
        description={`Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
      />

      <section className="py-20 sm:py-24">
        <div className="container-narrow">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-a:text-brand-red prose-strong:text-brand-black">
            <p>
              These terms govern your access to and use of the {brandName} website and any digital products purchased
              through our Gumroad store. By using our website, you agree to these terms.
            </p>

            <h2>1. Use of our content</h2>
            <p>
              All content on this website — including text, graphics, logos, course materials, and design — is the
              property of {brandName} and is protected by copyright. You may view and use the website for personal,
              non-commercial educational purposes.
            </p>

            <h2>2. Purchased products</h2>
            <p>
              Courses, eBooks, question banks, templates, notes, and bundles are sold exclusively through our official
              Gumroad store at{" "}
              <a href={GUMROAD_STORE_URL} target="_blank" rel="noopener noreferrer">{GUMROAD_STORE_URL}</a>. Your purchase is
              governed by Gumroad&rsquo;s terms of service and refund policy in addition to these terms.
            </p>

            <h2>3. Licence</h2>
            <p>
              Purchased digital products are licensed for your personal use. You may not redistribute, resell, share, or
              commercially exploit the materials without our written permission.
            </p>

            <h2>4. Educational disclaimer</h2>
            <p>
              Our content is provided for general medical education only. It is not a substitute for professional
              medical advice, diagnosis, or treatment. Always seek the advice of qualified clinicians regarding any
              medical condition, and never disregard professional advice because of something you have read here.
            </p>

            <h2>5. No professional advice</h2>
            <p>
              Mentoring and guidance offered through {brandName} is educational and advisory in nature. Outcomes depend
              on individual effort and circumstances, and we make no guarantee of examination success, residency
              placement, or employment.
            </p>

            <h2>6. Acceptable use</h2>
            <p>
              You agree not to misuse the website, attempt to gain unauthorised access, disrupt its operation, or use it
              for any unlawful purpose.
            </p>

            <h2>7. Third-party links</h2>
            <p>
              Our website links to third-party services, including Gumroad and social media platforms. We are not
              responsible for the content or practices of those services.
            </p>

            <h2>8. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, {brandName} shall not be liable for any indirect, incidental, or
              consequential damages arising from your use of the website or our products.
            </p>

            <h2>9. Changes to these terms</h2>
            <p>
              We may revise these terms at any time. Continued use of the website after changes constitutes acceptance of
              the updated terms.
            </p>

            <h2>10. Contact</h2>
            <p>
              Questions about these terms? Email us at{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
