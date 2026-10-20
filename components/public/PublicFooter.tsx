import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="bg-[#0A1F44] text-slate-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="text-xl font-bold text-white mb-2">
            ONAVERA<span className="text-[#C9A227]"> Technologies</span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Creating Pathways to Progress. We build software, secure digital infrastructure, and deliver technology products for forward-thinking organizations.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-white">Portfolio</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-white">Get a Quote</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-slate-700 text-xs text-slate-500 text-center">
        © 2026 ONAVERA Technologies. All rights reserved.
      </div>
    </footer>
  );
}