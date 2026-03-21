import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { fail, ok } from "@/lib/api";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries()) as Record<string, string>;

  const provider = getPaymentProvider("PAYHERE");
  const validation = await provider.validateNotification(payload);
  if (!validation.isValid) {
    return fail("Invalid payment notification.", 400);
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: payload.order_id },
    include: { payments: true },
  });

  if (!order) {
    return fail("Order not found.", 404);
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus:
        validation.status === "PAID"
          ? PaymentStatus.PAID
          : validation.status === "CANCELLED"
            ? PaymentStatus.CANCELLED
            : PaymentStatus.FAILED,
      status:
        validation.status === "PAID"
          ? OrderStatus.PAID
          : validation.status === "CANCELLED"
            ? OrderStatus.CANCELLED
            : OrderStatus.PENDING,
      payments: {
        updateMany: {
          where: {},
          data: {
            status:
              validation.status === "PAID"
                ? PaymentStatus.PAID
                : validation.status === "CANCELLED"
                  ? PaymentStatus.CANCELLED
                  : PaymentStatus.FAILED,
            gatewayReference: validation.paymentReference,
            gatewayOrderId: payload.order_id,
            providerPayload: validation.raw,
            paidAt: validation.status === "PAID" ? new Date() : null,
          },
        },
      },
    },
  });

  return ok({ accepted: true });
}
