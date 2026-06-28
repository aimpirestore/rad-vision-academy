import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "red" | "outline" | "soft";
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const styles = {
    default: "bg-brand-black/[0.04] text-brand-black/70 border-brand-black/5",
    red: "bg-brand-red/10 text-brand-red border-brand-red/15",
    outline: "bg-transparent text-brand-black/70 border-brand-black/15",
    soft: "bg-brand-light-grey text-brand-dark-grey border-brand-black/5",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-tight",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-display-lg text-gradient-ink max-w-3xl">{title}</h2>
      {description && (
        <p className={cn("text-base leading-relaxed text-brand-dark-grey sm:text-lg", align === "center" ? "max-w-2xl" : "max-w-xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
