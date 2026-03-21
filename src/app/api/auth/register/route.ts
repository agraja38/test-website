import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { setAuthCookie } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validations/auth";
import { fail } from "@/lib/api";
import { isRateLimited } from "@/lib/services/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(`register:${ip}`, 5)) {
    return fail("Too many registration attempts. Please try again shortly.", 429);
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid registration details.", 400, parsed.error.flatten());
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (existingUser) {
    return fail("An account already exists with this email.", 409);
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      role: Role.CUSTOMER,
      cart: { create: {} },
    },
  });

  const response = NextResponse.json({
    success: true,
    data: { userId: user.id, role: user.role },
  });
  await setAuthCookie(response, {
    userId: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  });
  return response;
}
