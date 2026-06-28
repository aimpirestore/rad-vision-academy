"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Eye, EyeOff, Search } from "lucide-react";
import { EditorDrawer } from "@/app/admin/_components/EditorDrawer";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { Field, Input, Textarea, Select, Button } from "@/app/admin/_components/Form";
import { SlugField } from "@/app/admin/_components/SlugField";
import { saveRecord, deleteRecord, toggleRecordStatus } from "@/app/admin/_actions/crud";

type Product = {
  id: string;
  title: string;
  slug: string;
  category: "eBook" | "Question Bank" | "Reporting Template" | "Study Notes" | "Course" | "Bundle";
  blurb: string;
  description: string | null;
  price: string;
  format: string;
  gumroad_url: string | null;
  status: "published" | "draft" | "archived";
  sort_order: number;
};

const categories = ["eBook", "Question Bank", "Reporting Template", "Study Notes", "Course", "Bundle"] as const;

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});
  const [titleRef, setTitleRef] = useState("");

  const filtered = initialProducts.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()),
  );

  function openNew() {
    setEditing(null);
    setForm({ title: "", slug: "", category: "eBook", blurb: "", description: "", price: "$49", format: "PDF", gumroad_url: "", status: "draft" });
    setTitleRef("");
    setDrawerOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm(p);
    setTitleRef(p.title);
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.title?.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const result = await saveRecord("products", {
      ...(editing?.id ? { id: editing.id } : {}),
      title: form.title,
      slug: form.slug || form.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      category: form.category,
      blurb: form.blurb,
      description: form.description,
      price: form.price,
      format: form.format,
      gumroad_url: form.gumroad_url,
      status: form.status,
    }, { revalidatePaths: ["/store", "/", "/admin/products"], logLabel: "products.saved" });
    setSaving(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success(editing ? "Product updated" : "Product created");
    setDrawerOpen(false);
    router.refresh();
  }

  async function handleDelete(p: Product) {
    const result = await deleteRecord("products", p.id, { revalidatePaths: ["/store", "/admin/products"] });
    if (result.error) { toast.error(result.error); return; }
    toast.success("Product deleted");
    router.refresh();
  }

  async function handleToggleStatus(p: Product) {
    const newStatus = p.status === "published" ? "draft" : "published";
    const result = await toggleRecordStatus("products", p.id, newStatus, { revalidatePaths: ["/store", "/admin/products"] });
    if (result.error) { toast.error(result.error); return; }
    toast.success(`Product ${newStatus === "published" ? "published" : "unpublished"}`);
    router.refresh();
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-800" />
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> New Product</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Category</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">No products found.</td></tr>}
            {filtered.map((p) => (
              <tr key={p.id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{p.title}</p>
                  <p className="text-xs text-slate-400">/{p.slug}</p>
                </td>
                <td className="hidden px-4 py-3 text-sm text-slate-600 dark:text-slate-300 md:table-cell">{p.category}</td>
                <td className="hidden px-4 py-3 text-sm text-slate-600 dark:text-slate-300 md:table-cell">{p.price}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleToggleStatus(p)} title={p.status === "published" ? "Unpublish" : "Publish"} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                      {p.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => openEdit(p)} title="Edit" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirmDelete(p)} title="Delete" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Edit Product" : "New Product"}
        footer={<><Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></>}>
        <Field label="Title" required>
          <Input value={form.title ?? ""} onChange={(e) => { setForm({ ...form, title: e.target.value }); setTitleRef(e.target.value); }} />
        </Field>
        <Field label="Slug">
          <SlugField value={form.slug ?? ""} onChange={(slug) => setForm({ ...form, slug })} titleRef={{ current: titleRef }} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <Select value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Price">
            <Input value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$49" />
          </Field>
        </div>
        <Field label="Format" hint="e.g., PDF, 320 pages">
          <Input value={form.format ?? ""} onChange={(e) => setForm({ ...form, format: e.target.value })} />
        </Field>
        <Field label="Blurb">
          <Textarea rows={2} value={form.blurb ?? ""} onChange={(e) => setForm({ ...form, blurb: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Gumroad URL" hint="Specific product page. Blank = storefront.">
          <Input value={form.gumroad_url ?? ""} onChange={(e) => setForm({ ...form, gumroad_url: e.target.value })} placeholder="https://radvisionacademy.gumroad.com/l/..." />
        </Field>
        <Field label="Status">
          <Select value={form.status ?? "draft"} onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
      </EditorDrawer>

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} title="Delete product?" message={`"${confirmDelete?.title}" will be permanently deleted.`} confirmLabel="Delete" danger />
    </>
  );
}
