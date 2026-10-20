import Link from "next/link";

export default function ServicesPage() {
  const divisions = [
    {
      id: "software",
      title: "Software & Digital Solutions",
      desc: "We design and develop custom software tailored to your exact operational needs. From public-facing websites to complex internal systems.",
      features: ["Business Websites", "School Management Systems", "CBT Platforms", "Custom Web Apps", "API Integrations"],
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity & IT Services",
      desc: "Protect your digital assets and ensure your applications are configured securely to prevent unauthorized access and data loss.",
      features: ["Security Assessments", "Secure App Development", "Access Control Reviews", "IT Support"],
      image: "https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "data",
      title: "Data Analytics & Business Intelligence",
      desc: "We help you make sense of your data. We clean, organize, and visualize your information so you can make better business decisions.",
      features: ["Interactive Dashboards", "Data Cleaning", "Spreadsheet Automation", "Operational Reporting"],
      image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "products",
      title: "Proprietary Technology Products",
      desc: "We are building a suite of internal and commercial products focused on education, business management, and workflow automation.",
      features: ["Examination Systems", "Business Management Tools", "Workflow Automation"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="bg-white">
      {/* PROFESSIONAL BREADCRUMB HEADER */}
      <div className="bg-[#0A1F44] pt-6 pb-2">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex items-center text-sm font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-white">Services</span>
          </nav>
        </div>
      </div>

      {/* HEADER WITH BACKGROUND IMAGE */}
      <div 
        className="relative py-24 px-6 text-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1600&auto=format&fit=crop&q=60')" 
        }}
      >
        <div className="absolute inset-0 bg-[#0A1F44]/80"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white">Our Services</h1>
          <p className="mt-4 text-lg text-slate-200">
            Explore how ONAVERA Technologies can help your organization operate more efficiently and securely.
          </p>
        </div>
      </div>

      {/* SERVICES LIST */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {divisions.map((div, idx) => (
          <div key={div.id} id={div.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* TEXT CONTENT */}
            <div className={idx % 2 === 1 ? "md:order-2" : ""}>
              <h2 className="text-3xl font-bold text-[#0A1F44]">{div.title}</h2>
              <p className="mt-4 text-slate-600 text-lg leading-relaxed">{div.desc}</p>
              <ul className="mt-6 space-y-3">
                {div.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href={`/contact?service=${div.id}`} className="inline-flex px-6 py-2.5 bg-[#0A1F44] text-white font-medium rounded-md hover:bg-[#1E40AF] transition-colors shadow-sm">
                  Request a Quote
                </Link>
              </div>
            </div>

            {/* IMAGE CONTENT */}
            <div className={`relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-slate-200 ${idx % 2 === 1 ? "md:order-1" : ""}`}>
              <img 
                src={div.image} 
                alt={div.title} 
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}