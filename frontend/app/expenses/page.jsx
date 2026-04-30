"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";
import ExpenseForm from "../../components/ExpenseForm";
import ExpenseList from "../../components/ExpenseList";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const { data } = await api.get("/expenses");
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (payload) => {
    await api.post("/expenses", payload);
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-semibold">Your Expenses</h1>
        <ExpenseForm onSubmit={addExpense} />
        <ExpenseList expenses={expenses} onDelete={deleteExpense} />
      </main>
    </ProtectedRoute>
  );
}
