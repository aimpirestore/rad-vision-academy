import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageHeader } from "@/app/admin/_components/ui";

export const dynamic = "force-dynamic";

export default async function ActivityLogPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("activity_log")
    .select("id, admin_email, action, details, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const entries = data ?? [];

  return (
    <div>
      <PageHeader title="Activity Log" description="A chronological record of all admin actions." />
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">When</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Who</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {entries.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-slate-400">No activity logged yet.</td></tr>
            )}
            {entries.map((e: any) => (
              <tr key={e.id} className="bg-white dark:bg-slate-900">
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                  {new Date(e.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{e.admin_email ?? "system"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    <span className="font-medium text-slate-900 dark:text-white">{e.action}</span>
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-slate-500 md:table-cell">
                  <pre className="max-w-xs truncate">{e.details ? JSON.stringify(e.details) : "—"}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
