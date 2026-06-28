import { createAdminClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/auth";
import { PageHeader } from "@/app/admin/_components/ui";
import { UsersManager } from "./UsersManager";

export const dynamic = "force-dynamic";

type AdminUserRow = {
  id: string;
  name: string;
  role: "founder" | "editor" | "content_manager";
  created_at: string;
  email: string;
};

export default async function UsersAdminPage() {
  const currentUser = await getAdminUser();
  const db = createAdminClient();

  // Fetch admin_users rows
  const { data: rows } = await db
    .from("admin_users")
    .select("id, name, role, created_at")
    .order("created_at", { ascending: true });

  // Fetch auth.users to get emails (admin API, service role)
  const {
    data: { users: authUsers },
  } = await db.auth.admin.listUsers();

  const emailById = new Map<string, string>();
  for (const u of authUsers ?? []) {
    emailById.set(u.id, u.email ?? "");
  }

  const users: AdminUserRow[] = (rows ?? []).map((r) => ({
    ...r,
    email: emailById.get(r.id) ?? "",
  }));

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage admin accounts. Only founders can invite or remove admins."
      />
      <UsersManager users={users} currentUser={currentUser} />
    </div>
  );
}
