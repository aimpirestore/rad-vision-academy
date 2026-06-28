import type { Metadata } from "next";
import { ExternalLink, ShieldCheck, RefreshCw, Headset } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { StoreExplorer } from "@/components/sections/StoreExplorer";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getProducts, getFaqs } from "@/lib/data";
import { GUMROAD_STORE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Store — eBooks, Question Banks & Templates",
  description:
    "Premium radiology digital products from RAD Vision Academy — eBooks, question banks, reporting templates, study notes, and money-saving bundles. Secure checkout via Gumroad.",
  alternates: { canonical: "/store" },
};

export default async function StorePage() {
  const [products, faqs] = await Promise.all([getProducts(), getFaqs()]);

  return (
    <>
      <PageHeader
        eyebrow="Store"
        crumbs={[{ label: "Home", href: "/" }, { label: "Store" }]}
        title={<>Digital products that move your career forward</>}
        description="eBooks, question banks, reporting templates, and study notes — created by practising radiologists. All purchases are handled securely by Gumroad."
      >
        <a
          href={GUMROAD_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-brand-black px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
        >
          Open official store <ExternalLink className="h-4 w-4" />
        </a>
      </PageHeader>

      <StoreExplorer products={products} />

      {/* Trust strip */}
      <section className="pb-12">
        <div className="container-default">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Secure checkout", d: "All transactions processed securely by Gumroad." },
              { icon: RefreshCw, t: "Lifetime updates", d: "Free updates to any product you purchase, forever." },
              { icon: Headset, t: "Real support", d: "Questions? Our team replies within a business day." },
            ].map((f) => (
              <div key={f.t} className="surface flex items-start gap-3 p-5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/[0.08] text-brand-red">
                  <f.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-brand-black">{f.t}</h3>
                  <p className="mt-0.5 text-xs text-brand-dark-grey">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ faqs={faqs} />
      <CTAFinal />
    </>
  );
}
