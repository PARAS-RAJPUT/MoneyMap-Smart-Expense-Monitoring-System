"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import PageShell from "../../components/PageShell";

export default function BudgetsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/expenses/stats");
      setStats(data);
    } catch (e) {
      console.error("Failed to fetch budget stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const MONTHLY_BUDGET = 6000;
  const totalSpent = stats?.totalSpent ?? 0;
  const remaining = Math.max(MONTHLY_BUDGET - totalSpent, 0);
  const usedPct = Math.min((totalSpent / MONTHLY_BUDGET) * 100, 100);

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold heading-font text-slate-900 dark:text-white">
          Budgets
        </h1>
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading budget data…</p>
        ) : (
          <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Monthly Budget</p>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{fmt(MONTHLY_BUDGET)}</h2>
              </div>
              <div className="text-right">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Remaining</p>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{fmt(remaining)}</h2>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
              <div
                className="h-3 bg-emerald-500 rounded-full transition-all"
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{usedPct.toFixed(1)}% of budget used</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
