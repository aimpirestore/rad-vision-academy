"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, Input, Button } from "@/app/admin/_components/Form";
import { saveRecord } from "@/app/admin/_actions/crud";

type Social = { twitter: string; linkedin: string; instagram: string; youtube: string; tiktok?: string; facebook?: string };

export function SocialManager({ initial }: { initial: Social }) {
  const router = useRouter();
  const [form, setForm] = useState<Social>(initial);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = await (await import("@/lib/supabase/client")).createClient();
    await supabase.from("social_links").upsert(
      { platform: "twitter", url: form.twitter, icon: "twitter" },
      { onConflict: "platform" },
    );
    await supabase.from("social_links").upsert(
      { platform: "linkedin", url: form.linkedin, icon: "linkedin" },
      { onConflict: "platform" },
    );
    await supabase.from("social_links").upsert(
      { platform: "instagram", url: form.instagram, icon: "instagram" },
      { onConflict: "platform" },
    );
    await supabase.from("social_links").upsert(
      { platform: "youtube", url: form.youtube, icon: "youtube" },
      { onConflict: "platform" },
    );
    if (form.tiktok) {
      await supabase.from("social_links").upsert({ platform: "tiktok", url: form.tiktok, icon: "tiktok" }, { onConflict: "platform" });
    }
    setSaving(false);
    toast.success("Social links saved");
    router.refresh();
  }

  const fields = [
    { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/..." },
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/..." },
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/..." },
    { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/..." },
  ] as const;

  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Social Media Links</h2>
        <div className="space-y-4">
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              <Input value={(form as any)[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} />
            </Field>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Social Links"}</Button>
        </div>
      </div>
    </div>
  );
}
