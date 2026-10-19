import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PortfolioPage() {
  const supabase = await createClient();

  // Fetch only projects marked as public AND completed
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_public", true)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HEADER WITH BACKGROUND IMAGE */}
      <div 
        className="relative py-24 px-6 text-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1600&auto=format&fit=crop&q=60')" 
        }}
      >
        <div className="absolute inset-0 bg-[#0A1F44]/85"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white">Our Portfolio</h1>
          <p className="mt-4 text-lg text-slate-200">
            Explore the software, platforms, and systems we have built for organizations.
          </p>
        </div>
      </div>

      {/* PROJECT GRID */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        {!projects || projects.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-[#0A1F44]">New Projects Coming Soon</h2>
            <p className="mt-2 text-slate-600">We are currently finalizing our public case studies. Check back soon or contact us to discuss a custom solution.</p>
            <Link href="/contact" className="inline-block mt-6 px-6 py-2.5 bg-[#0A1F44] text-white font-medium rounded-md hover:bg-[#1E40AF]">
              Discuss a Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="aspect-video bg-slate-100 border-b border-slate-200 relative">
                  {project.public_image_url ? (
                    <img src={project.public_image_url} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">No image available</div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="text-xs font-bold text-[#C9A227] uppercase tracking-widest mb-2">
                    {project.service_category || "Software"}
                  </div>
                  <h3 className="text-xl font-bold text-[#0A1F44] mb-2">{project.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {project.description || "A custom software solution built by ONAVERA Technologies."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}