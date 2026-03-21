import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { getPaymentProvider } from "@/lib/payments";
import { fail, ok } from "@/lib/api";

export async function POST(request: NextRequest) {
  const session = await requireApiUser(request);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const body = await request.json();
  const orderId = body.orderId as string | undefined;
  if (!orderId) {
    return fail("Order ID is required.", 400);
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.userId },
    include: { payments: true },
  });

  if (!order) {
    return fail("Order not found.", 404);
  }

  const provider = getPaymentProvider("PAYHERE");
  const checkout = await provider.createCheckout(order);
  return ok(checkout);
}
