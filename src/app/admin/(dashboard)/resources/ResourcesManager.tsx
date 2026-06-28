"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { EditorDrawer } from "@/app/admin/_components/EditorDrawer";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { Field, Input, Textarea, Select, Button } from "@/app/admin/_components/Form";
import { SlugField } from "@/app/admin/_components/SlugField";
import { saveRecord, deleteRecord } from "@/app/admin/_actions/crud";

type Resource = {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  file_url: string | null;
  free: boolean;
  sort_order: number;
};

const types = ["PDF", "Notes", "Template", "Guide", "Toolkit"];

export function ResourcesManager({ initialResources }: { initialResources: Resource[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Resource | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Resource | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Resource>>({});
  const [titleRef, setTitleRef] = useState("");

  function openNew() {
    setEditing(null);
    setForm({ title: "", slug: "", type: "PDF", description: "", file_url: "", free: true, sort_order: 0 });
    setTitleRef("");
    setDrawerOpen(true);
  }
  function openEdit(r: Resource) {
    setEditing(r);
    setForm(r);
    setTitleRef(r.title);
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.title?.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const result = await saveRecord("resources", {
      ...(editing?.id ? { id: editing.id } : {}),
      title: form.title,
      slug: form.slug || form.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      type: form.type,
      description: form.description,
      file_url: form.file_url,
      free: form.free,
      sort_order: form.sort_order ?? 0,
    }, { revalidatePaths: ["/resources", "/admin/resources"], logLabel: "resources.saved" });
    setSaving(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success(editing ? "Resource updated" : "Resource created");
    setDrawerOpen(false);
    router.refresh();
  }

  async function handleDelete(r: Resource) {
    const result = await deleteRecord("resources", r.id, { revalidatePaths: ["/resources", "/admin/resources"] });
    if (result.error) { toast.error(result.error); return; }
    toast.success("Resource deleted");
    router.refresh();
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={openNew}><Plus className="h-4 w-4" /> New Resource</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialResources.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-slate-400">No resources yet.</p>
        )}
        {initialResources.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <span className="rounded-full bg-brand-red/10 px-2.5 py-1 text-[10px] font-bold uppercase text-brand-red">{r.type}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(r)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => setConfirmDelete(r)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-400 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{r.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{r.description}</p>
            <div className="mt-3 flex items-center gap-2">
              {r.free && <span className="text-[10px] font-bold text-emerald-600">FREE</span>}
              {r.file_url && <span className="text-[10px] text-slate-400 truncate">{r.file_url}</span>}
            </div>
          </div>
        ))}
      </div>

      <EditorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Edit Resource" : "New Resource"}
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></>}>
        <Field label="Title" required>
          <Input value={form.title ?? ""} onChange={(e) => { setForm({ ...form, title: e.target.value }); setTitleRef(e.target.value); }} />
        </Field>
        <Field label="Slug">
          <SlugField value={form.slug ?? ""} onChange={(slug) => setForm({ ...form, slug })} titleRef={{ current: titleRef }} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            <Select value={form.type ?? "PDF"} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Sort order">
            <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
          </Field>
        </div>
        <Field label="Description">
          <Textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="File URL" hint="Link to the file (PDF, etc.) or Gumroad product page.">
          <Input value={form.file_url ?? ""} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="https://..." />
        </Field>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.free ?? true} onChange={(e) => setForm({ ...form, free: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-red focus:ring-brand-red" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Free download</span>
        </label>
      </EditorDrawer>

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} title="Delete resource?" message={`"${confirmDelete?.title}" will be permanently deleted.`} confirmLabel="Delete" danger />
    </>
  );
}
