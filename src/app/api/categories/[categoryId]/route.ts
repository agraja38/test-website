import slugify from "slugify";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validations/catalog";
import { fail, ok } from "@/lib/api";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid category data.", 400, parsed.error.flatten());
  }

  const { categoryId } = await params;
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...parsed.data,
      slug: slugify(parsed.data.name, { lower: true, strict: true }),
    },
  });

  return ok(category);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const { categoryId } = await params;
  await prisma.category.delete({ where: { id: categoryId } });
  return ok({ deleted: true });
}
