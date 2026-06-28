"use client";

import Link from "next/link";
import { Plus, Search, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  actionHref,
  actionIcon: Icon = Plus,
}: {
  title: string;
  description?: string;
  action?: string;
  actionHref?: string;
  actionIcon?: LucideIcon;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-red-deep"
        >
          <Icon className="h-4 w-4" />
          {action}
        </Link>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
      {trend && (
        <span className="ml-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {trend}
        </span>
      )}
    </Card>
  );
}
