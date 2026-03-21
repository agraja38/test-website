import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") {
    redirect("/login");
  }

  const [user, recentOrders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      include: { addresses: true },
    }),
    prisma.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#f1d3a0]">Account</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Hello, {session.firstName}</h1>
          <p className="mt-2 text-stone-300">Manage profile details, order history, and saved addresses.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/account/orders" className="rounded-full border border-white/10 px-5 py-3 text-white">View Orders</Link>
          <Link href="/account/profile" className="rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black">Edit Profile</Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">Profile Details</h2>
          <div className="mt-5 space-y-3 text-stone-300">
            <p>{user?.firstName} {user?.lastName}</p>
            <p>{user?.email}</p>
            <p>{user?.phone ?? "No phone number saved"}</p>
          </div>
          <h3 className="mt-8 text-lg font-semibold text-white">Saved Addresses</h3>
          <div className="mt-4 space-y-4">
            {user?.addresses.map((address) => (
              <div key={address.id} className="rounded-3xl border border-white/10 p-4 text-sm text-stone-300">
                <p className="font-medium text-white">{address.fullName}</p>
                <p>{address.line1}</p>
                {address.line2 ? <p>{address.line2}</p> : null}
                <p>{address.city}, {address.country}</p>
              </div>
            ))}
            {user?.addresses.length === 0 ? <p className="text-stone-400">Addresses are added during checkout.</p> : null}
          </div>
        </section>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">Recent Orders</h2>
          <div className="mt-5 space-y-4">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/account/orders?order=${order.id}`} className="flex items-center justify-between rounded-3xl border border-white/10 p-4 text-sm text-stone-300">
                <div>
                  <p className="font-medium text-white">{order.orderNumber}</p>
                  <p>{order.status}</p>
                </div>
                <span>{formatCurrency(order.totalAmount.toString())}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
