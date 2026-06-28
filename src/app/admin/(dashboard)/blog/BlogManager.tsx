"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Eye, EyeOff, Search } from "lucide-react";
import { EditorDrawer } from "@/app/admin/_components/EditorDrawer";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { Field, Input, Textarea, Select, Button } from "@/app/admin/_components/Form";
import { SlugField } from "@/app/admin/_components/SlugField";
import { RichTextEditor } from "@/app/admin/_components/RichTextEditor";
import { saveRecord, deleteRecord, toggleRecordStatus } from "@/app/admin/_actions/crud";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  body: string | null;
  status: "published" | "draft" | "archived";
  featured: boolean;
  reading_time: string | null;
  published_at: string | null;
};

const categories = [
  "Case Study",
  "Career",
  "Exam Strategy",
  "Subspecialty",
  "AI in Radiology",
  "Education",
];

export function BlogManager({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Post | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState<Partial<Post>>({});
  const [titleRef, setTitleRef] = useState("");

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  function openNew() {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      category: categories[0],
      author: "RAD Vision Academy",
      body: "",
      status: "draft",
      featured: false,
      reading_time: "5 min read",
    });
    setTitleRef("");
    setDrawerOpen(true);
  }

  function openEdit(post: Post) {
    setEditing(post);
    setForm(post);
    setTitleRef(post.title);
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);

    const result = await saveRecord(
      "posts",
      {
        ...(editing?.id ? { id: editing.id } : {}),
        title: form.title,
        slug: form.slug || form.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt: form.excerpt,
        category: form.category,
        author: form.author,
        body: form.body,
        status: form.status,
        featured: form.featured,
        reading_time: form.reading_time,
        published_at: form.status === "published" ? (form.published_at ?? new Date().toISOString()) : form.published_at,
      },
      { revalidatePaths: ["/blog", "/", "/admin/blog"], logLabel: "posts.saved" },
    );

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(editing ? "Post updated" : "Post created");
    setDrawerOpen(false);
    router.refresh();
  }

  async function handleDelete(post: Post) {
    const result = await deleteRecord("posts", post.id, {
      revalidatePaths: ["/blog", "/admin/blog"],
    });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Post deleted");
    router.refresh();
  }

  async function handleToggleStatus(post: Post) {
    const newStatus = post.status === "published" ? "draft" : "published";
    const result = await toggleRecordStatus("posts", post.id, newStatus, {
      revalidatePaths: ["/blog", "/admin/blog"],
    });
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`Post ${newStatus === "published" ? "published" : "unpublished"}`);
    router.refresh();
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-sm text-slate-400">
                  No posts found.
                </td>
              </tr>
            )}
            {filtered.map((post) => (
              <tr key={post.id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{post.title}</p>
                  <p className="text-xs text-slate-400">/{post.slug}</p>
                </td>
                <td className="hidden px-4 py-3 text-sm text-slate-600 dark:text-slate-300 sm:table-cell">{post.category}</td>
                <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleToggleStatus(post)}
                      title={post.status === "published" ? "Unpublish" : "Publish"}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                    >
                      {post.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(post)}
                      title="Edit"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(post)}
                      title="Delete"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor drawer */}
      <EditorDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? "Edit Post" : "New Post"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </>
        }
      >
        <Field label="Title" required>
          <Input
            value={form.title ?? ""}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              setTitleRef(e.target.value);
            }}
            placeholder="How to read a chest X-ray"
          />
        </Field>

        <Field label="Slug" hint="Used in the URL: /blog/your-slug">
          <SlugField
            value={form.slug ?? ""}
            onChange={(slug) => setForm({ ...form, slug })}
            titleRef={{ current: titleRef }}
          />
        </Field>

        <Field label="Category">
          <Select value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>

        <Field label="Author">
          <Input value={form.author ?? ""} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        </Field>

        <Field label="Reading time">
          <Input value={form.reading_time ?? ""} onChange={(e) => setForm({ ...form, reading_time: e.target.value })} placeholder="5 min read" />
        </Field>

        <Field label="Excerpt" hint="Short summary shown in cards and listings.">
          <Textarea rows={3} value={form.excerpt ?? ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        </Field>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Body</label>
          <RichTextEditor
            value={form.body ?? ""}
            onChange={(html) => setForm({ ...form, body: html })}
          />
        </div>

        <Field label="Status">
          <Select value={form.status ?? "draft"} onChange={(e) => setForm({ ...form, status: e.target.value as Post["status"] })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured ?? false}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-red focus:ring-brand-red"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Feature this post</span>
        </label>
      </EditorDrawer>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete post?"
        message={`"${confirmDelete?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
