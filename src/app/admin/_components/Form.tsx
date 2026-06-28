"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const baseInput =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

export const Field = ({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
      {required && <span className="ml-0.5 text-brand-red">*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    )}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(baseInput, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(baseInput, "resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(baseInput, "cursor-pointer", className)} {...props}>
    {children}
  </select>
));
Select.displayName = "Select";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
        variant === "primary" &&
          "bg-brand-red text-white shadow-sm hover:bg-brand-red-deep",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
        variant === "ghost" &&
          "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
        variant === "danger" &&
          "bg-red-600 text-white shadow-sm hover:bg-red-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
