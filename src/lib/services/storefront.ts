import { prisma } from "@/lib/db/prisma";

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });
}
