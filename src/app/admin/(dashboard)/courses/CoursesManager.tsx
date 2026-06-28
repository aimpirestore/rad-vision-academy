"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Eye, EyeOff, Search, GripVertical } from "lucide-react";
import { EditorDrawer } from "@/app/admin/_components/EditorDrawer";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { Field, Input, Textarea, Select, Button } from "@/app/admin/_components/Form";
import { SlugField } from "@/app/admin/_components/SlugField";
import { saveRecord, deleteRecord, toggleRecordStatus } from "@/app/admin/_actions/crud";

type Course = {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  blurb: string;
  description: string;
  highlights: string[];
  price: string;
  gumroad_url: string | null;
  status: "published" | "draft" | "archived";
  sort_order: number;
};

const categories = ["Core", "Exam Prep", "Subspecialty", "Future"];
const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"] as const;

export function CoursesManager({ initialCourses }: { initialCourses: Course[] }) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Course | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Course>>({});
  const [titleRef, setTitleRef] = useState("");
  const [highlightsText, setHighlightsText] = useState("");

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()),
  );

  function openNew() {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      instructor: "RAD Vision Academy",
      duration: "8 hours",
      level: "All Levels",
      category: categories[0],
      blurb: "",
      description: "",
      highlights: [],
      price: "$99",
      gumroad_url: "",
      status: "draft",
    });
    setHighlightsText("");
    setTitleRef("");
    setDrawerOpen(true);
  }

  function openEdit(course: Course) {
    setEditing(course);
    setForm(course);
    setHighlightsText((course.highlights ?? []).join("\n"));
    setTitleRef(course.title);
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);

    const result = await saveRecord(
      "courses",
      {
        ...(editing?.id ? { id: editing.id } : {}),
        title: form.title,
        slug: form.slug || form.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        instructor: form.instructor,
        duration: form.duration,
        level: form.level,
        category: form.category,
        blurb: form.blurb,
        description: form.description,
        highlights: highlightsText.split("\n").map((h) => h.trim()).filter(Boolean),
        price: form.price,
        gumroad_url: form.gumroad_url,
        status: form.status,
      },
      { revalidatePaths: ["/courses", "/", "/admin/courses"], logLabel: "courses.saved" },
    );

    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "Course updated" : "Course created");
    setDrawerOpen(false);
    router.refresh();
  }

  async function handleDelete(course: Course) {
    const result = await deleteRecord("courses", course.id, {
      revalidatePaths: ["/courses", "/admin/courses"],
    });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Course deleted");
    router.refresh();
  }

  async function handleToggleStatus(course: Course) {
    const newStatus = course.status === "published" ? "draft" : "published";
    const result = await toggleRecordStatus("courses", course.id, newStatus, {
      revalidatePaths: ["/courses", "/admin/courses"],
    });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`Course ${newStatus === "published" ? "published" : "unpublished"}`);
    router.refresh();
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New Course
        </Button>
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
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">No courses found.</td></tr>
            )}
            {filtered.map((course) => (
              <tr key={course.id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{course.title}</p>
                  <p className="text-xs text-slate-400">/{course.slug}</p>
                </td>
                <td className="hidden px-4 py-3 text-sm text-slate-600 dark:text-slate-300 md:table-cell">{course.category}</td>
                <td className="hidden px-4 py-3 text-sm text-slate-600 dark:text-slate-300 md:table-cell">{course.price}</td>
                <td className="px-4 py-3"><StatusBadge status={course.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleToggleStatus(course)} title={course.status === "published" ? "Unpublish" : "Publish"} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                      {course.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => openEdit(course)} title="Edit" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirmDelete(course)} title="Delete" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditorDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? "Edit Course" : "New Course"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </>
        }
      >
        <Field label="Title" required>
          <Input value={form.title ?? ""} onChange={(e) => { setForm({ ...form, title: e.target.value }); setTitleRef(e.target.value); }} placeholder="Foundations of Radiology" />
        </Field>

        <Field label="Slug">
          <SlugField value={form.slug ?? ""} onChange={(slug) => setForm({ ...form, slug })} titleRef={{ current: titleRef }} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Instructor">
            <Input value={form.instructor ?? ""} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
          </Field>
          <Field label="Price">
            <Input value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$99" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <Select value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Level">
            <Select value={form.level ?? ""} onChange={(e) => setForm({ ...form, level: e.target.value as Course["level"] })}>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </Field>
        </div>

        <Field label="Duration">
          <Input value={form.duration ?? ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="8 hours" />
        </Field>

        <Field label="Blurb" hint="Short card description.">
          <Textarea rows={2} value={form.blurb ?? ""} onChange={(e) => setForm({ ...form, blurb: e.target.value })} />
        </Field>

        <Field label="Description" hint="Full course description shown on the detail page.">
          <Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>

        <Field label="Highlights" hint="One per line. Shown as 'What you'll learn'.">
          <Textarea rows={5} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder={"Read chest X-rays systematically\nUnderstand CT anatomy\nReport with confidence"} />
        </Field>

        <Field label="Gumroad URL" hint="The specific Gumroad product page. Leave blank to use the storefront.">
          <Input value={form.gumroad_url ?? ""} onChange={(e) => setForm({ ...form, gumroad_url: e.target.value })} placeholder="https://radvisionacademy.gumroad.com/l/..." />
        </Field>

        <Field label="Status">
          <Select value={form.status ?? "draft"} onChange={(e) => setForm({ ...form, status: e.target.value as Course["status"] })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
      </EditorDrawer>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete course?"
        message={`"${confirmDelete?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
