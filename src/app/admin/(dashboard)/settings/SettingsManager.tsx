"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, Input, Textarea, Button } from "@/app/admin/_components/Form";

type SiteSettings = {
  brand_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  footer_copyright: string;
  newsletter_text: string;
  logo_url: string;
  favicon_url: string;
};

export function SettingsManager({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = await (await import("@/lib/supabase/client")).createClient();
    await supabase.from("site_settings").upsert(
      {
        id: "default",
        brand_name: form.brand_name,
        tagline: form.tagline,
        email: form.email,
        phone: form.phone,
        address: form.address,
        footer_copyright: form.footer_copyright,
        newsletter_text: form.newsletter_text,
        logo_url: form.logo_url,
        favicon_url: form.favicon_url,
      },
      { onConflict: "id" },
    );
    setSaving(false);
    toast.success("Site settings saved");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Brand Identity</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Brand Name" required>
              <Input value={form.brand_name ?? ""} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <Input value={form.tagline ?? ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <Input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
          </div>
          <Field label="Address">
            <Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Logo URL">
              <Input value={form.logo_url ?? ""} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="/logo.svg" />
            </Field>
            <Field label="Favicon URL">
              <Input value={form.favicon_url ?? ""} onChange={(e) => setForm({ ...form, favicon_url: e.target.value })} placeholder="/favicon.svg" />
            </Field>
          </div>
        </div>
      </div>

      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Footer & Newsletter</h2>
        <div className="space-y-4">
          <Field label="Footer Copyright">
            <Textarea rows={2} value={form.footer_copyright ?? ""} onChange={(e) => setForm({ ...form, footer_copyright: e.target.value })} placeholder="RAD Vision Academy — World-Class Radiology Education." />
          </Field>
          <Field label="Newsletter Description">
            <Textarea rows={2} value={form.newsletter_text ?? ""} onChange={(e) => setForm({ ...form, newsletter_text: e.target.value })} placeholder="Weekly high-yield radiology pearls..." />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
      </div>
    </div>
  );
}
