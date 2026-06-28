import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { NavigationManager } from "./NavigationManager";

export const dynamic = "force-dynamic";

export default async function NavigationAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("navigation_items")
    .select("id, label, href, location, external, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader title="Navigation" description="Manage header and footer navigation links." />
      <NavigationManager initialItems={data ?? []} />
    </div>
  );
}
