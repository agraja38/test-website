import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusForm } from "@/components/admin/order-status-form";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: true,
      payments: true,
      shippingAddress: true,
      billingAddress: true,
    },
  });

  if (!order) {
    redirect("/admin/orders");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr,0.7fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[#f1d3a0]">{order.orderNumber}</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{order.status}</h1>
          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 p-4 text-sm text-stone-300">
                <p className="font-medium text-white">{item.productName}</p>
                <p>SKU: {item.productSku}</p>
                <p>Qty: {item.quantity}</p>
                <p>{formatCurrency(item.totalPrice.toString())}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Customer</h2>
            <p className="mt-4 text-stone-300">{order.user.firstName} {order.user.lastName}</p>
            <p className="text-stone-300">{order.user.email}</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Payment</h2>
            <p className="mt-4 text-stone-300">Status: {order.paymentStatus}</p>
            <p className="text-stone-300">Total: {formatCurrency(order.totalAmount.toString())}</p>
          </div>
          <OrderStatusForm orderId={order.id} paymentStatus={order.paymentStatus} status={order.status} />
        </section>
      </div>
    </div>
  );
}
