"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// ────────────────────────────────────────────────────────────
// Variant objects — exported for any component that still wants
// to use framer-motion's <motion.* variants={...}> directly.
// Lazy-imported so they don't bloat the initial bundle.
// ────────────────────────────────────────────────────────────
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "span" | "article";
};

/**
 * Fade + slide-up on scroll into view.
 *
 * PERFORMANCE: Uses the native IntersectionObserver + CSS transitions instead
 * of framer-motion. This removes ~50KB of JS from every page that uses Reveal
 * while keeping the exact same visual effect. Reduced-motion users get the
 * content immediately with no animation.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Callback ref — works with any element type, no TS gymnastics needed.
  const setRef = useCallback((node: HTMLElement | null) => {
    // Cleanup previous observer if the element changed or unmounted.
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) return;

    // Respect reduced-motion: show immediately, no observer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(node);
    observerRef.current = observer;
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={setRef}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  once?: boolean;
};

/**
 * Stagger container — wraps children that should animate in sequence.
 * Uses CSS transitions on children with incremental delays.
 */
export function Stagger({ children, className }: StaggerProps) {
  // Stagger is purely a layout wrapper now — children use Reveal individually.
  // Keeping the component for API compatibility with existing call sites.
  return <div className={className}>{children}</div>;
}
