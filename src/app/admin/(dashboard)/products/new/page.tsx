import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { ProductForm } from "@/components/forms/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-semibold text-white">Create Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
