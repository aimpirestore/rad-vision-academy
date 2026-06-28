import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { MentorshipManager } from "./MentorshipManager";

export const dynamic = "force-dynamic";

export default async function MentorshipAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("mentorship_services")
    .select("id, title, description, benefits, icon, gumroad_url, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader title="Mentorship" description="Manage mentorship services and booking links." />
      <MentorshipManager initialServices={data ?? []} />
    </div>
  );
}
