import type { Metadata } from "next";
import { AdminProviders } from "./_components/AdminProviders";

export const metadata: Metadata = {
  title: { default: "Admin — RAD Vision Academy", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin root layout — wraps ALL admin pages with theme + toaster.
 * Auth protection is handled by:
 *   1. middleware.ts (redirects unauthenticated users from /admin/* to /admin/login)
 *   2. The (dashboard) group layout which verifies auth for the shell
 *
 * The login page lives outside the (dashboard) group so it gets providers
 * but NOT the auth-checked sidebar shell.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
