export const instant = false;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NewExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const payload = {
      description: formData.get("description"),
      category: formData.get("category"),
      payee: formData.get("payee") || null,
      amount: parseFloat(formData.get("amount") as string),
      currency: "NGN",
      paid_on: formData.get("paid_on"),
      method: formData.get("method"),
      status: "paid", // Defaulting to paid for now
      reference: formData.get("reference") || null,
    };

    const { error: insertError } = await supabase.from("expenses").insert(payload);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/expenses");
    router.refresh();
  }

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-900 placeholder:text-slate-400 transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/expenses" className="text-sm font-medium text-slate-500 hover:text-[#1E40AF] transition-colors">
          &larr; Back to Expenses
        </Link>
        <h1 className="text-2xl font-bold text-[#0A1F44] mt-2">Record New Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Description *</label>
            <input type="text" name="description" required className={inputClass} placeholder="e.g., Vercel Pro Subscription" />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select name="category" required className={inputClass}>
              <option value="">Select category...</option>
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
            <input type="text" name="payee" className={inputClass} placeholder="e.g., Vercel" />
          </div>

          <div>
            <label className={labelClass}>Amount (NGN) *</label>
            <input type="number" name="amount" step="0.01" required className={inputClass} placeholder="0.00" />
          </div>

          <div>
            <label className={labelClass}>Date Paid *</label>
            <input type="date" name="paid_on" required defaultValue={new Date().toISOString().split("T")[0]} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Payment Method</label>
            <select name="method" className={inputClass}>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Transaction Reference</label>
            <input type="text" name="reference" className={inputClass} placeholder="e.g., Receipt #123" />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
          <Link href="/admin/expenses" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md disabled:opacity-50 transition-colors shadow-sm">
            {loading ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
