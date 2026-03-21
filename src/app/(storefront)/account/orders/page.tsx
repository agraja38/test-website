import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: {
      items: true,
      payments: true,
      shippingAddress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-white">Order History</h1>
      <div className="mt-8 space-y-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#f1d3a0]">{order.orderNumber}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{order.status}</h2>
                <p className="mt-2 text-stone-300">Payment: {order.paymentStatus}</p>
              </div>
              <p className="text-lg font-semibold text-white">{formatCurrency(order.totalAmount.toString())}</p>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/10 p-4 text-sm text-stone-300">
                  <p className="font-medium text-white">{item.productName}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>{formatCurrency(item.totalPrice.toString())}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
