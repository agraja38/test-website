import slugify from "slugify";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validations/catalog";
import { fail, ok } from "@/lib/api";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return ok(categories);
}

export async function POST(request: NextRequest) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid category data.", 400, parsed.error.flatten());
  }

  const category = await prisma.category.create({
    data: {
      ...parsed.data,
      slug: slugify(parsed.data.name, { lower: true, strict: true }),
    },
  });

  return ok(category, { status: 201 });
}
