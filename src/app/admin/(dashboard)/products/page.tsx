import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold text-white">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black">Add Product</Link>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
        <table className="min-w-full text-left text-sm text-stone-300">
          <thead className="border-b border-white/10 text-stone-400">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/5">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.category.name}</td>
                <td className="px-6 py-4">{formatCurrency(product.price.toString())}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.isPublished ? "Published" : "Draft"}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/products/${product.id}`} className="text-white underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
