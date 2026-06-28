"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, ShieldCheck, Copy } from "lucide-react";
import { EditorDrawer } from "@/app/admin/_components/EditorDrawer";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { Field, Input, Select, Button } from "@/app/admin/_components/Form";
import { inviteAdmin, deleteAdmin, updateAdminRole } from "@/app/admin/_actions/auth";

type AdminUserRow = {
  id: string;
  name: string;
  role: "founder" | "editor" | "content_manager";
  created_at: string;
  email: string;
};

type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: "founder" | "editor" | "content_manager";
} | null;

const roleLabels: Record<AdminUserRow["role"], { label: string; color: string }> = {
  founder: { label: "Founder", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  editor: { label: "Editor", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  content_manager: { label: "Content Manager", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
};

export function UsersManager({
  users,
  currentUser,
}: {
  users: AdminUserRow[];
  currentUser: CurrentUser;
}) {
  const router = useRouter();
  const isFounder = currentUser?.role === "founder";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<AdminUserRow | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "content_manager" });

  async function handleInvite() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("email", form.email);
    fd.set("role", form.role);
    const result = await inviteAdmin(fd);
    setSaving(false);

    if (result && "error" in result && result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`${form.email} invited`);
    setTempPassword(result.success ? result.password ?? null : null);
    setForm({ name: "", email: "", role: "content_manager" });
    router.refresh();
  }

  async function handleDelete(user: AdminUserRow) {
    const result = await deleteAdmin(user.id);
    if (result && result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("User removed");
    setConfirmDelete(null);
    router.refresh();
  }

  async function handleRoleChange(user: AdminUserRow, role: AdminUserRow["role"]) {
    const result = await updateAdminRole(user.id, role);
    if (result && result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Role updated");
    router.refresh();
  }

  return (
    <>
      {!isFounder && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <strong>Read-only.</strong> Only founders can invite, remove, or change admin roles.
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <Button onClick={() => setDrawerOpen(true)} disabled={!isFounder}>
          <Plus className="h-4 w-4" /> Invite User
        </Button>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">Role</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Added</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => {
              const isSelf = currentUser?.id === user.id;
              const roleStyle = roleLabels[user.role];
              return (
                <tr key={user.id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red">
                        {(user.name || user.email || "?")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {user.name || "Unnamed"}
                          {isSelf && (
                            <span className="ml-2 text-xs font-normal text-slate-400">(you)</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {isFounder && user.role !== "founder" && !isSelf ? (
                      <Select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user, e.target.value as AdminUserRow["role"])
                        }
                        className="!w-auto !py-1 text-xs"
                      >
                        <option value="content_manager">Content Manager</option>
                        <option value="editor">Editor</option>
                        <option value="founder">Founder</option>
                      </Select>
                    ) : (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${roleStyle.color}`}>
                        {user.role === "founder" && <ShieldCheck className="h-3 w-3" />}
                        {roleStyle.label}
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-slate-500 dark:text-slate-400 md:table-cell">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setConfirmDelete(user)}
                        disabled={!isFounder || isSelf || user.role === "founder"}
                        title={
                          isSelf
                            ? "Cannot delete yourself"
                            : user.role === "founder"
                              ? "Cannot delete founders"
                              : "Remove user"
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Invite drawer */}
      <EditorDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setTempPassword(null);
        }}
        title="Invite Admin User"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setDrawerOpen(false);
                setTempPassword(null);
              }}
            >
              Close
            </Button>
            {!tempPassword && (
              <Button onClick={handleInvite} disabled={saving}>
                {saving ? "Inviting..." : "Send Invite"}
              </Button>
            )}
          </>
        }
      >
        {tempPassword ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
              <p className="font-semibold">User created successfully!</p>
              <p className="mt-1">
                Share this temporary password with the new admin. They can change it after
                their first login.
              </p>
            </div>
            <Field label="Temporary password">
              <div className="flex gap-2">
                <Input value={tempPassword} readOnly className="font-mono" />
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(tempPassword);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </Field>
          </div>
        ) : (
          <>
            <Field label="Name" required>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
              />
            </Field>
            <Field label="Role" hint="Founders have full access. Editors manage content. Content managers can edit specific sections.">
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="content_manager">Content Manager</option>
                <option value="editor">Editor</option>
                <option value="founder">Founder</option>
              </Select>
            </Field>
          </>
        )}
      </EditorDrawer>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Remove admin user?"
        message={`${confirmDelete?.name ?? confirmDelete?.email} will lose all admin access. This cannot be undone.`}
        confirmLabel="Remove"
        danger
      />
    </>
  );
}
