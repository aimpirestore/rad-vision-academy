import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { ProductsManager } from "./ProductsManager";

export const dynamic = "force-dynamic";

export default async function ProductsAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("id, title, slug, category, blurb, description, price, format, gumroad_url, status, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage digital products: eBooks, question banks, templates, and bundles."
      />
      <ProductsManager initialProducts={data ?? []} />
    </div>
  );
}
