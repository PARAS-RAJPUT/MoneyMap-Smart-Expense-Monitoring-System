"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import PageShell from "../../components/PageShell";
import CategoryBreakdown from "../../components/CategoryBreakdown";

export default function ReportsPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get("/expenses");
      setExpenses(data);
    } catch (e) {
      console.error("Failed to load expenses for reports", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold heading-font text-slate-900 dark:text-white">
          Reports
        </h1>
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading report data…</p>
        ) : (
          <CategoryBreakdown expenses={expenses} />
        )}
      </div>
    </PageShell>
  );
}
