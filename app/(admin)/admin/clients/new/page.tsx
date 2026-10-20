export const instant = false;

import Link from "next/link";
import ClientForm from "@/components/admin/ClientForm";

export default function NewClientPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/clients" className="text-sm font-medium text-slate-500 hover:text-[#1E40AF] transition-colors">
          &larr; Back to Clients
        </Link>
        <h1 className="text-2xl font-bold text-[#0A1F44] mt-2">Add New Client</h1>
      </div>
      <ClientForm />
    </div>
  );
}
