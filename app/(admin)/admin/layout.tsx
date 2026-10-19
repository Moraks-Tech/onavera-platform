import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/expenses", label: "Expenses" },
  { href: "/admin/subscriptions/client", label: "Client Subscriptions" },
  { href: "/admin/subscriptions/outgoing", label: "Outgoing Subscriptions" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0A1F44] text-slate-200">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="block">
            <div className="text-lg font-bold text-white">ONAVERA</div>
            <div className="text-xs text-[#C9A227]">Technologies</div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-2.5 text-sm text-slate-300
                         hover:bg-white/5 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10 text-xs">
          <div className="text-slate-400 mb-2 truncate">{user.email}</div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden bg-[#0A1F44] text-white px-4 py-3 flex items-center justify-between">
          <div className="font-bold">ONAVERA</div>
          <LogoutButton />
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}