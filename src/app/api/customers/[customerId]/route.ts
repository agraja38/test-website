import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { fail, ok } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ customerId: string }> }) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const { customerId } = await params;
  const customer = await prisma.user.findUnique({
    where: { id: customerId },
    include: {
      addresses: true,
      orders: {
        include: { items: true, payments: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    return fail("Customer not found.", 404);
  }

  return ok(customer);
}
