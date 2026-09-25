"use client";

import { useEffect, useState, useMemo } from "react";
import api from "../../lib/api";
import PageShell from "../../components/PageShell";

const CATEGORY_STYLES = {
  "Food & Dining": "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
  "Food & Drink":  "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
  Food:            "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
  Entertainment:   "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400",
  Housing:         "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  "Rent & Utils":  "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  Utilities:       "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400",
  Transport:       "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400",
  Shopping:        "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400",
  Salary:          "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
  General:         "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
};

const CATEGORY_ICONS = {
  "Food & Dining": "lucide:utensils",
  "Food & Drink":  "lucide:shopping-bag",
  Food:            "lucide:utensils",
  Entertainment:   "lucide:monitor",
  Housing:         "lucide:home",
  "Rent & Utils":  "lucide:zap",
  Utilities:       "lucide:zap",
  Transport:       "lucide:car",
  Shopping:        "lucide:shopping-bag",
  Salary:          "lucide:wallet",
  General:         "lucide:tag",
};

const ICON_BG = {
  "Food & Dining": "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  "Food & Drink":  "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  Food:            "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  Entertainment:   "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
  Housing:         "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  "Rent & Utils":  "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
  Utilities:       "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
  Transport:       "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
  Shopping:        "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400",
  Salary:          "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  General:         "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
};

const ALL_CATEGORIES = ["All", "Food & Dining", "Food & Drink", "Entertainment",
  "Housing", "Rent & Utils", "Utilities", "Transport", "Shopping", "Salary", "General"];

function fmt(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(n));
}

function fmtDate(str) {
  return new Date(str).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function TransactionsPage() {
  const [expenses, setExpenses]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [sortBy, setSortBy]       = useState("date-desc");

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get("/expenses");
      setExpenses(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  // Filter + sort
  const displayed = useMemo(() => {
    let list = [...expenses];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (catFilter !== "All") {
      list = list.filter((e) => e.category === catFilter);
    }

    // Sort
    switch (sortBy) {
      case "date-desc": list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)); break;
      case "date-asc":  list.sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)); break;
      case "amount-desc": list.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)); break;
      case "amount-asc":  list.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount)); break;
    }

    return list;
  }, [expenses, search, catFilter, sortBy]);

  const totalShown = displayed.reduce((s, e) => s + Math.abs(e.amount), 0);
  const isIncome = (e) => e.category?.toLowerCase() === "salary";

  return (
    <PageShell onExpenseAdded={fetchExpenses}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white heading-font tracking-tight">
            Transactions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {displayed.length} transaction{displayed.length !== 1 ? "s" : ""} · Total {fmt(totalShown)}
          </p>
        </div>
      </div>

      {/* Filters row */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 transition-all">
        {/* Search */}
        <div className="relative flex-1">
          <iconify-icon
            icon="lucide:search"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg"
          ></iconify-icon>
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category select */}
        <select
          className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/40">
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                      <iconify-icon icon="lucide:loader-2" class="text-3xl animate-spin"></iconify-icon>
                      <p className="text-sm">Loading transactions…</p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && displayed.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                      <iconify-icon icon="lucide:inbox" class="text-4xl"></iconify-icon>
                      <p className="text-sm">No transactions found</p>
                      {(search || catFilter !== "All") && (
                        <button
                          onClick={() => { setSearch(""); setCatFilter("All"); }}
                          className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              {displayed.map((e) => {
                const icon    = CATEGORY_ICONS[e.category] ?? "lucide:tag";
                const iconBg  = ICON_BG[e.category] ?? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
                const badgeCls = CATEGORY_STYLES[e.category] ?? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
                const income  = isIncome(e);
                return (
                  <tr key={e._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                          <iconify-icon icon={icon} class="text-xl"></iconify-icon>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{e.title}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{e.category || "General"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[11px] font-bold rounded-md ${badgeCls}`}>
                        {e.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400">{fmtDate(e.date || e.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-sm font-bold ${income ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-white"}`}>
                        {income ? "+" : "-"}{fmt(e.amount)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteExpense(e._id)}
                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <iconify-icon icon="lucide:trash-2"></iconify-icon>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        {displayed.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex justify-between items-center text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Showing {displayed.length} of {expenses.length} transactions
            </span>
            <span className="font-bold text-slate-900 dark:text-white">Total: {fmt(totalShown)}</span>
          </div>
        )}
      </div>
    </PageShell>
  );
}
