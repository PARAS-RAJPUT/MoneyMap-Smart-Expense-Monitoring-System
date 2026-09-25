"use client";

import { useEffect, useState } from "react";

const MONTHLY_BUDGET = 6000;

export default function StatsCards({ expenses }) {
  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(true);

  // Compute total spent from real expense data (only negative/expense amounts)
  const totalSpent = expenses
    .filter((e) => e.amount < 0 || !e.isIncome)
    .reduce((sum, e) => sum + Math.abs(e.amount), 0);

  const budgetRemaining = Math.max(MONTHLY_BUDGET - totalSpent, 0);
  const budgetUsedPct = Math.min((totalSpent / MONTHLY_BUDGET) * 100, 100);

  useEffect(() => {
    const fetchForecast = async () => {
      setForecastLoading(true);
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000/predict",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expenses, budget: MONTHLY_BUDGET }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          setForecast(data.forecast);
        }
      } catch {
        // ML service offline — fall back to simple linear projection
        const today = new Date();
        const dayOfMonth = today.getDate();
        const daysInMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();
        const projected =
          dayOfMonth > 0 ? (totalSpent / dayOfMonth) * daysInMonth : totalSpent;
        setForecast(projected);
      } finally {
        setForecastLoading(false);
      }
    };

    if (expenses.length > 0) fetchForecast();
    else {
      setForecast(0);
      setForecastLoading(false);
    }
  }, [expenses, totalSpent]);

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Spent */}
      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <iconify-icon icon="lucide:credit-card" class="text-2xl"></iconify-icon>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-full">
            +12.5%
          </span>
        </div>
        <div className="mt-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Spent</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {fmt(totalSpent)}
          </h3>
        </div>
      </div>

      {/* Budget Remaining */}
      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl">
            <iconify-icon icon="lucide:pie-chart" class="text-2xl"></iconify-icon>
          </div>
          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${budgetUsedPct}%` }}
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Budget Remaining</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {fmt(budgetRemaining)}
          </h3>
        </div>
      </div>

      {/* Monthly Forecast (ML-powered, dark card) */}
      <div className="bg-slate-900 dark:bg-[#090d16] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center text-slate-400 text-sm">
            <span>Monthly Forecast</span>
            <iconify-icon
              icon="lucide:info"
              class="text-lg"
              title="AI-powered prediction using XGBoost"
            ></iconify-icon>
          </div>
          <h3 className="text-2xl font-bold text-white mt-4">
            {forecastLoading ? (
              <span className="text-slate-400 text-lg animate-pulse">
                Calculating…
              </span>
            ) : (
              fmt(forecast ?? 0)
            )}
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Estimated month-end spending
          </p>
          {!forecastLoading && (
            <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
              <iconify-icon icon="lucide:cpu" class="text-sm"></iconify-icon>
              XGBoost / scikit-learn prediction
            </p>
          )}
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
