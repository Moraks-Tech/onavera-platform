export const instant = false;

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Clients</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your individual and organisation database.</p>
        </div>
        <Link
          href="/admin/clients/new"
          className="px-4 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md shadow-sm transition-colors"
        >
          + Add Client
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200 text-sm">
          Failed to load clients: {error.message}
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        {!clients || clients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-700">No clients yet</p>
            <p className="text-sm mt-1">Click "Add Client" to register your first individual or organisation.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => {
                // Determine the display name based on type
                const displayName = client.type === "organisation" 
                  ? client.organisation_name 
                  : `${client.first_name} ${client.last_name}`;

                return (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{displayName}</td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{client.type}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{client.email || "â€”"}</div>
                      <div className="text-xs">{client.primary_phone_e164 || ""}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 capitalize">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/clients/${client.id}`} className="text-sm font-medium text-[#1E40AF] hover:text-[#0A1F44] transition-colors">
                        Edit
                      </Link>
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
