import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-semibold text-white">Customers</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {customers.map((customer) => (
          <article key={customer.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">{customer.firstName} {customer.lastName}</h2>
            <p className="mt-3 text-stone-300">{customer.email}</p>
            <p className="text-stone-300">{customer.phone ?? "No phone saved"}</p>
            <p className="mt-4 text-sm text-stone-400">{customer._count.orders} order(s)</p>
          </article>
        ))}
      </div>
    </div>
  );
}
