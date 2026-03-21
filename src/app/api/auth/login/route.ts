import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { setAuthCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";
import { fail } from "@/lib/api";
import { isRateLimited } from "@/lib/services/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(`login:${ip}`, 10)) {
    return fail("Too many login attempts. Please try again shortly.", 429);
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid login details.", 400, parsed.error.flatten());
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user || !user.isActive) {
    return fail("Invalid email or password.", 401);
  }

  const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!validPassword) {
    return fail("Invalid email or password.", 401);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const response = NextResponse.json({
    success: true,
    data: {
      userId: user.id,
      role: user.role,
    },
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
