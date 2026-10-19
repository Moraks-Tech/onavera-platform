import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ClientForm from "@/components/admin/ClientForm";
import { notFound } from "next/navigation";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // This fixes the 404!
  const supabase = await createClient();
  
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/clients" className="text-sm font-medium text-slate-500 hover:text-[#1E40AF] transition-colors">
          &larr; Back to Clients
        </Link>
        <h1 className="text-2xl font-bold text-[#0A1F44] mt-2">Edit Client</h1>
      </div>
      <ClientForm initialData={client} />
    </div>
  );
}