import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { updateOrderStatusSchema } from "@/lib/validations/checkout";
import { fail, ok } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await requireApiUser(request);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const { orderId } = await params;
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      ...(session.role === Role.ADMIN ? {} : { userId: session.userId }),
    },
    include: {
      items: { include: { product: { include: { images: true } } } },
      payments: true,
      user: true,
      shippingAddress: true,
      billingAddress: true,
    },
  });

  if (!order) {
    return fail("Order not found.", 404);
  }

  return ok(order);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const body = await request.json();
  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid order update.", 400, parsed.error.flatten());
  }

  const { orderId } = await params;
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: parsed.data.status,
      paymentStatus: parsed.data.paymentStatus,
      payments: {
        updateMany: {
          where: {},
          data: {
            status: parsed.data.paymentStatus,
            paidAt: parsed.data.paymentStatus === "PAID" ? new Date() : null,
          },
        },
      },
    },
    include: {
      items: true,
      payments: true,
      user: true,
    },
  });

  return ok(order);
}
