"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import { requireFounder, getAdminUser } from "@/lib/supabase/auth";

/**
 * Sign in with email + password.
 * Used as a server action alternative to the client-side signInWithPassword.
 */
export async function signInAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

/**
 * Sign out the current admin user.
 */
export async function signOutAdmin() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

/**
 * Invite a new admin user (founders only).
 * Creates a Supabase auth user and adds them to admin_users.
 */
export async function inviteAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;

  if (!email || !name || !role) {
    return { error: "Email, name, and role are required." };
  }

  // Only founders can invite new admins
  try {
    await requireFounder();
  } catch {
    return { error: "Forbidden: founder role required." };
  }

  const authAdmin = createAdminClient().auth.admin;
  const db = createAdminClient();

  // Generate a temporary password
  const tempPassword =
    Math.random().toString(36).slice(-12) +
    Math.random().toString(36).slice(-12) +
    "A1!";

  const { data: userData, error: userError } = await authAdmin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { name },
  });

  if (userError) {
    return { error: userError.message };
  }

  // Add to admin_users table (table has no email column — fetch from auth)
  const { error: dbError } = await db.from("admin_users").insert({
    id: userData.user.id,
    name,
    role,
  });

  if (dbError) {
    // Rollback: delete the auth user
    await authAdmin.deleteUser(userData.user.id);
    return { error: dbError.message };
  }

  // Log activity
  await db.from("activity_log").insert({
    user_id: (await getAdminUser())?.id,
    entity_type: "admin_users",
    action: "admin.invited",
    details: { email, name, role },
  });

  revalidatePath("/admin/users");
  return { success: true, password: tempPassword };
}

/**
 * Delete an admin user (founders only).
 */
export async function deleteAdmin(userId: string) {
  try {
    const adminUser = await requireFounder();
    // Prevent self-deletion
    if (adminUser.id === userId) {
      return { error: "You cannot delete your own account." };
    }
  } catch {
    return { error: "Forbidden: founder role required." };
  }

  const authAdmin = createAdminClient().auth.admin;
  const db = createAdminClient();

  await db.from("admin_users").delete().eq("id", userId);
  await authAdmin.deleteUser(userId);

  // Log activity
  await db.from("activity_log").insert({
    user_id: (await getAdminUser())?.id,
    entity_type: "admin_users",
    action: "admin.deleted",
    details: { userId },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Update an admin user's role (founders only).
 */
export async function updateAdminRole(userId: string, role: string) {
  try {
    await requireFounder();
  } catch {
    return { error: "Forbidden: founder role required." };
  }

  const db = createAdminClient();
  const { error } = await db
    .from("admin_users")
    .update({ role })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  await db.from("activity_log").insert({
    user_id: (await getAdminUser())?.id,
    entity_type: "admin_users",
    action: "admin.role_changed",
    details: { userId, role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
