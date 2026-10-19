"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import CustomPhoneInput from "@/components/ui/PhoneInput";
import { E164Number } from "libphonenumber-js";

export default function ClientForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for dynamic form fields
  const [clientType, setClientType] = useState<"individual" | "organisation">(
    initialData?.type || "individual"
  );
  const [primaryPhone, setPrimaryPhone] = useState<E164Number | undefined>(
    initialData?.primary_phone_e164 || undefined
  );

  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    // Dynamically build payload based on client type
    const payload: any = {
      type: clientType,
      status: formData.get("status") || "active",
      category: formData.get("category") || null,
      email: formData.get("email") || null,
      address: formData.get("address") || null,
      country: formData.get("country") || null,
      industry: formData.get("industry") || null,
      acquisition_source: formData.get("acquisition_source") || null,
      notes: formData.get("notes") || null,
      primary_phone_e164: primaryPhone || null,
    };

    if (clientType === "individual") {
      payload.first_name = formData.get("first_name");
      payload.last_name = formData.get("last_name");
      payload.name = `${payload.first_name} ${payload.last_name}`; // For legacy compatibility
    } else {
      payload.organisation_name = formData.get("organisation_name");
      payload.name = payload.organisation_name; // For legacy compatibility
      payload.contact_first_name = formData.get("contact_first_name");
      payload.contact_last_name = formData.get("contact_last_name");
    }

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase
        .from("clients")
        .update(payload)
        .eq("id", initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("clients")
        .insert(payload);
      error = insertError;
    }

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/clients");
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

      {/* SECTION 1: CLIENT TYPE & STATUS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2">1. Client Classification</h2>
        
        <div className="flex gap-4 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setClientType("individual")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${clientType === "individual" ? "bg-white text-[#0A1F44] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setClientType("organisation")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${clientType === "organisation" ? "bg-white text-[#0A1F44] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Organisation / Business
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <div>
            <label className={labelClass}>Client Category</label>
            <select name="category" defaultValue={initialData?.category || ""} className={inputClass}>
              <option value="">Select a category...</option>
              <option value="Small Business">Small Business</option>
              <option value="Corporate">Corporate</option>
              <option value="Educational Institution">Educational Institution</option>
              <option value="Startup">Startup</option>
              <option value="Non-Profit">Non-Profit</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Acquisition Source</label>
            <select name="acquisition_source" defaultValue={initialData?.acquisition_source || ""} className={inputClass}>
              <option value="">How did they find us?</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Social Media">Social Media</option>
              <option value="Direct Contact">Direct Contact</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: DYNAMIC IDENTITY FIELDS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2">2. {clientType === "individual" ? "Personal Information" : "Organisation Information"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {clientType === "individual" ? (
            <>
              <div>
                <label className={labelClass}>First Name *</label>
                <input type="text" name="first_name" required defaultValue={initialData?.first_name} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input type="text" name="last_name" required defaultValue={initialData?.last_name} className={inputClass} />
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-2">
                <label className={labelClass}>Organisation Name *</label>
                <input type="text" name="organisation_name" required defaultValue={initialData?.organisation_name} className={inputClass} />
              </div>
            </>
          )}

          <div>
            <label className={labelClass}>Email Address {clientType === "individual" ? "*" : ""}</label>
            <input type="email" name="email" required={clientType === "individual"} defaultValue={initialData?.email} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Primary Phone *</label>
            <CustomPhoneInput value={primaryPhone} onChange={setPrimaryPhone} required />
          </div>

          <div>
            <label className={labelClass}>Industry / Sector</label>
            <input type="text" name="industry" defaultValue={initialData?.industry} placeholder="e.g., Education, IT, Healthcare" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input type="text" name="country" defaultValue={initialData?.country || "Nigeria"} className={inputClass} />
          </div>
        </div>
      </div>

      {/* SECTION 3: PRIMARY CONTACT (Only for Organisations) */}
      {clientType === "organisation" && (
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold text-[#0A1F44] border-b border-slate-200 pb-2">3. Primary Contact Person</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Contact First Name *</label>
              <input type="text" name="contact_first_name" required={clientType === "organisation"} defaultValue={initialData?.contact_first_name} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Last Name *</label>
              <input type="text" name="contact_last_name" required={clientType === "organisation"} defaultValue={initialData?.contact_last_name} className={inputClass} />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: LOCATION & NOTES */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0A1F44] border-b pb-2">{clientType === "organisation" ? "4" : "3"}. Location & Notes</h2>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className={labelClass}>Street Address</label>
            <input type="text" name="address" defaultValue={initialData?.address} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Internal Notes</label>
            <textarea name="notes" rows={3} defaultValue={initialData?.notes} className={inputClass} placeholder="Any special requirements or background info..." />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
        <button type="button" onClick={() => formRef.current?.reset()} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
          Clear Form
        </button>
        <div className="flex gap-3">
          <Link href="/admin/clients" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-[#0A1F44] hover:bg-[#1E40AF] rounded-md disabled:opacity-50 transition-colors shadow-sm">
            {loading ? "Saving..." : isEditing ? "Update Client" : "Register Client"}
          </button>
        </div>
      </div>
    </form>
  );
}