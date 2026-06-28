"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { Field, Input, Select, Button } from "@/app/admin/_components/Form";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { saveRecord, deleteRecord } from "@/app/admin/_actions/crud";

type NavItem = { id: string; label: string; href: string; location: string; external: boolean; sort_order: number };

export function NavigationManager({ initialItems }: { initialItems: NavItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<NavItem[]>(initialItems);
  const [editing, setEditing] = useState<NavItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<NavItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<NavItem>>({});

  const headerItems = items.filter((i) => i.location === "header");
  const footerItems = items.filter((i) => i.location === "footer");

  function openNew(location: string) {
    setEditing(null);
    setForm({ label: "", href: "/", location, external: false, sort_order: items.filter((i) => i.location === location).length });
    setShowForm(true);
  }
  function openEdit(item: NavItem) {
    setEditing(item);
    setForm(item);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.label?.trim() || !form.href?.trim()) { toast.error("Label and href are required"); return; }
    setSaving(true);
    const result = await saveRecord("navigation_items", {
      ...(editing?.id ? { id: editing.id } : {}),
      label: form.label,
      href: form.href,
      location: form.location,
      external: form.external ?? false,
      sort_order: form.sort_order ?? 0,
    }, { revalidatePaths: ["/", "/admin/navigation"], logLabel: "navigation.saved" });
    setSaving(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success(editing ? "Item updated" : "Item added");
    setShowForm(false);
    router.refresh();
  }

  async function handleDelete(item: NavItem) {
    const result = await deleteRecord("navigation_items", item.id, { revalidatePaths: ["/", "/admin/navigation"] });
    if (result.error) { toast.error(result.error); return; }
    toast.success("Item deleted");
    router.refresh();
  }

  function renderGroup(title: string, location: string, list: NavItem[]) {
    return (
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
          <Button size="sm" onClick={() => openNew(location)}><Plus className="h-3.5 w-3.5" /> Add</Button>
        </div>
        <div className="space-y-2">
          {list.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No items.</p>}
          {list.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <GripVertical className="h-4 w-4 text-slate-300" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.label}</p>
                <p className="text-xs text-slate-400 truncate">{item.href}{item.external ? " (external)" : ""}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(item)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => setConfirmDelete(item)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-400 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {renderGroup("Header Navigation", "header", headerItems)}
      {renderGroup("Footer Navigation", "footer", footerItems)}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{editing ? "Edit" : "Add"} Navigation Item</h2>
            <Field label="Label" required>
              <Input value={form.label ?? ""} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Courses" />
            </Field>
            <Field label="URL" required>
              <Input value={form.href ?? ""} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/courses" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Location">
                <Select value={form.location ?? "header"} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                </Select>
              </Field>
              <Field label="Sort Order">
                <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </Field>
            </div>
            <label className="mb-4 flex items-center gap-2">
              <input type="checkbox" checked={form.external ?? false} onChange={(e) => setForm({ ...form, external: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-red focus:ring-brand-red" />
              <span className="text-sm text-slate-700 dark:text-slate-300">External link (opens new tab)</span>
            </label>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} title="Delete item?" message={`"${confirmDelete?.label}" will be removed from navigation.`} confirmLabel="Delete" danger />
    </>
  );
}
