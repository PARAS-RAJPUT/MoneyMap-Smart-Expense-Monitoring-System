"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b p-4 flex items-center justify-between">
      <Link href="/" className="font-semibold">
        Expense Tracker
      </Link>
      <button
        onClick={logout}
        className="rounded bg-slate-900 text-white px-3 py-1 text-sm"
      >
        Logout
      </button>
    </nav>
  );
}
