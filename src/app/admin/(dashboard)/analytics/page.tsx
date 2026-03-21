import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [revenueAgg, ordersCount, bestSellers] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.count(),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-semibold text-white">Analytics</h1>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-stone-400">Revenue Summary</p>
          <p className="mt-3 text-4xl font-semibold text-white">{formatCurrency(Number(revenueAgg._sum.totalAmount ?? 0))}</p>
          <p className="mt-2 text-stone-300">{ordersCount} total orders</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-stone-400">Best-Selling Products</p>
          <div className="mt-4 space-y-4">
            {bestSellers.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-stone-300">
                <span>{item.productName}</span>
                <span>{item._sum.quantity ?? 0} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
