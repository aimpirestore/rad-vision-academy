import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type AdminRole = "founder" | "editor" | "content_manager";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

/**
 * Get the currently authenticated admin user from Supabase.
 * Returns null if not authenticated or not in admin_users table.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, name, role")
    .eq("id", user.id)
    .single();

  if (!admin) return null;

  return {
    id: admin.id,
    email: user.email ?? "",
    name: admin.name,
    role: admin.role as AdminRole,
  };
}

/**
 * Require an authenticated admin user. Redirects to login if not found.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}

/**
 * Require a founder (super admin) for destructive operations.
 * Throws an error if the user doesn't have the founder role.
 */
export async function requireFounder(): Promise<AdminUser> {
  const admin = await requireAdmin();
  if (admin.role !== "founder") {
    throw new Error("Forbidden: founder role required");
  }
  return admin;
}
