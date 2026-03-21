import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { fail, ok } from "@/lib/api";

export async function GET(request: NextRequest) {
  const session = await requireApiUser(request);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const orders = await prisma.order.findMany({
    where: session.role === Role.ADMIN ? {} : { userId: session.userId },
    include: {
      user: true,
      items: true,
      payments: true,
      shippingAddress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(orders);
}
