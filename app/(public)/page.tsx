import Link from "next/link";

export default function HomePage() {
  const services = [
    { title: "Software Development", desc: "Custom web apps, school portals, and business systems designed to streamline operations." },
    { title: "Cybersecurity", desc: "Security assessments and secure configurations to protect your digital assets." },
    { title: "Data & Analytics", desc: "Transform raw data into actionable dashboards and automated reports." },
    { title: "Technology Products", desc: "Proprietary tools and platforms built for scale and ease of use." },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative py-28 px-6 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://plus.unsplash.com/premium_photo-1678566111481-8e275550b700?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D')",
          }}
        >
          <div className="absolute inset-0 bg-[#0A1F44]/85 mix-blend-multiply"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
            Creating Pathways to Progress.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            ONAVERA Technologies builds reliable, secure software and digital solutions that help schools, businesses, and institutions operate better and grow faster.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="px-8 py-3.5 bg-[#C9A227] text-[#0A1F44] font-bold rounded-md hover:bg-yellow-500 transition-colors shadow-lg">
              Let's Build Something
            </Link>
            <Link href="/services" className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-md hover:bg-white/10 transition-colors bg-transparent backdrop-blur-sm">
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="py-12 border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Technology built for schools, businesses, and institutions.
          </p>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0A1F44]">What We Do</h2>
            <p className="mt-4 text-slate-600">We solve practical problems through technology.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, idx) => (
              <Link href="/services" key={idx} className="block p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#1E40AF] hover:shadow-md transition-all group">
                <h3 className="text-lg font-bold text-[#0A1F44] group-hover:text-[#1E40AF] transition-colors">{svc.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{svc.desc}</p>
                <div className="mt-6 text-sm font-medium text-[#1E40AF] flex items-center gap-1">
                  Learn more <span aria-hidden="true">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-[#0A1F44]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Have an idea? Let's turn it into something meaningful.</h2>
          <p className="mt-4 text-lg text-slate-300">
            Reach out to discuss your project. We'll help you navigate the technical decisions and deliver a solution that works.
          </p>
          <div className="mt-8">
            <Link href="/contact" className="px-8 py-3.5 bg-[#C9A227] text-[#0A1F44] font-bold rounded-md hover:bg-yellow-500 transition-colors shadow-lg">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}