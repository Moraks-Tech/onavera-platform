"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RecordPaymentModal({ 
  invoiceId, 
  clientId, 
  invoiceTotal,
  amountAlreadyPaid
}: { 
  invoiceId: string; 
  clientId: string; 
  invoiceTotal: number;
  amountAlreadyPaid: number;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const outstandingBalance = invoiceTotal - amountAlreadyPaid;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get("amount") as string);

    // 1. Validation
    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      setLoading(false);
      return;
    }
    if (amount > outstandingBalance) {
      setError(`Amount cannot exceed the outstanding balance of ₦${outstandingBalance.toLocaleString()}.`);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // 2. Create the Payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        client_id: clientId,
        amount: amount,
        currency: "NGN",
        received_on: formData.get("received_on"),
        method: formData.get("method"),
        reference: formData.get("reference"),
        notes: formData.get("notes"),
        verification: "verified", // Mark as verified automatically for Founder
      })
      .select()
      .single();

    if (paymentError) {
      setError(paymentError.message);
      setLoading(false);
      return;
    }

    // 3. Allocate the payment to the invoice
    const { error: allocationError } = await supabase
      .from("payment_allocations")
      .insert({
        payment_id: payment.id,
        invoice_id: invoiceId,
        amount: amount,
      });

    if (allocationError) {
      setError(allocationError.message);
      setLoading(false);
      return;
    }

    // 4. Determine new status and update invoice
    const newTotalPaid = amountAlreadyPaid + amount;
    let newStatus = "partially_paid";
    
    // If fully paid (allow tiny 1 kobo rounding difference)
    if (Math.abs(invoiceTotal - newTotalPaid) < 1) {
      newStatus = "paid";
    }

    await supabase
      .from("invoices")
      .update({ 
        status: newStatus,
        amount_paid: newTotalPaid
      })
      .eq("id", invoiceId);

    setIsOpen(false);
    router.refresh();
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md shadow-sm"
      >
        Record Payment
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-[#0A1F44] mb-1">Record Payment</h2>
        <p className="text-sm text-slate-500 mb-4">Outstanding Balance: ₦{outstandingBalance.toLocaleString()}</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount Received (₦) *</label>
            <input type="number" name="amount" step="0.01" required defaultValue={outstandingBalance} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date Received *</label>
            <input type="date" name="received_on" required defaultValue={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method *</label>
            <select name="method" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none">
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Reference</label>
            <input type="text" name="reference" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none" placeholder="e.g., Bank Ref 12345" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md disabled:opacity-50">
              {loading ? "Saving..." : "Confirm Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}