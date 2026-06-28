"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, Input, Select, Button } from "@/app/admin/_components/Form";

type SeoSettings = {
  global_title: string;
  global_description: string;
  canonical_base: string;
  twitter_card: string;
  og_image_url: string;
};

export function SeoManager({ initial }: { initial: SeoSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<SeoSettings>(initial);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = await (await import("@/lib/supabase/client")).createClient();
    await supabase.from("seo_settings").upsert(
      {
        id: "default",
        global_title: form.global_title,
        global_description: form.global_description,
        canonical_base: form.canonical_base,
        twitter_card: form.twitter_card,
        og_image_url: form.og_image_url,
      },
      { onConflict: "id" },
    );
    setSaving(false);
    toast.success("SEO settings saved");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">SEO Configuration</h2>
        <div className="space-y-4">
          <Field label="Global Title Template">
            <Input value={form.global_title ?? ""} onChange={(e) => setForm({ ...form, global_title: e.target.value })} placeholder="%s — RAD Vision Academy" />
          </Field>
          <Field label="Global Description">
            <Input value={form.global_description ?? ""} onChange={(e) => setForm({ ...form, global_description: e.target.value })} />
          </Field>
          <Field label="Canonical Base URL">
            <Input value={form.canonical_base ?? ""} onChange={(e) => setForm({ ...form, canonical_base: e.target.value })} placeholder="https://radvisionacademy.com" />
          </Field>
          <Field label="Twitter Card Type">
            <Select value={form.twitter_card ?? "summary_large_image"} onChange={(e) => setForm({ ...form, twitter_card: e.target.value })}>
              <option value="summary">summary</option>
              <option value="summary_large_image">summary_large_image</option>
            </Select>
          </Field>
          <Field label="OG Image URL">
            <Input value={form.og_image_url ?? ""} onChange={(e) => setForm({ ...form, og_image_url: e.target.value })} placeholder="https://..." />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save SEO Settings"}</Button>
        </div>
      </div>
    </div>
  );
}
