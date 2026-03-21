import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { getOrCreateCart } from "@/lib/services/cart";
import { fail, ok } from "@/lib/api";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const session = await requireApiUser(request);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const body = await request.json();
  const quantity = Number(body.quantity ?? 1);
  const { itemId } = await params;

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  const cart = await getOrCreateCart(session.userId);
  return ok(cart);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const session = await requireApiUser(request);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const { itemId } = await params;
  await prisma.cartItem.delete({ where: { id: itemId } });
  const cart = await getOrCreateCart(session.userId);
  return ok(cart);
}
