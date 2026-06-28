import type { Metadata } from "next";
import { Suspense } from "react";
import { Shield } from "lucide-react";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login — RAD Vision Academy",
  description: "Sign in to the RAD Vision Academy admin dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-red/10">
            <Shield className="h-8 w-8 text-brand-red" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            RAD Vision Academy — Content Management System
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Sign in to continue</h2>
          <Suspense fallback={<div className="text-center text-sm text-slate-400">Loading...</div>}>
            <AdminLoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Authorized access only. All actions are logged.
        </p>
      </div>
    </div>
  );
}
