import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { fail, ok } from "@/lib/api";

export async function GET(request: NextRequest) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const [totalProducts, totalOrders, totalCustomers, recentOrders, bestSellers, revenueAgg] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
  ]);

  return ok({
    totalProducts,
    totalOrders,
    totalCustomers,
    recentOrders,
    bestSellers,
    revenue: Number(revenueAgg._sum.totalAmount ?? 0),
  });
}
