import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { HomepageBuilder } from "./HomepageBuilder";

export const dynamic = "force-dynamic";

export default async function HomepageAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("homepage_settings").select("*").order("key", { ascending: true });

  // Convert rows to key-value object
  const settings: Record<string, any> = {};
  for (const row of (data ?? []) as any[]) {
    settings[row.key] = row.value;
  }

  return (
    <div>
      <PageHeader title="Homepage Builder" description="Configure the homepage hero, featured sections, and CTAs." />
      <HomepageBuilder initialSettings={settings} />
    </div>
  );
}
