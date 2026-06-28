import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { ResourcesManager } from "./ResourcesManager";

export const dynamic = "force-dynamic";

export default async function ResourcesAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("resources")
    .select("id, title, slug, type, description, file_url, free, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader title="Resources" description="Manage free downloadable resources and guides." />
      <ResourcesManager initialResources={data ?? []} />
    </div>
  );
}
