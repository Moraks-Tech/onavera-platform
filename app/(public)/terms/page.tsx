export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* HEADER WITH BACKGROUND IMAGE */}
      <div 
        className="relative py-24 px-6 text-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&auto=format&fit=crop&q=60')" 
        }}
      >
        <div className="absolute inset-0 bg-[#0A1F44]/85"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="mt-4 text-lg text-slate-200">The rules and guidelines for using our services.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-200 text-slate-600 space-y-6">
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-[#0A1F44]">1. Website Use</h2>
          <p>This website is provided for informational purposes. By using it, you agree not to misuse the site or attempt to gain unauthorized access to our systems or databases.</p>
          
          <h2 className="text-xl font-bold text-[#0A1F44]">2. Enquiries and Contracts</h2>
          <p>Submitting a contact form does not create a binding contract. Any work ONAVERA Technologies performs will be governed by a specific, separate project proposal or service agreement agreed upon by both parties.</p>
          
          <h2 className="text-xl font-bold text-[#0A1F44]">3. Intellectual Property</h2>
          <p>All content, branding, and code on this site are the property of ONAVERA Technologies unless otherwise stated. You may not copy or reproduce our materials without permission.</p>
          
          <h2 className="text-xl font-bold text-[#0A1F44]">4. Limitation of Liability</h2>
          <p>ONAVERA Technologies provides the information on this website "as is" without warranties of any kind. We are not liable for any damages arising from the use of this site.</p>

          <div className="text-sm italic text-slate-500 mt-12 border-t border-slate-200 pt-6 bg-slate-50 p-4 rounded-md">
            Disclaimer: This is a standard template. ONAVERA should consult with a legal professional to finalize these terms.
          </div>
        </div>
      </div>
    </div>
  );
}