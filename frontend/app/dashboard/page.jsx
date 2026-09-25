"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import ProtectedRoute from "../../components/ProtectedRoute";
import FinFlowNavbar from "../../components/FinFlowNavbar";
import StatsCards from "../../components/StatsCards";
import SpendingTrend from "../../components/SpendingTrend";
import CategoryBreakdown from "../../components/CategoryBreakdown";
import RecentTransactions from "../../components/RecentTransactions";
import MobileFooterNav from "../../components/MobileFooterNav";
import NewExpenseModal from "../../components/NewExpenseModal";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState("month"); // "week" | "month"
  const [userName, setUserName] = useState("");

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get("/expenses");
      setExpenses(data);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setUserName(u.name.split(" ")[0]);
      }
    } catch {}
  }, []);

  const addExpense = async (payload) => {
    await api.post("/expenses", payload);
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  // Filter expenses based on selected time window
  const now = new Date();
  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date || e.createdAt);
    if (timeFilter === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    }
    // "month" — current calendar month
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });

  const monthName = now.toLocaleString("default", { month: "long" });

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg flex flex-col">
        <FinFlowNavbar onNewExpense={() => setShowModal(true)} />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8 pb-24 lg:pb-8">
          {/* Dashboard Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white heading-font tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {userName ? `Welcome back, ${userName}! ` : "Welcome back! "}Here&apos;s your spending summary for {monthName}.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-[#0f172a] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => setTimeFilter("week")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  timeFilter === "week"
                    ? "text-white bg-emerald-600 shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  timeFilter === "month"
                    ? "text-white bg-emerald-600 shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards expenses={filteredExpenses} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SpendingTrend expenses={filteredExpenses} />
            <CategoryBreakdown expenses={filteredExpenses} />
          </div>

          {/* Recent Transactions */}
          <RecentTransactions
            expenses={filteredExpenses}
            onDelete={deleteExpense}
          />
        </main>

        {/* Mobile Footer */}
        <MobileFooterNav onNewExpense={() => setShowModal(true)} />

        {/* New Expense Modal */}
        {showModal && (
          <NewExpenseModal
            onSubmit={addExpense}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
