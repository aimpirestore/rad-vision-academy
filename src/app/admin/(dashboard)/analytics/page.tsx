import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { AnalyticsManager } from "./AnalyticsManager";

export const dynamic = "force-dynamic";

export default async function AnalyticsAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("analytics_settings").select("*").single();

  return (
    <div>
      <PageHeader title="Analytics" description="Configure tracking scripts and measurement IDs." />
      <AnalyticsManager initial={data ?? { ga_measurement_id: "", gtm_id: "", custom_head_script: "", custom_body_script: "" }} />
    </div>
  );
}
