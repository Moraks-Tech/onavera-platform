"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ProjectForm({ 
  initialData, 
  clients 
}: { 
  initialData?: any; 
  clients: { id: string, name: string }[] 
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [projectType, setProjectType] = useState<"client" | "internal">(
    initialData?.project_type || "client"
  );
  
  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const payload = {
      project_type: projectType,
      client_id: projectType === "client" ? formData.get("client_id") : null,
      name: formData.get("name"),
      description: formData.get("description") || null,
      scope: formData.get("scope") || null,
      objectives: formData.get("objectives") || null,
      service_category: formData.get("service_category") || null,
      amount: parseFloat(formData.get("amount") as string) || 0,
      status: formData.get("status"),
      priority: formData.get("priority") || "normal",
      start_date: formData.get("start_date") || null,
      target_date: formData.get("target_date") || null,
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("projects")
        .insert(payload);
      error = insertError;
    }

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-900 placeholder:text-slate-400 transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-8 shadow-sm">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* SECTION 1: BASIC INFO & TYPE */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2">1. Project Basics</h2>
        
        <div className="flex gap-4 p-1 bg-slate-100 rounded-lg w-fit mb-4">
          <button
            type="button"
            onClick={() => setProjectType("client")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${projectType === "client" ? "bg-white text-[#0A1F44] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Client Project
          </button>
          <button
            type="button"
            onClick={() => setProjectType("internal")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${projectType === "internal" ? "bg-white text-[#0A1F44] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Internal Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Project Name / Title *</label>
            <input type="text" name="name" required defaultValue={initialData?.name} className={inputClass} placeholder="e.g., School Portal Redesign" />
          </div>

          {projectType === "client" && (
            <div className="md:col-span-2">
              <label className={labelClass}>Client *</label>
              <select name="client_id" required defaultValue={initialData?.client_id || ""} className={inputClass}>
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={labelClass}>Service Category</label>
            <select name="service_category" defaultValue={initialData?.service_category || ""} className={inputClass}>
              <option value="">Select category...</option>
              <option value="Website">Website Development</option>
              <option value="Software">Software Development</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Data">Data Analytics</option>
              <option value="Design">UI/UX Design</option>
              <option value="Other">Other</option>
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
            <select name="status" defaultValue={initialData?.status || "proposal"} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="proposal">Proposal Sent</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Agreed Amount / Budget (NGN)</label>
            <input type="number" name="amount" step="0.01" defaultValue={initialData?.amount || ""} className={inputClass} placeholder="0.00" />
          </div>
        </div>
      </div>

      {/* SECTION 2: SCOPE & TIMELINE */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2">2. Scope & Timeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Start Date</label>
            <input type="date" name="start_date" defaultValue={initialData?.start_date} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Target Completion Date</label>
            <input type="date" name="target_date" defaultValue={initialData?.target_date} className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Executive Summary / Description</label>
            <textarea name="description" rows={2} defaultValue={initialData?.description} className={inputClass} placeholder="Short summary of the project..." />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Objectives</label>
            <textarea name="objectives" rows={3} defaultValue={initialData?.objectives} className={inputClass} placeholder="What are the main goals of this project?" />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Detailed Scope & Deliverables</label>
            <textarea name="scope" rows={4} defaultValue={initialData?.scope} className={inputClass} placeholder="List the specific features, pages, or items to be delivered..." />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
        <Link href="/admin/projects" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md disabled:opacity-50 transition-colors shadow-sm">
          {loading ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
        </button>
      </div>
    </form>
  );
}