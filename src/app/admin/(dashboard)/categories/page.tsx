import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-semibold text-white">Categories</h1>
      <form action="/api/categories" method="post" className="mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:grid-cols-[1fr,1fr,auto]">
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="name" placeholder="Category name" />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="description" placeholder="Category description" />
        <button className="rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black" type="submit">Create</button>
      </form>
      <div className="grid gap-4">
        {categories.map((category) => (
          <article key={category.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">{category.name}</h2>
            <p className="mt-3 text-stone-300">{category.description}</p>
            <p className="mt-4 text-sm text-stone-400">{category._count.products} product(s)</p>
          </article>
        ))}
      </div>
    </div>
  );
}
