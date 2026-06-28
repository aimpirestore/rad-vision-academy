"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { EditorDrawer } from "@/app/admin/_components/EditorDrawer";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { Field, Input, Textarea, Button } from "@/app/admin/_components/Form";
import { Card } from "@/app/admin/_components/ui";
import { saveRecord, deleteRecord } from "@/app/admin/_actions/crud";

type Founder = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  image_url: string;
  sort_order: number;
};

type BrandValue = {
  id: string;
  title: string;
  text: string;
  icon: string;
  sort_order: number;
};

type Item = Founder | BrandValue;
type Mode = "founders" | "values";

export function AboutManager({
  initialFounders,
  initialValues,
}: {
  initialFounders: Founder[];
  initialValues: BrandValue[];
}) {
  const router = useRouter();
  const [founders, setFounders] = useState<Founder[]>(initialFounders);
  const [values, setValues] = useState<BrandValue[]>(initialValues);
  const [mode, setMode] = useState<Mode>("founders");
  const [editing, setEditing] = useState<Item | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});

  const items = mode === "founders" ? founders : values;

  function openNew() {
    setEditing(null);
    setForm({ sort_order: items.length });
    setDrawerOpen(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setForm(item as unknown as Record<string, unknown>);
    setDrawerOpen(true);
  }

  async function handleSave() {
    const table = mode === "founders" ? "founders" : "brand_values";
    if (mode === "founders") {
      if (!String(form.name ?? "").trim()) {
        toast.error("Name is required");
        return;
      }
    } else {
      if (!String(form.title ?? "").trim()) {
        toast.error("Title is required");
        return;
      }
    }

    setSaving(true);
    const payload = { ...form };
    if (editing?.id) payload.id = editing.id;

    const result = await saveRecord(table, payload, {
      revalidatePaths: ["/about", "/admin/about"],
      logLabel: `${table}.saved`,
    });
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "Updated" : "Created");
    setDrawerOpen(false);
    router.refresh();
  }

  async function handleDelete(item: Item) {
    const table = mode === "founders" ? "founders" : "brand_values";
    const result = await deleteRecord(table, item.id, {
      revalidatePaths: ["/about", "/admin/about"],
    });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Deleted");
    router.refresh();
  }

  return (
    <>
      {/* Tab switcher */}
      <div className="mb-6 inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
        <button
          onClick={() => setMode("founders")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === "founders"
              ? "bg-brand-red text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
          }`}
        >
          Founders ({founders.length})
        </button>
        <button
          onClick={() => setMode("values")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === "values"
              ? "bg-brand-red text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
          }`}
        >
          Brand Values ({values.length})
        </button>
      </div>

      <div className="mb-6 flex justify-end">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" />{" "}
          {mode === "founders" ? "New Founder" : "New Value"}
        </Button>
      </div>

      {/* Founders grid */}
      {mode === "founders" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...founders]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((founder) => (
              <Card key={founder.id} className="group relative">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                    {founder.initials ||
                      founder.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {founder.name}
                    </p>
                    <p className="text-xs text-brand-red">{founder.role}</p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                      {founder.bio}
                    </p>
                  </div>
                </div>
                <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(founder)}
                    title="Edit"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(founder)}
                    title="Delete"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Values list */}
      {mode === "values" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...values]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((value) => (
              <Card key={value.id} className="group relative">
                <div className="mb-2 text-2xl">{value.icon || "✨"}</div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {value.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                  {value.text}
                </p>
                <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(value)}
                    title="Edit"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(value)}
                    title="Delete"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Editor */}
      <EditorDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          editing
            ? `Edit ${mode === "founders" ? "Founder" : "Value"}`
            : `New ${mode === "founders" ? "Founder" : "Value"}`
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        {mode === "founders" ? (
          <>
            <Field label="Name" required>
              <Input
                value={String(form.name ?? "")}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Jane Doe"
              />
            </Field>
            <Field label="Role / Title">
              <Input
                value={String(form.role ?? "")}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Co-Founder & Lead Instructor"
              />
            </Field>
            <Field label="Initials" hint="2-3 letters for the avatar fallback.">
              <Input
                value={String(form.initials ?? "")}
                onChange={(e) =>
                  setForm({ ...form, initials: e.target.value })
                }
                placeholder="JD"
              />
            </Field>
            <Field label="Image URL" hint="Optional. Leave blank to use initials.">
              <Input
                value={String(form.image_url ?? "")}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                placeholder="/team/jane.jpg"
              />
            </Field>
            <Field label="Bio">
              <Textarea
                rows={5}
                value={String(form.bio ?? "")}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Board-certified radiologist with 10+ years..."
              />
            </Field>
            <Field label="Sort order">
              <Input
                type="number"
                value={String(form.sort_order ?? 0)}
                onChange={(e) =>
                  setForm({ ...form, sort_order: Number(e.target.value) })
                }
              />
            </Field>
          </>
        ) : (
          <>
            <Field label="Title" required>
              <Input
                value={String(form.title ?? "")}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Evidence-Based Teaching"
              />
            </Field>
            <Field label="Icon" hint="An emoji or icon name.">
              <Input
                value={String(form.icon ?? "")}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="🎯"
              />
            </Field>
            <Field label="Description">
              <Textarea
                rows={4}
                value={String(form.text ?? "")}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Every concept is grounded in current guidelines..."
              />
            </Field>
            <Field label="Sort order">
              <Input
                type="number"
                value={String(form.sort_order ?? 0)}
                onChange={(e) =>
                  setForm({ ...form, sort_order: Number(e.target.value) })
                }
              />
            </Field>
          </>
        )}
      </EditorDrawer>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title={`Delete ${mode === "founders" ? "founder" : "value"}?`}
        message={`"${
          mode === "founders"
            ? (confirmDelete as Founder)?.name
            : (confirmDelete as BrandValue)?.title
        }" will be permanently deleted.`}
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
