import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ExpensesPage() {
  const supabase = await createClient();

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .order("paid_on", { ascending: false });

  if (error) {
    return <div className="text-red-600 p-4 bg-red-50 rounded">Error loading expenses: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Expenses</h1>
          <p className="text-sm text-slate-600 mt-1">Track your outgoing business costs.</p>
        </div>
        <Link 
          href="/admin/expenses/new" 
          className="px-4 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md shadow-sm transition-colors"
        >
          + Record Expense
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        {!expenses || expenses.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-700">No expenses recorded</p>
            <p className="text-sm mt-1">Start tracking your business costs to see your true profit.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">{expense.paid_on}</td>
                  <td className="px-6 py-4 font-medium text-[#0A1F44]">
                    <Link href={`/admin/expenses/${expense.id}`} className="hover:text-[#1E40AF] hover:underline transition-colors">
                      {expense.description}
                    </Link>
                    {expense.payee && <span className="block text-xs font-normal text-slate-500 mt-0.5">Vendor: {expense.payee}</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-600 capitalize">{expense.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                      expense.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    ₦{Number(expense.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}