import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all the data we need for the dashboard safely
  const [projectsRes, invoicesRes, paymentsRes, expensesRes] = await Promise.all([
    supabase.from("projects").select("id, status"),
    supabase.from("invoices").select("id, total, amount_paid, status, invoice_number, created_at, client_id").order("created_at", { ascending: false }).limit(5),
    supabase.from("payments").select("amount").eq("verification", "verified"),
    supabase.from("expenses").select("amount").eq("status", "paid")
  ]);

  const projects = projectsRes.data || [];
  const recentInvoices = invoicesRes.data || [];
  const payments = paymentsRes.data || [];
  const expenses = expensesRes.data || [];

  // Fetch all clients to map names manually (avoids complex join errors)
  const { data: allClients } = await supabase.from("clients").select("id, organisation_name, first_name, last_name");
  
  const getClientName = (clientId: string) => {
    const client = allClients?.find(c => c.id === clientId);
    if (!client) return "Unknown Client";
    return client.organisation_name || `${client.first_name || ""} ${client.last_name || ""}`.trim() || "Unknown Client";
  };

  // Calculations
  const activeProjects = projects.filter(p => p.status === "in_progress").length;
  const totalCashReceived = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const outstandingReceivables = recentInvoices
    .filter(i => i.status !== "paid" && i.status !== "draft" && i.status !== "cancelled")
    .reduce((sum, i) => sum + (Number(i.total) - Number(i.amount_paid || 0)), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">Welcome back, {user?.email}</p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cash Received</div>
          <div className="text-2xl font-bold text-green-600 mt-2">₦{totalCashReceived.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Outstanding Receivables</div>
          <div className="text-2xl font-bold text-amber-600 mt-2">₦{outstandingReceivables.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Operating Expenses</div>
          <div className="text-2xl font-bold text-red-600 mt-2">₦{totalExpenses.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Projects</div>
          <div className="text-2xl font-bold text-[#0A1F44] mt-2">{activeProjects}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT INVOICES */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="font-semibold text-[#0A1F44]">Recent Invoices</h2>
            <Link href="/admin/invoices" className="text-sm font-medium text-[#1E40AF] hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentInvoices.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">No invoices yet.</div>
            ) : (
              recentInvoices.map((inv) => (
                <div key={inv.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <Link href={`/admin/invoices/${inv.id}`} className="font-medium text-[#0A1F44] hover:text-[#1E40AF]">{inv.invoice_number}</Link>
                    <div className="text-xs text-slate-500 mt-0.5">{getClientName(inv.client_id)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-900">₦{Number(inv.total).toLocaleString()}</div>
                    <div className="text-xs mt-0.5 capitalize text-slate-500">{inv.status.replace("_", " ")}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-[#0A1F44] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/clients/new" className="p-4 border border-slate-200 rounded-lg text-center hover:bg-slate-50 hover:border-[#1E40AF] transition-colors">
              <div className="text-sm font-medium text-[#0A1F44]">Add Client</div>
            </Link>
            <Link href="/admin/projects/new" className="p-4 border border-slate-200 rounded-lg text-center hover:bg-slate-50 hover:border-[#1E40AF] transition-colors">
              <div className="text-sm font-medium text-[#0A1F44]">New Project</div>
            </Link>
            <Link href="/admin/invoices/new" className="p-4 border border-slate-200 rounded-lg text-center hover:bg-slate-50 hover:border-[#1E40AF] transition-colors">
              <div className="text-sm font-medium text-[#0A1F44]">Create Invoice</div>
            </Link>
            <Link href="/admin/expenses/new" className="p-4 border border-slate-200 rounded-lg text-center hover:bg-slate-50 hover:border-[#1E40AF] transition-colors">
              <div className="text-sm font-medium text-[#0A1F44]">Record Expense</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}