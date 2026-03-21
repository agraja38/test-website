import { AddressType, PaymentGateway, PaymentStatus } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { getOrCreateCart } from "@/lib/services/cart";
import { checkoutSchema } from "@/lib/validations/checkout";
import { fail, ok } from "@/lib/api";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const session = await requireApiUser(request);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid checkout details.", 400, parsed.error.flatten());
  }

  const cart = await getOrCreateCart(session.userId);
  if (cart.items.length === 0) {
    return fail("Your cart is empty.", 400);
  }

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const shippingAmount = subtotal > 50000 ? 0 : 2500;
  const taxAmount = 0;
  const totalAmount = subtotal + shippingAmount + taxAmount;

  const order = await prisma.$transaction(async (tx) => {
    const billingAddress = await tx.address.create({
      data: {
        ...parsed.data.billingAddress,
        type: AddressType.BILLING,
        userId: session.userId,
      },
    });

    const shippingAddress = await tx.address.create({
      data: {
        ...parsed.data.shippingAddress,
        type: AddressType.SHIPPING,
        userId: session.userId,
      },
    });

    const createdOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.userId,
        billingAddressId: billingAddress.id,
        shippingAddressId: shippingAddress.id,
        subtotal,
        shippingAmount,
        taxAmount,
        totalAmount,
        notes: parsed.data.notes,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: Number(item.product.price) * item.quantity,
          })),
        },
        payments: {
          create: {
            gateway: PaymentGateway.PAYHERE,
            status: PaymentStatus.PENDING,
            amount: totalAmount,
            currency: "LKR",
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return createdOrder;
  });

  return ok(order, { status: 201 });
}
