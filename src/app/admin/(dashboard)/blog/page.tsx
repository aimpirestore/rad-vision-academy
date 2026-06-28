import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";
import { BlogManager } from "./BlogManager";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, category, author, body, status, featured, reading_time, published_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        description="Create and manage articles, case studies, and career guidance."
      />
      <BlogManager initialPosts={data ?? []} />
    </div>
  );
}
