import { prisma } from "@/lib/db/prisma";

export async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
              category: true,
            },
          },
        },
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.cart.create({
    data: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
              category: true,
            },
          },
        },
      },
    },
  });
}
