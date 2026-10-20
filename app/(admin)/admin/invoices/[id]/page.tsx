export const instant = false;
import PrintButton from "@/components/admin/PrintButton";
import RecordPaymentModal from "@/components/admin/RecordPaymentModal";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch the invoice header
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select(`
      *,
      clients (organisation_name, first_name, last_name, email, address)
    `)
    .eq("id", id)
    .single();

  if (error || !invoice) notFound();

  // 2. Fetch the line items
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("created_at", { ascending: true });

  const clientName = invoice.clients?.organisation_name || `${invoice.clients?.first_name} ${invoice.clients?.last_name}` || "Unknown Client";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-center">
        <div>
          <Link href="/admin/invoices" className="text-sm font-medium text-slate-500 hover:text-[#1E40AF]">
            &larr; Back to Invoices
          </Link>
          <h1 className="text-2xl font-bold text-[#0A1F44] mt-2">Invoice {invoice.invoice_number}</h1>
        </div>
        <div className="flex gap-3">
          <PrintButton />
                  <RecordPaymentModal 
            invoiceId={invoice.id} 
            clientId={invoice.client_id} 
            invoiceTotal={Number(invoice.total)}
            amountAlreadyPaid={Number(invoice.amount_paid || 0)} 
          />
        </div>
      </div>

      {/* INVOICE PAPER PREVIEW */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-10">
        
        {/* Top: Brand & Status */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0A1F44]">ONAVERA<span className="text-[#C9A227]"> Technologies</span></h2>
            <p className="text-sm text-slate-500 mt-1">Creating Pathways to Progress</p>
            <div className="mt-4 text-sm text-slate-600 space-y-1">
              <p>hello@onavera.com</p>
              <p>+234 800 000 0000</p>
              <p>Lagos, Nigeria</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice</div>
            <div className="text-xl font-semibold text-[#0A1F44]">{invoice.invoice_number}</div>
            <div className="mt-2 text-sm text-slate-600">
              <p><span className="text-slate-400">Issue Date:</span> {invoice.issue_date}</p>
              <p><span className="text-slate-400">Due Date:</span> {invoice.due_date}</p>
            </div>
            <div className="mt-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                invoice.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Billed To */}
        <div className="py-8">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</div>
          <div className="text-slate-900 font-medium text-lg">{invoice.billing_name_snapshot || clientName}</div>
          <div className="text-sm text-slate-600 mt-1">
            <p>{invoice.billing_email_snapshot || invoice.clients?.email}</p>
            <p>{invoice.billing_address_snapshot || invoice.clients?.address}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-left border-collapse mt-4">
          <thead>
            <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <th className="py-3 font-medium">Description</th>
              <th className="py-3 font-medium text-center">Qty</th>
              <th className="py-3 font-medium text-right">Price</th>
              <th className="py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items?.map((item) => (
              <tr key={item.id}>
                <td className="py-4 text-slate-900 font-medium">{item.description}</td>
                <td className="py-4 text-slate-600 text-center">{item.quantity}</td>
                <td className="py-4 text-slate-600 text-right">₦{Number(item.unit_price).toLocaleString()}</td>
                <td className="py-4 text-slate-900 font-medium text-right">₦{Number(item.line_total).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₦{Number(invoice.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span>₦{Number(invoice.tax).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-lg text-[#0A1F44]">
              <span>Total</span>
              <span>₦{Number(invoice.total).toLocaleString()}</span>
            </div>
            
            {/* NEW: Paid and Outstanding Section */}
            {Number(invoice.amount_paid) > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Amount Paid</span>
                  <span>- ₦{Number(invoice.amount_paid).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t-2 border-slate-800 pt-2 font-bold text-xl text-[#0A1F44]">
                  <span>Outstanding</span>
                  <span>₦{(Number(invoice.total) - Number(invoice.amount_paid)).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-xs text-slate-500">
          <p className="font-bold text-slate-700 mb-1">Payment Terms</p>
          <p>Please pay within 14 days of the issue date. Bank transfer details will be provided upon request.</p>
        </div>
      </div>
    </div>
  );
}