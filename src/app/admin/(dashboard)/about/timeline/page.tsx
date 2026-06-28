import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { TimelineManager } from "./TimelineManager";

export const dynamic = "force-dynamic";

export default async function TimelineAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("timeline")
    .select("id, year, title, text, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Timeline"
        description="Manage the milestones shown in the About page timeline."
      />
      <TimelineManager initialTimeline={data ?? []} />
    </div>
  );
}
