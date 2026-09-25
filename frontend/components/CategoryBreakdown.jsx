"use client";

const CATEGORY_CONFIG = {
  "Food & Dining": { color: "#10b981", bg: "bg-emerald-500" },
  "Food & Drink":  { color: "#10b981", bg: "bg-emerald-500" },
  Food:            { color: "#10b981", bg: "bg-emerald-500" },
  "Rent & Utils":  { color: "#3b82f6", bg: "bg-blue-500" },
  Housing:         { color: "#3b82f6", bg: "bg-blue-500" },
  Utilities:       { color: "#3b82f6", bg: "bg-blue-500" },
  Entertainment:   { color: "#fbbf24", bg: "bg-amber-400" },
  Shopping:        { color: "#a78bfa", bg: "bg-violet-400" },
  Transport:       { color: "#fb923c", bg: "bg-orange-400" },
  General:         { color: "#94a3b8", bg: "bg-slate-400" },
};

const FALLBACK_COLORS = ["#10b981", "#3b82f6", "#fbbf24", "#a78bfa", "#fb923c", "#94a3b8"];

export default function CategoryBreakdown({ expenses }) {
  // Aggregate by category
  const totals = {};
  expenses.forEach((e) => {
    const cat = e.category || "General";
    totals[cat] = (totals[cat] || 0) + Math.abs(e.amount);
  });

  const grand = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

  const slices = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt], i) => ({
      cat,
      amt,
      pct: Math.round((amt / grand) * 100),
      color: CATEGORY_CONFIG[cat]?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      bg: CATEGORY_CONFIG[cat]?.bg ?? "bg-slate-400",
    }));

  // Build SVG donut segments
  let offset = 0;

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      <h4 className="text-lg font-bold text-slate-800 dark:text-white heading-font mb-8">
        Category Breakdown
      </h4>
      <div className="flex flex-col items-center">
        {/* SVG Donut */}
        <div className="relative w-48 h-48 mb-8">
          <svg
            viewBox="0 0 36 36"
            className="w-full h-full transform -rotate-90"
          >
            {slices.length === 0 ? (
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeDasharray="100, 100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            ) : (
              slices.map(({ cat, pct, color }) => {
                const dashArray = `${pct}, 100`;
                const dashOffset = -offset;
                offset += pct;
                return (
                  <path
                    key={cat}
                    stroke={color}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeWidth="4"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                );
              })
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Total</span>
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              {fmt(grand === 1 && expenses.length === 0 ? 0 : grand)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          {slices.slice(0, 5).map(({ cat, pct, bg }) => (
            <div key={cat} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${bg}`} />
                <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                  {cat}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">{pct}%</span>
            </div>
          ))}
          {slices.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
