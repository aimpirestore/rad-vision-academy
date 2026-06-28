"use client";

import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T extends { id?: string }>({
  columns,
  rows,
  onRowClick,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  empty?: React.ReactNode;
}) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "bg-white transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-sm text-slate-700 dark:text-slate-300",
                      col.className,
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : (row as Record<string, React.ReactNode>)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
