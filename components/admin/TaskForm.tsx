"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function TaskForm({ projectId, initialData }: { projectId: string, initialData?: any }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const payload = {
      project_id: projectId,
      title: formData.get("title"),
      description: formData.get("description") || null,
      task_type: formData.get("task_type"),
      priority: formData.get("priority"),
      status: formData.get("status"),
      planned_start_date: formData.get("planned_start_date") || null,
      due_date: formData.get("due_date") || null,
      estimated_hours: parseFloat(formData.get("estimated_hours") as string) || null,
      acceptance_criteria: formData.get("acceptance_criteria") || null,
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase
        .from("tasks")
        .update(payload)
        .eq("id", initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("tasks")
        .insert(payload);
      error = insertError;
    }

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Fix: Reset form and loading state BEFORE refreshing
    formRef.current?.reset();
    setLoading(false);
    
    // Refresh the page to show the new task
    router.refresh();
  }

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-900 placeholder:text-slate-400 transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-slate-50 rounded-lg border border-slate-200 p-5 space-y-5 shadow-sm mb-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Task Title *</label>
          <input type="text" name="title" required defaultValue={initialData?.title} className={inputClass} placeholder="e.g., Design Homepage UI" />
        </div>

        <div>
          <label className={labelClass}>Task Type</label>
          <select name="task_type" defaultValue={initialData?.task_type || "development"} className={inputClass}>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="research">Research</option>
            <option value="testing">Testing</option>
            <option value="documentation">Documentation</option>
            <option value="review">Review</option>
            <option value="client_communication">Client Communication</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Priority</label>
          <select name="priority" defaultValue={initialData?.priority || "normal"} className={inputClass}>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={initialData?.status || "open"} className={inputClass}>
            <option value="open">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Estimated Hours</label>
          <input type="number" step="0.5" name="estimated_hours" defaultValue={initialData?.estimated_hours} className={inputClass} placeholder="0.0" />
        </div>

        <div>
          <label className={labelClass}>Start Date</label>
          <input type="date" name="planned_start_date" defaultValue={initialData?.planned_start_date} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Due Date</label>
          <input type="date" name="due_date" defaultValue={initialData?.due_date} className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea name="description" rows={2} defaultValue={initialData?.description} className={inputClass} placeholder="What needs to be done?" />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Acceptance Criteria (Definition of Done)</label>
          <textarea name="acceptance_criteria" rows={2} defaultValue={initialData?.acceptance_criteria} className={inputClass} placeholder="How do we know this is complete?" />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
        {isEditing ? (
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
            Cancel
          </button>
        ) : (
          <button type="button" onClick={() => formRef.current?.reset()} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
            Clear
          </button>
        )}
        <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md disabled:opacity-50 transition-colors shadow-sm">
          {loading ? "Saving..." : isEditing ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
}