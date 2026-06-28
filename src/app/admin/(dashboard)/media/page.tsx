import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/app/admin/_components/ui";
import { MediaLibrary } from "./MediaLibrary";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  const supabase = createClient();
  const { data } = await supabase.storage.from("media").list("uploads", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  const files = (data ?? []).map((f) => {
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(`uploads/${f.name}`);
    return {
      id: f.name,
      name: f.name,
      publicUrl: urlData.publicUrl,
      size: f.metadata?.size ?? 0,
      created_at: f.created_at ?? "",
    };
  });

  return (
    <div>
      <PageHeader title="Media Library" description="Upload, manage, and copy URLs for images and documents." />
      <MediaLibrary initialFiles={files} />
    </div>
  );
}
