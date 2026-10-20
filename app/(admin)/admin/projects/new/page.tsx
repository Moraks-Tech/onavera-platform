export const instant = false;

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const supabase = await createClient();
  
  // Fetch clients to populate the dropdown in the form
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, organisation_name, first_name, last_name, type")
    .order("created_at", { ascending: false });

  // Format client names for the dropdown
  const formattedClients = (clients || []).map(c => ({
    id: c.id,
    name: c.type === 'organisation' ? c.organisation_name : `${c.first_name} ${c.last_name}`
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/projects" className="text-sm font-medium text-slate-500 hover:text-[#1E40AF] transition-colors">
          &larr; Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-[#0A1F44] mt-2">Create New Project</h1>
      </div>
      <ProjectForm clients={formattedClients} />
    </div>
  );
}
