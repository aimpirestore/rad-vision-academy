"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, FileEdit } from "lucide-react";

type Status = "published" | "draft" | "archived";

const config: Record<Status, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  published: {
    label: "Published",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    icon: FileEdit,
  },
  archived: {
    label: "Archived",
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    icon: XCircle,
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const c = config[status] ?? config.draft;
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        c.className,
      )}
    >
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}
