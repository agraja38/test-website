import Link from "next/link";
import { Package, ShoppingBag, Users, BarChart3, FolderKanban, Images } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: FolderKanban },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: Images },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <div className="min-h-screen md:flex">
        <aside className="border-b border-white/10 bg-[#111c34] px-6 py-8 md:min-h-screen md:w-[300px] md:flex-none md:border-b-0 md:border-r md:px-8">
          <Link href="/admin" className="block text-4xl font-semibold tracking-tight text-white">
            LuxeCart Admin
          </Link>
          <p className="mt-4 max-w-xs text-lg text-slate-400">Back office dashboard for products, orders, customers, and analytics.</p>
          <nav className="mt-10 space-y-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 rounded-3xl px-5 py-4 text-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-6 w-6" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 bg-[linear-gradient(180deg,#0f172a_0%,#16213d_100%)]">
          <div className="flex items-center justify-end border-b border-white/10 px-6 py-5 text-sm text-slate-400">
            <form action="/api/auth/logout" method="post">
              <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200" type="submit">
                Logout
              </button>
            </form>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
