import Link from "next/link";

export default function SubscriptionsLandingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Subscriptions</h1>
        <p className="text-sm text-slate-600 mt-1">Manage your recurring revenue and operating costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Subscriptions Card */}
        <Link href="/admin/subscriptions/client" className="block p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-[#1E40AF] transition-all group">
          <h2 className="text-lg font-bold text-[#0A1F44] group-hover:text-[#1E40AF]">Client Subscriptions &rarr;</h2>
          <p className="text-sm text-slate-600 mt-2">
            Manage services you sell to clients on a recurring basis (e.g., Monthly Website Maintenance).
          </p>
        </Link>

        {/* Outgoing Subscriptions Card */}
        <Link href="/admin/subscriptions/outgoing" className="block p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-[#1E40AF] transition-all group">
          <h2 className="text-lg font-bold text-[#0A1F44] group-hover:text-[#1E40AF]">Outgoing Subscriptions &rarr;</h2>
          <p className="text-sm text-slate-600 mt-2">
            Track software and tools ONAVERA pays for (e.g., Vercel, Supabase, Hosting).
          </p>
        </Link>
      </div>
    </div>
  );
}