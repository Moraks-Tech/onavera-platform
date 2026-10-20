export const instant = false;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NewOutgoingSubscriptionPage() {
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
      direction: "outgoing",
      name: formData.get("name"),
      provider: formData.get("provider"),
      price: parseFloat(formData.get("price") as string),
      currency: "NGN",
      billing_frequency: formData.get("billing_frequency"),
      status: formData.get("status"),
      next_due_date: formData.get("next_due_date") || null,
    };

    const { error: insertError } = await supabase.from("subscriptions").insert(payload);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/subscriptions/outgoing");
    router.refresh();
  }

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-900 placeholder:text-slate-400 transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/subscriptions/outgoing" className="text-sm font-medium text-slate-500 hover:text-[#1E40AF] transition-colors">
          &larr; Back to Outgoing Subscriptions
        </Link>
        <h1 className="text-2xl font-bold text-[#0A1F44] mt-2">Add Outgoing Subscription</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-sm">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Service Name *</label>
            <input type="text" name="name" required placeholder="e.g., Vercel Pro" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Provider *</label>
            <input type="text" name="provider" required placeholder="e.g., Vercel" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Cost (NGN) *</label>
            <input type="number" name="price" step="0.01" required placeholder="0.00" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Billing Frequency *</label>
            <select name="billing_frequency" required className={inputClass}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annually</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select name="status" className={inputClass}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Next Due Date</label>
            <input type="date" name="next_due_date" className={inputClass} />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
          <Link href="/admin/subscriptions/outgoing" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md disabled:opacity-50">
            {loading ? "Saving..." : "Save Subscription"}
          </button>
        </div>
      </form>
    </div>
  );
}
