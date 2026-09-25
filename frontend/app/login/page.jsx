"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";
import ThemeToggle from "../../components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ _id: data._id, name: data.name, email: data.email })
        );
        router.push("/dashboard");
      } else {
        setError("Login succeeded but no token was returned.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm" />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 transition-all">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 bg-emerald-600 rounded-2xl items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-950 mb-2">
            <iconify-icon icon="lucide:lock" class="text-2xl"></iconify-icon>
          </div>
          <h1 className="text-2xl font-bold heading-font text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your dashboard and expense tracking
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-xl flex items-center gap-2">
            <iconify-icon icon="lucide:alert-circle" class="text-lg shrink-0"></iconify-icon>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <input
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-4 py-3 text-sm transition-all shadow-md shadow-emerald-200 dark:shadow-emerald-950 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <iconify-icon icon="lucide:loader-2" class="animate-spin text-lg"></iconify-icon>
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
