import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { SettingsManager } from "./SettingsManager";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("site_settings").select("*").single();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure site-wide brand settings, contact info, and footer content."
      />
      <SettingsManager
        initial={
          data ?? {
            id: "default",
            brand_name: "RAD Vision Academy",
            tagline: "",
            email: "",
            phone: "",
            address: "",
            footer_copyright: "",
            newsletter_text: "",
            logo_url: "",
            favicon_url: "",
          }
        }
      />
    </div>
  );
}
