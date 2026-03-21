import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [totalProducts, totalOrders, totalCustomers, revenueAgg, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#f1d3a0]">Admin Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Store operations at a glance</h1>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Products", value: totalProducts },
          { label: "Total Orders", value: totalOrders },
          { label: "Total Customers", value: totalCustomers },
          { label: "Revenue", value: formatCurrency(Number(revenueAgg._sum.totalAmount ?? 0)) },
        ].map((item) => (
          <div key={item.label} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-stone-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Recent Orders</h2>
        <div className="mt-6 space-y-4">
          {recentOrders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 p-4 text-sm text-stone-300">
              <div>
                <p className="font-medium text-white">{order.orderNumber}</p>
                <p>{order.user.firstName} {order.user.lastName}</p>
              </div>
              <div className="text-right">
                <p>{order.status}</p>
                <p className="font-medium text-white">{formatCurrency(order.totalAmount.toString())}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
