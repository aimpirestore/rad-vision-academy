import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { getSiteSettings } from "@/lib/data";
import { GUMROAD_STORE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How RAD Vision Academy collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default async function PrivacyPage() {
  const siteSettings = await getSiteSettings();
  const brandName = siteSettings.brandName;
  const email = siteSettings.email;

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        title={<>Privacy Policy</>}
        description={`Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
      />

      <section className="py-20 sm:py-24">
        <div className="container-narrow">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-a:text-brand-red prose-strong:text-brand-black">
            <p>
              At {brandName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), we respect your privacy. This
              policy explains what information we collect, how we use it, and the choices you have.
            </p>

            <h2>1. Information we collect</h2>
            <p>
              We collect information you provide directly — such as your name and email address when you contact us,
              subscribe to our newsletter, or complete a form. We also collect limited analytics data about how you use
              our website, such as pages visited and approximate location.
            </p>

            <h2>2. How we use your information</h2>
            <ul>
              <li>To respond to your enquiries and provide mentorship or support.</li>
              <li>To send you the newsletter or content you have requested.</li>
              <li>To improve our website, courses, and resources.</li>
              <li>To comply with our legal obligations.</li>
            </ul>

            <h2>3. Purchases and Gumroad</h2>
            <p>
              We do not process payments on this website. All purchases of courses, eBooks, and other products are made
              through our official Gumroad store at{" "}
              <a href={GUMROAD_STORE_URL} target="_blank" rel="noopener noreferrer">{GUMROAD_STORE_URL}</a>. Payment and order
              information is handled by Gumroad under its own privacy policy.
            </p>

            <h2>4. Cookies and analytics</h2>
            <p>
              We use essential cookies to operate the site and may use privacy-friendly analytics to understand usage.
              You can control cookies through your browser settings.
            </p>

            <h2>5. Third-party services</h2>
            <p>
              We may use trusted third parties — such as our email provider, analytics tools, and Gumroad — to deliver
              our services. These providers process data in line with their own privacy policies.
            </p>

            <h2>6. Data retention</h2>
            <p>
              We retain personal information only for as long as necessary to fulfil the purposes described here or as
              required by law.
            </p>

            <h2>7. Your rights</h2>
            <p>
              Depending on where you live, you may have the right to access, correct, or delete your personal data, or to
              object to certain processing. To exercise these rights, contact us at{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>

            <h2>8. Security</h2>
            <p>
              We take reasonable measures to protect your information, but no method of transmission over the internet is
              fully secure.
            </p>

            <h2>9. Children&rsquo;s privacy</h2>
            <p>
              Our services are intended for medical students and professionals. We do not knowingly collect information
              from children under 16.
            </p>

            <h2>10. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be reflected by updating the
              &ldquo;last updated&rdquo; date at the top of this page.
            </p>

            <h2>11. Contact</h2>
            <p>
              Questions about this policy? Email us at{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
