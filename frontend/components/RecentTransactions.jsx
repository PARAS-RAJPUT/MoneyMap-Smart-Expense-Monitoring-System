"use client";

const CATEGORY_STYLES = {
  "Food & Dining": "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  "Food & Drink":  "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  Food:            "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  Entertainment:   "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  Housing:         "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  "Rent & Utils":  "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  Utilities:       "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  Salary:          "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  Transport:       "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
  Shopping:        "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
  General:         "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
};

const CATEGORY_ICONS = {
  "Food & Dining": { icon: "lucide:utensils",     bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" },
  "Food & Drink":  { icon: "lucide:shopping-bag", bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" },
  Food:            { icon: "lucide:utensils",     bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" },
  Entertainment:   { icon: "lucide:monitor",      bg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400" },
  Housing:         { icon: "lucide:home",         bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" },
  "Rent & Utils":  { icon: "lucide:zap",          bg: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400" },
  Utilities:       { icon: "lucide:zap",          bg: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400" },
  Salary:          { icon: "lucide:wallet",       bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" },
  Transport:       { icon: "lucide:car",          bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" },
  Shopping:        { icon: "lucide:shopping-bag", bg: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400" },
  General:         { icon: "lucide:tag",          bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" },
};

const DEFAULT_ICON = { icon: "lucide:tag", bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" };

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentTransactions({ expenses, onDelete }) {
  const recent = [...expenses]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 10);

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
      Math.abs(n)
    );

  const isIncome = (e) => e.amount > 0 && e.category?.toLowerCase() === "salary";

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h4 className="text-lg font-bold text-slate-800 dark:text-white heading-font">
          Recent Transactions
        </h4>
        <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 text-sm font-bold transition-colors">
          View All
        </button>
      </div>

      {/* Table */}
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
            {recent.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No transactions yet. Add your first expense!
                </td>
              </tr>
            )}
            {recent.map((expense) => {
              const iconCfg =
                CATEGORY_ICONS[expense.category] ?? DEFAULT_ICON;
              const catStyle =
                CATEGORY_STYLES[expense.category] ??
                "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
              const income = isIncome(expense);

              return (
                <tr
                  key={expense._id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Description */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconCfg.bg}`}
                      >
                        <iconify-icon
                          icon={iconCfg.icon}
                          class="text-xl"
                        ></iconify-icon>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                          {expense.title}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {expense.category || "General"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-[11px] font-bold rounded-md ${catStyle}`}
                    >
                      {expense.category || "General"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(expense.date || expense.createdAt)}
                    </p>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-right">
                    <p
                      className={`text-sm font-bold ${
                        income ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-white"
                      }`}
                    >
                      {income ? "+" : "-"}
                      {fmt(expense.amount)}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 rounded-lg transition-colors"
                      onClick={() => onDelete(expense._id)}
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
    </div>
  );
}
