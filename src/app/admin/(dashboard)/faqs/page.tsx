import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { FaqManager } from "./FaqManager";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="Manage frequently asked questions shown on the public site."
      />
      <FaqManager initialFaqs={data ?? []} />
    </div>
  );
}
