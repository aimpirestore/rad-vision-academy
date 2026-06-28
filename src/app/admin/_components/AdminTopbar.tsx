"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Moon, Sun, LogOut, Bell, User } from "lucide-react";
import { useTheme } from "next-themes";
import { signOutAdmin } from "@/app/admin/_actions/auth";
import { cn } from "@/lib/utils";

export function AdminTopbar({
  onMenuToggle,
  userName,
}: {
  onMenuToggle: () => void;
  userName?: string;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [signingOut, setSigningOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOutAdmin();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications (placeholder) */}
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
          <Bell className="h-4 w-4" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-red/10 text-brand-red text-xs font-bold">
              {userName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) ?? "A"}
            </span>
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
              {userName ?? "Admin"}
            </span>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {userName ?? "Admin"}
                  </p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
