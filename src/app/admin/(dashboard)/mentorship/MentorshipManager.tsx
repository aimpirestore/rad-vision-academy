"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { EditorDrawer } from "@/app/admin/_components/EditorDrawer";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { Field, Input, Textarea, Select, Button } from "@/app/admin/_components/Form";
import { saveRecord, deleteRecord } from "@/app/admin/_actions/crud";

type Service = {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  icon: string;
  gumroad_url: string | null;
  sort_order: number;
};

const icons = ["compass", "graduation", "target", "message", "file", "calendar"];

export function MentorshipManager({ initialServices }: { initialServices: Service[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Service | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Service>>({});
  const [benefitsText, setBenefitsText] = useState("");

  function openNew() {
    setEditing(null);
    setForm({ title: "", description: "", benefits: [], icon: "compass", gumroad_url: "", sort_order: 0 });
    setBenefitsText("");
    setDrawerOpen(true);
  }
  function openEdit(s: Service) {
    setEditing(s);
    setForm(s);
    setBenefitsText((s.benefits ?? []).join("\n"));
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.title?.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const result = await saveRecord("mentorship_services", {
      ...(editing?.id ? { id: editing.id } : {}),
      title: form.title,
      description: form.description,
      benefits: benefitsText.split("\n").map((b) => b.trim()).filter(Boolean),
      icon: form.icon,
      gumroad_url: form.gumroad_url,
      sort_order: form.sort_order ?? 0,
    }, { revalidatePaths: ["/mentorship", "/admin/mentorship"], logLabel: "mentorship.saved" });
    setSaving(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success(editing ? "Service updated" : "Service created");
    setDrawerOpen(false);
    router.refresh();
  }

  async function handleDelete(s: Service) {
    const result = await deleteRecord("mentorship_services", s.id, { revalidatePaths: ["/mentorship", "/admin/mentorship"] });
    if (result.error) { toast.error(result.error); return; }
    toast.success("Service deleted");
    router.refresh();
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={openNew}><Plus className="h-4 w-4" /> New Service</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialServices.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-slate-400">No services yet.</p>
        )}
        {initialServices.map((s) => (
          <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red text-xs font-bold uppercase">
                {s.icon.slice(0, 2)}
              </span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setConfirmDelete(s)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{s.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{s.description}</p>
          </div>
        ))}
      </div>

      <EditorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Edit Service" : "New Service"}
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></>}>
        <Field label="Title" required>
          <Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Outcomes / Benefits" hint="One per line.">
          <Textarea rows={5} value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} placeholder={"Personalized study plan\nMock interview practice\nCV review"} />
        </Field>
        <Field label="Icon" hint="Determines the lucide icon shown.">
          <Select value={form.icon ?? "compass"} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            {icons.map((i) => <option key={i} value={i}>{i}</option>)}
          </Select>
        </Field>
        <Field label="Gumroad URL" hint="Optional booking link.">
          <Input value={form.gumroad_url ?? ""} onChange={(e) => setForm({ ...form, gumroad_url: e.target.value })} placeholder="https://radvisionacademy.gumroad.com/l/..." />
        </Field>
        <Field label="Sort order">
          <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </Field>
      </EditorDrawer>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete service?"
        message={`"${confirmDelete?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
