import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    include: { user: true, payments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-semibold text-white">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 text-stone-300">
            <div>
              <p className="font-medium text-white">{order.orderNumber}</p>
              <p>{order.user.firstName} {order.user.lastName}</p>
            </div>
            <div className="text-right">
              <p>{order.status} / {order.paymentStatus}</p>
              <p className="font-medium text-white">{formatCurrency(order.totalAmount.toString())}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
