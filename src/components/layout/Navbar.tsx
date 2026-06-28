"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn, GUMROAD_STORE_URL } from "@/lib/utils";

type NavItem = { label: string; href: string; external?: boolean };

export function Navbar({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-3 z-50 px-4 sm:top-5"
      >
        <nav
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled ? "glass-nav shadow-soft" : "bg-white/40 backdrop-blur-md",
          )}
        >
          <Logo />

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      active ? "text-brand-red" : "text-brand-black/70 hover:text-brand-black",
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-brand-red/[0.08]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={GUMROAD_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5 sm:inline-flex"
            >
              Visit Store
              <ArrowUpRight className="h-4 w-4" />
            </a>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-black/10 bg-white/70 text-brand-black backdrop-blur transition-colors hover:bg-white lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-brand-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-20 origin-top rounded-3xl border border-brand-black/[0.06] bg-white p-4 shadow-soft-xl"
            >
              <ul className="flex flex-col">
                {navItems.map((item, i) => {
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors",
                          active ? "bg-brand-red/[0.07] text-brand-red" : "text-brand-black/80 hover:bg-brand-light-grey",
                        )}
                      >
                        {item.label}
                        <ArrowUpRight className="h-4 w-4 opacity-40" />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <a
                href={GUMROAD_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3.5 text-sm font-semibold text-white shadow-glow"
              >
                Visit Store <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
