"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/dashboard",    label: "Dashboard"    },
  { href: "/transactions", label: "Transactions" },
  { href: "/budgets",      label: "Budgets"      },
  { href: "/reports",      label: "Reports"      },
];

export default function FinFlowNavbar({ onNewExpense }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [initials, setInitials] = useState("JD");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) {
          const parts = u.name.trim().split(" ");
          const init = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
          setInitials(init);
        }
      }
    } catch {}
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0d1424]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-3 flex items-center justify-between transition-colors">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-950 transition-transform group-hover:scale-105">
            <iconify-icon icon="lucide:trending-up" class="text-2xl"></iconify-icon>
          </div>
          <span className="text-xl font-bold heading-font tracking-tight text-slate-800 dark:text-white">
            FinFlow
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (pathname === "/expenses" && href === "/dashboard") || (href !== "/" && pathname.startsWith(href + "/"));
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  active
                    ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 font-bold"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {onNewExpense && (
          <button
            onClick={onNewExpense}
            className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-200 dark:shadow-emerald-950/50"
          >
            <iconify-icon icon="lucide:plus" class="text-xl"></iconify-icon>
            <span className="font-medium text-sm">New Expense</span>
          </button>
        )}

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* Theme Toggle Button */}
        <ThemeToggle />

        <button
          onClick={logout}
          className="flex items-center gap-2 pl-2 pr-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          title="Logout"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
            {initials}
          </div>
          <iconify-icon icon="lucide:log-out" class="text-slate-400 text-sm hover:text-red-500"></iconify-icon>
        </button>
      </div>
    </header>
  );
}
