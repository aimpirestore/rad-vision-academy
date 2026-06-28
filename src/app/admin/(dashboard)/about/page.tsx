import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { AboutManager } from "./AboutManager";

export const dynamic = "force-dynamic";

export default async function AboutAdminPage() {
  const supabase = await createServerSupabaseClient();
  const [foundersRes, valuesRes] = await Promise.all([
    supabase
      .from("founders")
      .select("id, name, role, bio, initials, image_url, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("brand_values")
      .select("id, title, text, icon, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <div>
      <PageHeader
        title="Founders & Values"
        description="Manage the people behind RAD Vision Academy and the core brand values shown on the About page."
      />
      <AboutManager
        initialFounders={foundersRes.data ?? []}
        initialValues={valuesRes.data ?? []}
      />
    </div>
  );
}
