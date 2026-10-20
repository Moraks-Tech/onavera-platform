"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  // Form State
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  
  // Line Items State
  const [items, setItems] = useState([
    { description: "", quantity: 1, unit_price: 0, tax_rate: 7.5 }
  ]);

  // Initialize Supabase and fetch clients
  useEffect(() => {
    const supabase = createClient();
    supabase.from("clients").select("id, name, organisation_name, first_name, last_name, type, email, address").then(({ data }) => {
      if (data) setClients(data);
    });
  }, []);

  // Fetch projects when client changes
  useEffect(() => {
    if (!clientId) {
      setProjects([]);
      return;
    }
    const supabase = createClient();
    supabase.from("projects").select("id, name").eq("client_id", clientId).then(({ data }) => {
      if (data) setProjects(data);
    });
  }, [clientId]);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const taxAmount = items.reduce((acc, item) => acc + ((item.quantity * item.unit_price) * (item.tax_rate / 100)), 0);
  const total = subtotal + taxAmount;

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit_price: 0, tax_rate: 7.5 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const selectedClient = clients.find(c => c.id === clientId);

    // 1. Create the Invoice Header
    const invoicePayload = {
      invoice_number: `ONA-INV-${Date.now()}`, // Simplistic for now, we'll improve this later
      client_id: clientId,
      project_id: projectId || null,
      issue_date: issueDate,
      due_date: dueDate || issueDate,
      status: "issued",
      subtotal,
      tax: taxAmount,
      total,
      billing_name_snapshot: selectedClient?.organisation_name || selectedClient?.first_name + " " + selectedClient?.last_name,
      billing_email_snapshot: selectedClient?.email,
      billing_address_snapshot: selectedClient?.address,
    };

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert(invoicePayload)
      .select()
      .single();

    if (invoiceError) {
      setError(invoiceError.message);
      setLoading(false);
      return;
    }

    // 2. Create the Line Items
    const lineItemsPayload = items.map(item => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate,
      line_total: (item.quantity * item.unit_price) + ((item.quantity * item.unit_price) * (item.tax_rate / 100))
    }));

    const { error: itemsError } = await supabase.from("invoice_items").insert(lineItemsPayload);

    if (itemsError) {
      setError(itemsError.message);
      setLoading(false);
      return;
    }

    router.push(`/admin/invoices/${invoice.id}`);
    router.refresh();
  }

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-900 bg-white";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/invoices" className="text-sm font-medium text-slate-500 hover:text-[#1E40AF]">&larr; Back to Invoices</Link>
        <h1 className="text-2xl font-bold text-[#0A1F44] mt-2">Create Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">{error}</div>}

        {/* Client & Details */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2">1. Client & Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client *</label>
              <select required value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputClass}>
                <option value="">Select Client...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.type === "organisation" ? c.organisation_name : `${c.first_name} ${c.last_name}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project (Optional)</label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={inputClass} disabled={!clientId}>
                <option value="">No specific project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date *</label>
              <input type="date" required value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date *</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2">2. Line Items</h2>
          
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-end border-b border-slate-100 pb-3">
              <div className="col-span-12 md:col-span-5">
                <label className="block text-xs text-slate-500 mb-1">Description</label>
                <input type="text" required placeholder="Service or Product" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} className={inputClass} />
              </div>
              <div className="col-span-3 md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Qty</label>
                <input type="number" required min="1" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))} className={inputClass} />
              </div>
              <div className="col-span-4 md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Price (â‚¦)</label>
                <input type="number" required min="0" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", Number(e.target.value))} className={inputClass} />
              </div>
              <div className="col-span-3 md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Tax (%)</label>
                <input type="number" min="0" value={item.tax_rate} onChange={(e) => handleItemChange(index, "tax_rate", Number(e.target.value))} className={inputClass} />
              </div>
              <div className="col-span-2 md:col-span-1 text-right pb-2">
                <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
              </div>
            </div>
          ))}
          
          <button type="button" onClick={addItem} className="text-sm font-medium text-[#1E40AF] hover:underline">
            + Add Line Item
          </button>
        </div>

        {/* Totals & Save */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1 text-sm text-slate-600 w-full md:w-1/2">
            <div className="flex justify-between border-b pb-1"><span>Subtotal:</span> <span>â‚¦{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between border-b pb-1"><span>Tax:</span> <span>â‚¦{taxAmount.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-[#0A1F44] text-lg mt-2"><span>Total:</span> <span>â‚¦{total.toLocaleString()}</span></div>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/invoices" className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded disabled:opacity-50">
              {loading ? "Saving..." : "Save & Issue Invoice"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


