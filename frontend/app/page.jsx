import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function HomePage() {
  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm" />
      </div>

      <div className="text-center space-y-6 max-w-md mx-auto p-8 bg-white/80 dark:bg-[#0f172a]/90 backdrop-blur border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl transition-all">
        <div className="inline-flex w-16 h-16 bg-emerald-600 rounded-2xl items-center justify-center text-white shadow-xl shadow-emerald-200 dark:shadow-emerald-950 mb-2">
          <iconify-icon icon="lucide:trending-up" class="text-3xl"></iconify-icon>
        </div>
        <div>
          <h1 className="text-3xl font-bold heading-font text-slate-900 dark:text-white tracking-tight">
            FinFlow
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            AI-powered smart expense monitoring & wealth dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/login"
            className="flex-1 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-sm transition-all shadow-md"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="flex-1 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md shadow-emerald-200 dark:shadow-emerald-950/50"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
