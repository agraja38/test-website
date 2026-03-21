import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { ProductForm } from "@/components/forms/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { productId } = await params;
  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    }),
  ]);

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold text-white">Edit Product</h1>
        <DeleteProductButton productId={product.id} />
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
