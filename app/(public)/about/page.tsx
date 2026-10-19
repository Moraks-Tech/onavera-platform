export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* HEADER WITH BACKGROUND IMAGE */}
      <div 
        className="relative py-24 px-6 text-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&auto=format&fit=crop&q=60')" 
        }}
      >
        <div className="absolute inset-0 bg-[#0A1F44]/85"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white">About ONAVERA</h1>
          <p className="mt-4 text-lg text-slate-200">
            We are a technology company dedicated to solving practical problems through software, data, and security.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
        
        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#1E40AF] transition-colors">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#0A1F44]"></div>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              To build and deliver reliable, secure, accessible, and innovative technology solutions that improve how people and organizations operate. We strive to create software that is not just functional, but transformative for the institutions that rely on it.
            </p>
          </div>
          
          <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#1E40AF] transition-colors">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#C9A227]"></div>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              To become a trusted African technology company delivering practical digital solutions to businesses and institutions locally and internationally, known for our integrity, security-consciousness, and unwavering commitment to progress.
            </p>
          </div>
        </div>

        {/* CORE VALUES */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A1F44]">Our Core Values</h2>
            <p className="text-slate-600 mt-2">The principles that guide everything we build.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Innovation", desc: "Finding modern, efficient solutions to complex operational problems." },
              { title: "Integrity", desc: "Being transparent, honest, and ethical in all our business dealings." },
              { title: "Reliability", desc: "Delivering on our promises and building systems that don't break." },
              { title: "Security", desc: "Protecting our clients' data and digital assets with strict standards." }
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#0A1F44]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0A1F44] font-bold text-xl">{idx + 1}</span>
                </div>
                <h3 className="font-bold text-[#0A1F44] mb-2">{value.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}