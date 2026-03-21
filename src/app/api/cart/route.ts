import { NextRequest } from "next/server";
import { requireApiUser } from "@/lib/auth/session";
import { fail, ok } from "@/lib/api";
import { getOrCreateCart } from "@/lib/services/cart";

export async function GET(request: NextRequest) {
  const session = await requireApiUser(request);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const cart = await getOrCreateCart(session.userId);
  return ok(cart);
}
