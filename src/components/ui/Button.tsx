"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "ghost" | "outline";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 ease-out will-change-transform";

const variants: Record<Variant, string> = {
  primary: "bg-brand-red text-white shadow-glow hover:bg-brand-red-deep hover:-translate-y-0.5",
  dark: "bg-brand-black text-white hover:bg-brand-black/90 hover:-translate-y-0.5",
  ghost: "border border-brand-black/10 bg-white/70 text-brand-black backdrop-blur hover:border-brand-black/20 hover:bg-white",
  outline: "border border-brand-red/30 text-brand-red hover:bg-brand-red hover:text-white",
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  withArrow?: boolean;
  external?: boolean;
};

function Arrow() {
  return (
    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
  );
}

export function ButtonLink({
  variant = "primary",
  children,
  className,
  withArrow = true,
  external,
  href,
  ...props
}: CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, variants[variant], className)}
        {...(props as object)}
      >
        <span>{children}</span>
        {withArrow && <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props}>
      <span>{children}</span>
      {withArrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  children,
  className,
  withArrow = false,
  ...props
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      <span>{children}</span>
      {withArrow && <Arrow />}
    </button>
  );
}

/** Magnetic button — subtle attraction to cursor. */
export function MagneticButton({
  children,
  className,
  variant = "primary",
  href,
  external,
  strength = 0.25,
  ...props
}: CommonProps & { href: string; strength?: number } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(base, variants[variant], className)}
      {...(props as object)}
    >
      {children}
    </motion.a>
  );
}
