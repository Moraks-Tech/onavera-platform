"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ContactForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setSelectedService(serviceParam);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      service: formData.get("service"),
      message: formData.get("message"),
    };

    const { error: insertError } = await supabase.from("contact_enquiries").insert(payload);

    if (insertError) {
      setError("Something went wrong. Please try again or contact us directly.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  const inputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E40AF] outline-none text-slate-900 bg-white placeholder:text-slate-400";

  if (success) {
    return (
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl text-center py-16">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-[#0A1F44] mb-2">Message Sent!</h2>
        <p className="text-slate-600">Thank you for reaching out. We will get back to you shortly.</p>
        <button onClick={() => setSuccess(false)} className="mt-6 text-sm font-medium text-[#1E40AF] hover:underline">Send another message</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-2xl font-bold text-[#0A1F44] mb-6">Send an Enquiry</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input type="text" name="name" required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
          <input type="email" name="email" required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
          <input type="tel" name="phone" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Service Interested In *</label>
          <select 
            name="service" 
            required 
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className={inputClass}
          >
            <option value="">Select a service...</option>
            <option value="software">Software Development</option>
            <option value="cybersecurity">Cybersecurity</option>
            <option value="data">Data Analytics</option>
            <option value="products">Technology Products</option>
            <option value="maintenance">Website/Software Maintenance</option>
            <option value="general">General Enquiry</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
          <textarea name="message" rows={4} required placeholder="Tell us about your project or needs..." className={inputClass}></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-[#0A1F44] text-white font-bold rounded-md hover:bg-[#1E40AF] transition-colors disabled:opacity-50 mt-2">
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div 
      className="min-h-screen py-8 px-6 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=1600&auto=format&fit=crop&q=60')" }}
    >
      <div className="absolute inset-0 bg-[#0A1F44]/90"></div>

      {/* PROFESSIONAL BREADCRUMB HEADER */}
      <div className="max-w-6xl mx-auto relative z-10 mb-12">
        <nav className="flex items-center text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <span className="mx-2 text-slate-600">/</span>
          <span className="text-white">Contact</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        <div className="text-white">
          <h1 className="text-4xl font-bold">Let's Build Something.</h1>
          <p className="mt-4 text-lg text-slate-300 leading-relaxed">
            Whether you need a custom software solution, a security assessment, or a data dashboard, we are ready to help you navigate the technical decisions.
          </p>
          
          <div className="mt-12 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#C9A227] uppercase tracking-widest mb-1">Email Us</h3>
              <a href="mailto:onaveratech49@gmail.com" className="text-lg font-medium hover:text-[#C9A227] transition-colors">onaveratech49@gmail.com</a>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#C9A227] uppercase tracking-widest mb-1">Call Us</h3>
              <p className="text-lg font-medium">0915 262 5084</p>
              <p className="text-lg font-medium">0802 223 1742</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#C9A227] uppercase tracking-widest mb-1">Location</h3>
              <p className="text-lg font-medium">Nigeria</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="bg-white p-10 rounded-2xl shadow-xl flex items-center justify-center text-slate-500">Loading form...</div>}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}