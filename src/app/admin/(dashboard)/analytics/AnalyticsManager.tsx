"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, Input, Textarea, Button } from "@/app/admin/_components/Form";

type AnalyticsSettings = {
  ga_measurement_id: string;
  gtm_id: string;
  custom_head_script: string;
  custom_body_script: string;
};

export function AnalyticsManager({ initial }: { initial: AnalyticsSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<AnalyticsSettings>(initial);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = await (await import("@/lib/supabase/client")).createClient();
    await supabase.from("analytics_settings").upsert(
      {
        id: "default",
        ga_measurement_id: form.ga_measurement_id,
        gtm_id: form.gtm_id,
        custom_head_script: form.custom_head_script,
        custom_body_script: form.custom_body_script,
      },
      { onConflict: "id" },
    );
    setSaving(false);
    toast.success("Analytics settings saved");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Analytics & Tracking</h2>
        <div className="space-y-4">
          <Field label="Google Analytics Measurement ID">
            <Input value={form.ga_measurement_id ?? ""} onChange={(e) => setForm({ ...form, ga_measurement_id: e.target.value })} placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Google Tag Manager ID">
            <Input value={form.gtm_id ?? ""} onChange={(e) => setForm({ ...form, gtm_id: e.target.value })} placeholder="GTM-XXXXXXX" />
          </Field>
          <Field label="Custom Head Script" hint="Injected into &lt;head&gt;. Use with caution.">
            <Textarea rows={5} value={form.custom_head_script ?? ""} onChange={(e) => setForm({ ...form, custom_head_script: e.target.value })} />
          </Field>
          <Field label="Custom Body Script" hint="Injected at end of &lt;body&gt;.">
            <Textarea rows={5} value={form.custom_body_script ?? ""} onChange={(e) => setForm({ ...form, custom_body_script: e.target.value })} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Analytics Settings"}</Button>
        </div>
      </div>
    </div>
  );
}
