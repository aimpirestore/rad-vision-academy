import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { SeoManager } from "./SeoManager";

export const dynamic = "force-dynamic";

export default async function SeoAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("seo_settings").select("*").single();

  return (
    <div>
      <PageHeader title="SEO" description="Configure meta tags, Open Graph, and canonical URLs." />
      <SeoManager initial={data ?? { global_title: "", global_description: "", canonical_base: "", twitter_card: "summary_large_image", og_image_url: "" }} />
    </div>
  );
}
