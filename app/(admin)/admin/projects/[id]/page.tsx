import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TaskForm from "@/components/admin/TaskForm";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  noStore(); // This is the correct Next.js 16 way to prevent static caching
  
  const { id } = await params;
  const supabase = await createClient();

  // Fetch project details
  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      clients (name, organisation_name, first_name, last_name, type)
    `)
    .eq("id", id)
    .single();

  if (error || !project) notFound();

  // Fetch tasks for this project
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  // Format client name safely
  let clientName = "Internal Project";
  if (project.clients) {
    clientName = project.clients.organisation_name || project.clients.name || "Unknown Client";
  }

  // Calculate metrics
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === "completed").length || 0;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-50 text-green-700 border-green-200";
      case "in_progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "blocked": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link href="/admin/projects" className="text-sm font-medium text-slate-500 hover:text-[#1E40AF] transition-colors">
            &larr; Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-[#0A1F44] mt-2">{project.name}</h1>
          <p className="text-slate-600 mt-1">Client: <span className="font-medium text-slate-900">{clientName}</span></p>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/projects/${project.id}/edit`} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
            Edit Project
          </Link>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</div>
          <div className="text-lg font-bold text-[#0A1F44] mt-1 capitalize">{project.status.replace("_", " ")}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Budget</div>
          <div className="text-lg font-bold text-[#0A1F44] mt-1">₦{Number(project.amount || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Deadline</div>
          <div className="text-lg font-bold text-[#0A1F44] mt-1">{project.target_date || "Not set"}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Progress</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-lg font-bold text-[#0A1F44]">{progress}%</div>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1E40AF]" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Scope & Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2 mb-4">Scope & Objectives</h2>
            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <span className="block font-medium text-slate-900 mb-1">Description</span>
                <p className="whitespace-pre-wrap">{project.description || "No description provided."}</p>
              </div>
              <div>
                <span className="block font-medium text-slate-900 mb-1">Objectives</span>
                <p className="whitespace-pre-wrap">{project.objectives || "No objectives provided."}</p>
              </div>
              <div>
                <span className="block font-medium text-slate-900 mb-1">Deliverables</span>
                <p className="whitespace-pre-wrap">{project.scope || "No scope defined."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h2 className="text-lg font-semibold text-[#0A1F44]">Tasks ({totalTasks})</h2>
            </div>

            {/* Task Creation Form */}
            <TaskForm projectId={project.id} />

            {/* Task List */}
            {!tasks || tasks.length === 0 ? (
              <div className="text-center p-6 text-slate-500 text-sm">
                No tasks created yet. Use the form above to add your first task.
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between p-4 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors bg-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${getStatusColor(task.status)}`}>
                          {task.status.replace("_", " ")}
                        </span>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{task.task_reference || task.id.slice(0, 8)}</span>
                      </div>
                      <Link href={`/admin/tasks/${task.id}`} className="block mt-1 group">
                        <h3 className="font-medium text-slate-900 group-hover:text-[#1E40AF] transition-colors">{task.title}</h3>
                      </Link>
                      {task.due_date && (
                        <p className="text-xs text-slate-500 mt-1">Due: {task.due_date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}