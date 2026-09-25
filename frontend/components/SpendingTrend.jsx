"use client";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SpendingTrend({ expenses }) {
  // Group expenses by day of week, compute totals
  const byDay = Array(7).fill(0);
  expenses.forEach((e) => {
    const d = new Date(e.date || e.createdAt);
    const dow = d.getDay(); // 0=Sun … 6=Sat
    byDay[dow] += Math.abs(e.amount);
  });

  // Reorder to Mon-Sun (matching FinFlow bar order)
  const ordered = [1, 2, 3, 4, 5, 6, 0].map((i) => ({
    label: DAYS[i],
    value: byDay[i],
  }));

  const maxVal = Math.max(...ordered.map((d) => d.value), 1);

  // Simulate "previous period" as 80% of current for the ghost bar
  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-lg font-bold text-slate-800 dark:text-white heading-font">
          Spending Trend
        </h4>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Current
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" /> Previous
          </span>
        </div>
      </div>

      <div className="h-[300px] w-full flex items-end justify-between gap-4">
        {ordered.map(({ label, value }) => {
          const pct = maxVal > 0 ? (value / maxVal) * 100 : 0;
          const prevPct = pct * 0.8; // ghost bar

          return (
            <div
              key={label}
              className="flex-1 flex flex-col items-center gap-2 h-full"
            >
              <div
                className="w-full bg-slate-50 dark:bg-slate-900 rounded-lg relative flex flex-col justify-end overflow-hidden h-full group cursor-pointer"
                title={`$${value.toFixed(2)}`}
              >
                {/* Previous period (ghost) */}
                <div
                  className="w-full bg-emerald-500/20 dark:bg-emerald-500/10 transition-all duration-500"
                  style={{ height: `${prevPct}%` }}
                />
                {/* Current period */}
                <div
                  className="w-full bg-emerald-500 transition-all duration-500 group-hover:bg-emerald-400"
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
