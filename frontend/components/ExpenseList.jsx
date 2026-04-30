export default function ExpenseList({ expenses, onDelete }) {
  return (
    <ul className="space-y-2">
      {expenses.map((expense) => (
        <li
          key={expense._id}
          className="bg-white rounded border p-3 flex items-center justify-between"
        >
          <div>
            <p className="font-medium">{expense.title}</p>
            <p className="text-sm text-slate-500">
              {expense.category || "General"} - ${expense.amount}
            </p>
          </div>
          <button
            className="text-red-600 text-sm"
            onClick={() => onDelete(expense._id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
