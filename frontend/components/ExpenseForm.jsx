"use client";

import { useState } from "react";

export default function ExpenseForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      amount: Number(amount),
      category
    });
    setTitle("");
    setAmount("");
    setCategory("");
  };

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
      <input
        className="border rounded px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="border rounded px-3 py-2"
        type="number"
        min="0"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        className="border rounded px-3 py-2"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button className="rounded bg-blue-600 text-white px-4 py-2">Add</button>
    </form>
  );
}
