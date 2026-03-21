import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { fail, ok } from "@/lib/api";
import { heroSlideSchema } from "@/lib/validations/catalog";

export async function GET() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return ok(slides);
}

export async function POST(request: NextRequest) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const contentType = request.headers.get("content-type") ?? "";
  let body: unknown;
  if (contentType.includes("application/json")) {
    body = await request.json();
  } else {
    const form = Object.fromEntries((await request.formData()).entries());
    body = {
      ...form,
      isActive: form.isActive === "true",
    };
  }
  const parsed = heroSlideSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid hero slide data.", 400, parsed.error.flatten());
  }

  const slide = await prisma.heroSlide.create({
    data: parsed.data,
  });

  return ok(slide, { status: 201 });
}
