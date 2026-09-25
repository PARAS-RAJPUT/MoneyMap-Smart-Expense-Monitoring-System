"use client";

import { useState } from "react";

const CATEGORIES = [
  "Food & Dining",
  "Food & Drink",
  "Entertainment",
  "Housing",
  "Rent & Utils",
  "Utilities",
  "Transport",
  "Shopping",
  "Salary",
  "General",
];

const AUTO_RULES = [
  { match: ["uber", "lyft", "gas", "chevron", "shell", "metro", "flight", "train", "parking"], category: "Transport" },
  { match: ["netflix", "spotify", "hulu", "cinema", "steam", "movie", "disney", "game", "hbo"], category: "Entertainment" },
  { match: ["starbucks", "mcdonald", "burger", "pizza", "restaurant", "cafe", "doordash", "chipotle", "subway", "dinner", "lunch", "taco"], category: "Food & Dining" },
  { match: ["whole foods", "trader joe", "grocery", "supermarket", "safeway", "kroger", "market"], category: "Food & Drink" },
  { match: ["rent", "lease", "mortgage", "housing", "landlord"], category: "Rent & Utils" },
  { match: ["electric", "water", "wifi", "internet", "utility", "power", "bill", "phone", "verizon", "at&t"], category: "Utilities" },
  { match: ["amazon", "walmart", "target", "nike", "zara", "clothing", "apple store", "best buy"], category: "Shopping" },
  { match: ["salary", "paycheck", "payroll", "deposit", "bonus", "freelance", "dividend"], category: "Salary" },
];

export default function NewExpenseModal({ onSubmit, onClose }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [autoDetected, setAutoDetected] = useState(false);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    const lower = val.toLowerCase();
    
    // Auto-categorize heuristic
    const match = AUTO_RULES.find((rule) => rule.match.some((keyword) => lower.includes(keyword)));
    if (match) {
      setCategory(match.category);
      setAutoDetected(true);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ title, amount: Number(amount), category });
    setTitle("");
    setAmount("");
    setCategory("General");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl p-8 z-10 border border-slate-200 dark:border-slate-800 transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white heading-font">
            New Expense
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 transition-colors"
          >
            <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Title / Merchant
            </label>
            <input
              className="mt-1.5 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Starbucks, Uber, Netflix, Rent…"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Amount ($)
            </label>
            <input
              className="mt-1.5 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Category
              </label>
              {autoDetected && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <iconify-icon icon="lucide:sparkles"></iconify-icon> AI Auto-categorized
                </span>
              )}
            </div>
            <select
              className="mt-1.5 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setAutoDetected(false);
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-md shadow-emerald-200 dark:shadow-emerald-950/50"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
