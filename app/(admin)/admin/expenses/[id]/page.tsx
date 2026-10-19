"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expense, setExpense] = useState<any>(null);

  useEffect(() => {
    async function fetchExpense() {
      const supabase = createClient();
      const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single();
      if (error || !data) {
        router.push("/admin/expenses");
        return;
      }
      setExpense(data);
      setLoading(false);
    }
    fetchExpense();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const payload = {
      description: formData.get("description"),
      category: formData.get("category"),
      payee: formData.get("payee") || null,
      amount: parseFloat(formData.get("amount") as string),
      paid_on: formData.get("paid_on"),
      method: formData.get("method"),
      reference: formData.get("reference") || null,
    };

    const { error: updateError } = await supabase.from("expenses").update(payload).eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push("/admin/expenses");
    router.refresh();
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading expense...</div>;

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-900 placeholder:text-slate-400 transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/expenses" className="text-sm font-medium text-slate-500 hover:text-[#1E40AF] transition-colors">
          &larr; Back to Expenses
        </Link>
        <h1 className="text-2xl font-bold text-[#0A1F44] mt-2">Edit Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-sm">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Description *</label>
            <input type="text" name="description" required defaultValue={expense.description} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select name="category" required defaultValue={expense.category} className={inputClass}>
              <option value="software">Software & Licenses</option>
              <option value="hosting">Hosting & Cloud</option>
              <option value="domains">Domains & SSL</option>
              <option value="hardware">Hardware</option>
              <option value="internet">Internet & Comms</option>
              <option value="marketing">Marketing</option>
              <option value="contractors">Professional Services</option>
              <option value="office">Office Supplies</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Vendor / Payee</label>
            <input type="text" name="payee" defaultValue={expense.payee} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Amount (NGN) *</label>
            <input type="number" name="amount" step="0.01" required defaultValue={expense.amount} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Date Paid *</label>
            <input type="date" name="paid_on" required defaultValue={expense.paid_on} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Payment Method</label>
            <select name="method" defaultValue={expense.method} className={inputClass}>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Transaction Reference</label>
            <input type="text" name="reference" defaultValue={expense.reference} className={inputClass} />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
          <Link href="/admin/expenses" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={saving} className="px-6 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md disabled:opacity-50">
            {saving ? "Updating..." : "Update Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}