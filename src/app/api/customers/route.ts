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

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } },
      orders: {
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(customers);
}
