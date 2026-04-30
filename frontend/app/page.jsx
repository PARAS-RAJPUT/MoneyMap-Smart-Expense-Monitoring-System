import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <p className="text-slate-600">Manage your spending with ease.</p>
        <div className="space-x-3">
          <Link href="/login" className="px-4 py-2 rounded bg-slate-900 text-white">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 rounded bg-blue-600 text-white">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
