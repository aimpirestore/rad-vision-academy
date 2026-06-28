import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { SocialManager } from "./SocialManager";

export const dynamic = "force-dynamic";

export default async function SocialAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("social_links").select("platform, url");

  const socials: Record<string, string> = {};
  for (const row of (data ?? []) as any[]) {
    socials[row.platform] = row.url;
  }

  return (
    <div>
      <PageHeader title="Social Media" description="Manage social media links shown in the footer and about page." />
      <SocialManager initial={socials as any} />
    </div>
  );
}
