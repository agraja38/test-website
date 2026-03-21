import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { getOrCreateCart } from "@/lib/services/cart";
import { cartItemSchema } from "@/lib/validations/catalog";
import { fail, ok } from "@/lib/api";

export async function POST(request: NextRequest) {
  const session = await requireApiUser(request);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const body = await request.json();
  const parsed = cartItemSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid cart item data.", 400, parsed.error.flatten());
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
  });

  if (!product || !product.isPublished || product.stock < parsed.data.quantity) {
    return fail("Product is unavailable or out of stock.", 400);
  }

  const cart = await getOrCreateCart(session.userId);
  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: parsed.data.productId,
      },
    },
    update: {
      quantity: parsed.data.quantity,
    },
    create: {
      cartId: cart.id,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
    },
  });

  const refreshedCart = await getOrCreateCart(session.userId);
  return ok(refreshedCart);
}
