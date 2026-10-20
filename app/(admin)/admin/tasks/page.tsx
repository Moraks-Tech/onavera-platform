export const instant = false;

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CentralTasksPage() {
  const supabase = await createClient();

  // Fetch all tasks, joining project names
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(`
      *,
      projects (name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="text-red-600 p-4 bg-red-50 rounded">Error loading tasks: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">All Tasks</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your work across all projects.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        {!tasks || tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-700">No tasks found</p>
            <p className="text-sm mt-1">Tasks you create inside projects will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-medium">Task</th>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/tasks/${task.id}`} className="font-medium text-[#0A1F44] hover:text-[#1E40AF]">
                      {task.title}
                    </Link>
                    <div className="text-xs text-slate-400 mt-0.5">{task.task_reference}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{task.projects?.name || "Unknown"}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 capitalize">{task.priority}</td>
                  <td className="px-6 py-4 text-slate-600">{task.due_date || "â€”"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
