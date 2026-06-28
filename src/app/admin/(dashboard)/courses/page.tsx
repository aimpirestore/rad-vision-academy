import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { CoursesManager } from "./CoursesManager";

export const dynamic = "force-dynamic";

export default async function CoursesAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, slug, instructor, duration, level, category, blurb, description, highlights, price, gumroad_url, status, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Manage radiology courses, pricing, and Gumroad links."
      />
      <CoursesManager initialCourses={data ?? []} />
    </div>
  );
}
