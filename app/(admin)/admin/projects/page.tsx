import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  
  // Fetch projects and join with clients table to get the client's name
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      *,
      clients (name, organisation_name, type, first_name, last_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="text-red-600 p-4 bg-red-50 rounded">Error loading projects: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Projects</h1>
          <p className="text-sm text-slate-600 mt-1">Track your active work and deliverables.</p>
        </div>
        <Link href="/admin/projects/new" className="px-4 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md shadow-sm transition-colors">
          + New Project
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        {!projects || projects.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-700">No projects yet</p>
            <p className="text-sm mt-1">Create a project and assign it to a client.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-medium">Project Name</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((project) => {
                // Handle both individual, org, and internal project client names safely
                let clientName = "Internal Project";
                if (project.clients) {
                  clientName = project.clients.organisation_name || project.clients.name || "Unknown Client";
                }
                
                return (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{project.name}</td>
                    <td className="px-6 py-4 text-slate-600">{clientName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      ₦{Number(project.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/projects/${project.id}`} className="text-sm font-medium text-[#1E40AF] hover:text-[#0A1F44] transition-colors">
                        View
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