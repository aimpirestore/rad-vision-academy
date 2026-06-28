"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, GripVertical, HelpCircle } from "lucide-react";
import { EditorDrawer } from "@/app/admin/_components/EditorDrawer";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { Field, Textarea, Input, Button } from "@/app/admin/_components/Form";
import { EmptyState } from "@/app/admin/_components/ui";
import { saveRecord, deleteRecord, reorderRecords } from "@/app/admin/_actions/crud";

type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export function FaqManager({ initialFaqs }: { initialFaqs: Faq[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Faq | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Faq>>({});

  function openNew() {
    setEditing(null);
    setForm({
      question: "",
      answer: "",
      sort_order: faqs.length,
    });
    setDrawerOpen(true);
  }

  function openEdit(faq: Faq) {
    setEditing(faq);
    setForm(faq);
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.question?.trim()) {
      toast.error("Question is required");
      return;
    }
    setSaving(true);
    const result = await saveRecord(
      "faqs",
      {
        ...(editing?.id ? { id: editing.id } : {}),
        question: form.question,
        answer: form.answer,
        sort_order: form.sort_order ?? faqs.length,
      },
      { revalidatePaths: ["/", "/about", "/admin/faqs"], logLabel: "faqs.saved" },
    );
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "FAQ updated" : "FAQ created");
    setDrawerOpen(false);
    router.refresh();
  }

  async function handleDelete(faq: Faq) {
    const result = await deleteRecord("faqs", faq.id, {
      revalidatePaths: ["/", "/about", "/admin/faqs"],
    });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("FAQ deleted");
    router.refresh();
  }

  async function handleMove(faq: Faq, direction: "up" | "down") {
    const sorted = [...faqs].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((f) => f.id === faq.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const a = sorted[index];
    const b = sorted[swapIndex];
    const aOrder = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = aOrder;

    // Persist both
    await reorderRecords(
      "faqs",
      sorted.map((f) => f.id),
      { revalidatePaths: ["/", "/about", "/admin/faqs"] },
    );
    setFaqs(sorted);
    toast.success("Order updated");
    router.refresh();
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No FAQs yet"
          description="Add common questions and answers to help your visitors."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add your first FAQ
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {[...faqs]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((faq, i, arr) => (
              <div
                key={faq.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-col pt-1">
                  <GripVertical className="h-4 w-4 text-slate-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {faq.question}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {faq.answer}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(faq, "up")}
                    disabled={i === 0}
                    title="Move up"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-800"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMove(faq, "down")}
                    disabled={i === arr.length - 1}
                    title="Move down"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-800"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => openEdit(faq)}
                    title="Edit"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(faq)}
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
        title={editing ? "Edit FAQ" : "New FAQ"}
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
        <Field label="Question" required>
          <Input
            value={form.question ?? ""}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="What is included in the courses?"
          />
        </Field>
        <Field label="Answer">
          <Textarea
            rows={6}
            value={form.answer ?? ""}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            placeholder="Each course includes video lectures, downloadable PDFs, and a certificate of completion."
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
        title="Delete FAQ?"
        message={`"${confirmDelete?.question}" will be permanently deleted.`}
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
