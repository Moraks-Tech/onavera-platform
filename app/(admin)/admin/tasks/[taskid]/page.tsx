import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function TaskDetailsPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const supabase = await createClient();

  // Fetch task and its parent project details
  const { data: task, error } = await supabase
    .from("tasks")
    .select(`
      *,
      projects (id, name)
    `)
    .eq("id", taskId)
    .single();

  if (error || !task) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link href="/admin/projects" className="hover:text-[#1E40AF]">Projects</Link>
          <span>/</span>
          <Link href={`/admin/projects/${task.projects.id}`} className="hover:text-[#1E40AF]">{task.projects.name}</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{task.task_reference}</span>
        </div>
        <h1 className="text-3xl font-bold text-[#0A1F44]">{task.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COL: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2 mb-4">Description</h2>
            <p className="text-slate-600 whitespace-pre-wrap">{task.description || "No description provided."}</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2 mb-4">Acceptance Criteria</h2>
            <p className="text-slate-600 whitespace-pre-wrap">{task.acceptance_criteria || "No criteria defined."}</p>
          </div>
        </div>

        {/* RIGHT COL: Meta */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 space-y-4 text-sm">
            <div>
              <span className="block text-slate-500 font-medium mb-1">Status</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                {task.status.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium mb-1">Priority</span>
              <span className="text-slate-900 capitalize">{task.priority}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium mb-1">Type</span>
              <span className="text-slate-900 capitalize">{task.task_type.replace("_", " ")}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium mb-1">Due Date</span>
              <span className="text-slate-900">{task.due_date || "Not set"}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium mb-1">Est. Hours</span>
              <span className="text-slate-900">{task.estimated_hours ? `${task.estimated_hours} hours` : "Not estimated"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}