import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, organisation_name, first_name, last_name, type")
    .order("created_at", { ascending: false });

  if (!project) notFound();

  const formattedClients = (clients || []).map(c => ({
    id: c.id,
    name: c.type === 'organisation' ? c.organisation_name : `${c.first_name} ${c.last_name}`
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/admin/projects/${id}`} className="text-sm font-medium text-slate-500 hover:text-[#1E40AF] transition-colors">
          &larr; Back to Project
        </Link>
        <h1 className="text-2xl font-bold text-[#0A1F44] mt-2">Edit Project: {project.name}</h1>
      </div>
      <ProjectForm initialData={project} clients={formattedClients} />
    </div>
  );
}