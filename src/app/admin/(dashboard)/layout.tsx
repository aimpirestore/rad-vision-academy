import { redirect } from "next/navigation";
import { AdminShell } from "@/app/admin/_components/AdminShell";
import { getAdminUser } from "@/lib/supabase/auth";

/**
 * Layout for all authenticated admin dashboard pages.
 * Verifies auth and wraps in the sidebar + topbar shell.
 * The login page is OUTSIDE this group so it renders standalone.
 */
export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminShell userName={admin.name}>{children}</AdminShell>;
}
