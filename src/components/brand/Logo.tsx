import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "default" | "light";
  showWordmark?: boolean;
  href?: string;
};

/** RAD Vision Academy logo — a radiology crosshair / pulse mark. */
export function LogoMark({ className, variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  const stroke = variant === "light" ? "#FFFFFF" : "#1A1A1A";
  const accent = "#B11226";
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-9 w-9", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18.5" stroke={stroke} strokeOpacity="0.15" />
      <circle cx="20" cy="20" r="12" stroke={accent} strokeWidth="2" />
      <circle cx="20" cy="20" r="4.5" fill={accent} />
      <path d="M20 1.5 V8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 32 V38.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1.5 20 H8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 20 H38.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, variant = "default", showWordmark = true, href = "/" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-brand-black";
  const subColor = variant === "light" ? "text-white/60" : "text-brand-dark-grey/70";

  const content = (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark variant={variant} className="transition-transform duration-500 group-hover:rotate-90" />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className={cn("text-base font-bold tracking-tight", textColor)}>
            RAD Vision
          </span>
          <span className={cn("text-[10px] font-semibold uppercase tracking-[0.22em]", subColor)}>
            Academy
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="RAD Vision Academy — home" className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
