"use client";

import { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import FinFlowNavbar from "./FinFlowNavbar";
import MobileFooterNav from "./MobileFooterNav";
import NewExpenseModal from "./NewExpenseModal";
import api from "../lib/api";

/**
 * Shared shell used by Transactions, Budgets, and Reports pages.
 * Provides: ProtectedRoute, Navbar, mobile footer, New Expense modal.
 * 
 * Props:
 *   children        — page content
 *   onExpenseAdded  — optional callback to refresh data after add
 */
export default function PageShell({ children, onExpenseAdded }) {
  const [showModal, setShowModal] = useState(false);

  const addExpense = async (payload) => {
    await api.post("/expenses", payload);
    if (onExpenseAdded) onExpenseAdded();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg flex flex-col">
        <FinFlowNavbar onNewExpense={() => setShowModal(true)} />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 pb-24 lg:pb-8">
          {children}
        </main>

        <MobileFooterNav onNewExpense={() => setShowModal(true)} />

        {showModal && (
          <NewExpenseModal
            onSubmit={addExpense}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
