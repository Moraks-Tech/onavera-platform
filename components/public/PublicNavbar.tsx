import Link from "next/link";

export default function PublicNavbar() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#0A1F44]">
          ONAVERA<span className="text-[#C9A227]"> Technologies</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-700">
          <Link href="/about" className="hover:text-[#1E40AF] transition-colors">About</Link>
          <Link href="/services" className="hover:text-[#1E40AF] transition-colors">Services</Link>
          <Link href="/portfolio" className="hover:text-[#1E40AF] transition-colors">Portfolio</Link>
          <Link href="/contact" className="hover:text-[#1E40AF] transition-colors">Contact</Link>
        </nav>
        <Link
          href="/contact"
          className="hidden md:inline-flex px-5 py-2.5 bg-[#0A1F44] text-white text-sm font-medium rounded-md hover:bg-[#1E40AF] transition-colors shadow-sm"
        >
          Let's Build Something
        </Link>
      </div>
    </header>
  );
}