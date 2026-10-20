import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* PROFESSIONAL BREADCRUMB HEADER */}
      <div className="bg-[#0A1F44] pt-6 pb-2">
        <div className="max-w-3xl mx-auto px-6">
          <nav className="flex items-center text-sm font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-white">Privacy Policy</span>
          </nav>
        </div>
      </div>

      {/* HEADER WITH BACKGROUND IMAGE */}
      <div 
        className="relative py-24 px-6 text-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&auto=format&fit=crop&q=60')" 
        }}
      >
        <div className="absolute inset-0 bg-[#0A1F44]/85"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-4 text-lg text-slate-200">How we protect and manage your data.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-200 text-slate-600 space-y-6">
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          
          <h2 className="text-xl font-bold text-[#0A1F44]">1. Information We Collect</h2>
          <p>When you use our contact form, we collect your name, email address, phone number (optional), and the details of your enquiry. We do not collect payment information directly through this website.</p>
          
          <h2 className="text-xl font-bold text-[#0A1F44]">2. How We Use Your Information</h2>
          <p>We use the information you provide solely to respond to your enquiry, provide quotes, and communicate with you regarding potential or ongoing projects. We do not sell your personal data to third parties.</p>
          
          <h2 className="text-xl font-bold text-[#0A1F44]">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your information. Your data is stored securely and access is restricted to authorized ONAVERA personnel only.</p>
          
          <h2 className="text-xl font-bold text-[#0A1F44]">4. Contact Us</h2>
          <p>If you have questions about this policy, please contact us at onaveratech49@gmail.com.</p>
          
          <div className="text-sm italic text-slate-500 mt-12 border-t border-slate-200 pt-6 bg-slate-50 p-4 rounded-md">
            Disclaimer: This is a standard template. ONAVERA should consult with a legal professional to ensure full compliance with the Nigeria Data Protection Regulation (NDPR) and other applicable laws.
          </div>
        </div>
      </div>
    </div>
  );
}