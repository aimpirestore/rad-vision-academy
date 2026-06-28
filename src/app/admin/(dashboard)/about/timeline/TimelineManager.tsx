"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Layers } from "lucide-react";
import { EditorDrawer } from "@/app/admin/_components/EditorDrawer";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { Field, Input, Textarea, Button } from "@/app/admin/_components/Form";
import { EmptyState } from "@/app/admin/_components/ui";
import { saveRecord, deleteRecord } from "@/app/admin/_actions/crud";

type Milestone = {
  id: string;
  year: string;
  title: string;
  text: string;
  sort_order: number;
};

export function TimelineManager({
  initialTimeline,
}: {
  initialTimeline: Milestone[];
}) {
  const router = useRouter();
  const [timeline, setTimeline] = useState<Milestone[]>(initialTimeline);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Milestone | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Milestone>>({});

  function openNew() {
    setEditing(null);
    setForm({ year: "", title: "", text: "", sort_order: timeline.length });
    setDrawerOpen(true);
  }

  function openEdit(item: Milestone) {
    setEditing(item);
    setForm(item);
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.year?.trim()) {
      toast.error("Year is required");
      return;
    }
    if (!form.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const result = await saveRecord(
      "timeline",
      {
        ...(editing?.id ? { id: editing.id } : {}),
        year: form.year,
        title: form.title,
        text: form.text ?? "",
        sort_order: form.sort_order ?? timeline.length,
      },
      { revalidatePaths: ["/about", "/admin/about/timeline"], logLabel: "timeline.saved" },
    );
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "Milestone updated" : "Milestone created");
    setDrawerOpen(false);
    router.refresh();
  }

  async function handleDelete(item: Milestone) {
    const result = await deleteRecord("timeline", item.id, {
      revalidatePaths: ["/about", "/admin/about/timeline"],
    });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Milestone deleted");
    router.refresh();
  }

  const sorted = [...timeline].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New Milestone
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No timeline milestones"
          description="Add key milestones to tell the story of RAD Vision Academy."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add a milestone
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((item, i) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex h-12 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-red/10 text-center">
                <span className="text-sm font-bold text-brand-red">
                  {item.year}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </p>
                  <span className="text-xs text-slate-400">#{i + 1}</span>
                </div>
                {item.text && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.text}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(item)}
                  title="Edit"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setConfirmDelete(item)}
                  title="Delete"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditorDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? "Edit Milestone" : "New Milestone"}
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
        <Field label="Year" required>
          <Input
            value={form.year ?? ""}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            placeholder="2024"
          />
        </Field>
        <Field label="Title" required>
          <Input
            value={form.title ?? ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Launched our flagship course"
          />
        </Field>
        <Field label="Description">
          <Textarea
            rows={4}
            value={form.text ?? ""}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Describe what happened in this milestone."
          />
        </Field>
        <Field label="Sort order" hint="Lower numbers appear first.">
          <Input
            type="number"
            value={String(form.sort_order ?? 0)}
            onChange={(e) =>
              setForm({ ...form, sort_order: Number(e.target.value) })
            }
          />
        </Field>
      </EditorDrawer>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete milestone?"
        message={`"${confirmDelete?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
