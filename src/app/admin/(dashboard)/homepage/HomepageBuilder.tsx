"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, Input, Textarea, Button } from "@/app/admin/_components/Form";
import { saveRecord } from "@/app/admin/_actions/crud";

type HomepageSettings = Record<string, any>;

const fields = [
  { key: "hero_title", label: "Hero Title", type: "text" as const },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" as const },
  { key: "hero_cta_text", label: "Hero CTA Text", type: "text" as const },
  { key: "hero_cta_href", label: "Hero CTA Link", type: "text" as const },
  { key: "featured_courses_count", label: "Featured Courses Count", type: "number" as const },
  { key: "show_testimonials", label: "Show Testimonials", type: "text" as const },
  { key: "show_stats", label: "Show Stats", type: "text" as const },
  { key: "show_faq", label: "Show FAQ", type: "text" as const },
];

export function HomepageBuilder({ initialSettings }: { initialSettings: HomepageSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<HomepageSettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);

    // Upsert each setting row
    const supabase = await (await import("@/lib/supabase/client")).createClient();
    for (const [key, value] of Object.entries(form)) {
      await supabase.from("homepage_settings").upsert(
        { key, value },
        { onConflict: "key" },
      );
    }

    // Log
    await (await import("@/app/admin/_actions/crud")).saveRecord(
      "homepage_settings",
      { id: undefined, key: "batch_update", value: form },
      { revalidatePaths: ["/"], logLabel: "homepage.updated" },
    ).catch(() => {});

    setSaving(false);
    toast.success("Homepage settings saved");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Hero Section</h2>
        <div className="space-y-4">
          <Field label="Hero Title">
            <Input value={form.hero_title ?? ""} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} placeholder="World-Class Radiology Education" />
          </Field>
          <Field label="Hero Subtitle">
            <Textarea rows={2} value={form.hero_subtitle ?? ""} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA Text">
              <Input value={form.hero_cta_text ?? ""} onChange={(e) => setForm({ ...form, hero_cta_text: e.target.value })} placeholder="Explore Courses" />
            </Field>
            <Field label="CTA Link">
              <Input value={form.hero_cta_href ?? ""} onChange={(e) => setForm({ ...form, hero_cta_href: e.target.value })} placeholder="/courses" />
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Section Visibility</h2>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Featured Courses Count">
            <Input type="number" value={form.featured_courses_count ?? 3} onChange={(e) => setForm({ ...form, featured_courses_count: parseInt(e.target.value) || 3 })} />
          </Field>
          <Field label="Show Testimonials">
            <Input value={form.show_testimonials ?? "true"} onChange={(e) => setForm({ ...form, show_testimonials: e.target.value })} placeholder="true / false" />
          </Field>
          <Field label="Show Stats">
            <Input value={form.show_stats ?? "true"} onChange={(e) => setForm({ ...form, show_stats: e.target.value })} placeholder="true / false" />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Homepage Settings"}</Button>
      </div>
    </div>
  );
}
