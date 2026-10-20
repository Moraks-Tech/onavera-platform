export const instant = false;

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select(`*, clients (organisation_name, first_name, last_name, type)`)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Invoices</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your billing and receivables.</p>
        </div>
        <Link href="/admin/invoices/new" className="px-4 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md shadow-sm">
          + Create Invoice
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        {!invoices || invoices.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-700">No invoices yet</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-medium">Invoice #</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => {
                // Fix: Check if it's an org or individual
                let clientName = "Unknown Client";
                if (invoice.clients) {
                  clientName = invoice.clients.organisation_name || 
                    `${invoice.clients.first_name || ""} ${invoice.clients.last_name || ""}`.trim() || 
                    "Unknown Client";
                }

                return (
                  <tr key={invoice.id} className="hover:bg-slate-50 text-slate-900">
                  <td className="px-6 py-4 font-medium text-[#0A1F44] hover:text-[#1E40AF] transition-colors">
  <Link href={`/admin/invoices/${invoice.id}`}>
    {invoice.invoice_number}
  </Link>
</td>
                    <td className="px-6 py-4 font-medium">{clientName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border ${
                        invoice.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : 
                        invoice.status === "partially_paid" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {invoice.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">â‚¦{Number(invoice.total || 0).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
