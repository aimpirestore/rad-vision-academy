"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  ShoppingBag,
  Users,
  BookOpen,
  Image,
  Home,
  Navigation,
  Share2,
  Search,
  Settings,
  BarChart3,
  UserCheck,
  HelpCircle,
  Activity,
  Layers,
  X,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type NavGroup = {
  label: string;
  items: NavItem[];
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Activity Log", href: "/admin/activity", icon: Activity },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog Posts", href: "/admin/blog", icon: FileText },
      { label: "Courses", href: "/admin/courses", icon: GraduationCap },
      { label: "Products", href: "/admin/products", icon: ShoppingBag },
      { label: "Mentorship", href: "/admin/mentorship", icon: UserCheck },
      { label: "Resources", href: "/admin/resources", icon: BookOpen },
      { label: "FAQ", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    label: "Media & Layout",
    items: [
      { label: "Media Library", href: "/admin/media", icon: Image },
      { label: "Homepage", href: "/admin/homepage", icon: Home },
      { label: "Navigation", href: "/admin/navigation", icon: Navigation },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Social Media", href: "/admin/social", icon: Share2 },
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    label: "About",
    items: [
      { label: "Founders & Values", href: "/admin/about", icon: Users },
      { label: "Timeline", href: "/admin/about/timeline", icon: Layers },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
    ],
  },
];

export function AdminSidebar({
  collapsed,
  onClose,
}: {
  collapsed?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const group of navGroups) {
        initial[group.label] = true; // All open by default
      }
      return initial;
    },
  );

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-700 dark:bg-slate-900",
        collapsed && "w-16",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-brand-red flex items-center justify-center text-white text-xs font-bold">
              R
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Admin</span>
          </Link>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <button
                onClick={() =>
                  setOpenGroups((prev) => ({
                    ...prev,
                    [group.label]: !prev[group.label],
                  }))
                }
                className="mb-1 flex w-full items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {group.label}
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    openGroups[group.label] && "rotate-180",
                  )}
                />
              </button>
            )}
            {(collapsed || openGroups[group.label]) && (
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-brand-red/10 text-brand-red dark:bg-brand-red/20"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                        collapsed && "justify-center px-0",
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          {!collapsed && <span>View Website</span>}
        </Link>
      </div>
    </aside>
  );
}
