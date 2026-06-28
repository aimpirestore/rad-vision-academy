import Link from "next/link";
import {
  FileText,
  GraduationCap,
  ShoppingBag,
  Users,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Eye,
  Activity,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, StatCard, PageHeader } from "@/app/admin/_components/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch counts in parallel
  const [
    coursesCount,
    postsCount,
    productsCount,
    servicesCount,
    resourcesCount,
    usersCount,
    recentActivity,
    publishedPosts,
    draftPosts,
  ] = await Promise.all([
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("mentorship_services").select("id", { count: "exact", head: true }),
    supabase.from("resources").select("id", { count: "exact", head: true }),
    supabase.from("admin_users").select("id", { count: "exact", head: true }),
    supabase
      .from("activity_log")
      .select("id, action, created_at, details")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
  ]);

  const stats = [
    { label: "Courses", value: coursesCount.count ?? 0, icon: GraduationCap },
    { label: "Blog Posts", value: postsCount.count ?? 0, icon: FileText },
    { label: "Products", value: productsCount.count ?? 0, icon: ShoppingBag },
    { label: "Mentorship", value: servicesCount.count ?? 0, icon: Users },
    { label: "Resources", value: resourcesCount.count ?? 0, icon: BookOpen },
    { label: "Admin Users", value: usersCount.count ?? 0, icon: Activity },
  ];

  const activity = (recentActivity.data as any[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your content and recent activity."
      />

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
            Quick actions
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "New Post", href: "/admin/blog", icon: FileText },
              { label: "New Course", href: "/admin/courses", icon: GraduationCap },
              { label: "New Product", href: "/admin/products", icon: ShoppingBag },
              { label: "Resources", href: "/admin/resources", icon: BookOpen },
              { label: "Homepage", href: "/admin/homepage", icon: TrendingUp },
              { label: "Settings", href: "/admin/settings", icon: Eye },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col items-start gap-2 rounded-lg border border-slate-200 p-4 transition-all hover:border-brand-red hover:shadow-sm dark:border-slate-700"
              >
                <action.icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-brand-red" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Content health */}
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Content status
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950">
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  {publishedPosts.count ?? 0}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-500">Published posts</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950">
                <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
                  {draftPosts.count ?? 0}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-500">Drafts</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent activity
            </h2>
            <Link
              href="/admin/activity"
              className="text-xs font-medium text-brand-red hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {activity.length === 0 && (
              <li className="text-sm text-slate-400">No activity yet.</li>
            )}
            {activity.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {entry.action}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* View site */}
      <div className="mt-8">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-red hover:underline"
        >
          View live website <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
