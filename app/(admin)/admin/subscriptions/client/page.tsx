"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ClientSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubs() {
      const supabase = createClient();
      const { data } = await supabase
        .from("subscriptions")
        .select(`
          *,
          clients (organisation_name, first_name, last_name, type)
        `)
        .eq("direction", "client")
        .order("created_at", { ascending: false });
      if (data) setSubscriptions(data);
      setLoading(false);
    }
    fetchSubs();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Client Subscriptions</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your recurring revenue and client service plans.</p>
        </div>
        <Link 
          href="/admin/subscriptions/client/new" 
          className="px-4 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md shadow-sm transition-colors"
        >
          + New Subscription
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : subscriptions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-700">No client subscriptions</p>
            <p className="text-sm mt-1">Set up recurring packages (like monthly website maintenance) for your clients.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Service Name</th>
                <th className="px-6 py-3 font-medium">Billing</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {subscriptions.map((sub) => {
                const clientName = sub.clients?.organisation_name || 
                  `${sub.clients?.first_name || ""} ${sub.clients?.last_name || ""}`.trim() || 
                  "Unknown";
                  
                return (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#0A1F44]">{clientName}</td>
                    <td className="px-6 py-4 text-slate-600">{sub.name}</td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{sub.billing_frequency}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                        sub.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      â‚¦{Number(sub.price).toLocaleString()}
                    </td>
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

