import slugify from "slugify";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { productSchema } from "@/lib/validations/catalog";
import { fail, ok } from "@/lib/api";

export async function GET(_: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    return fail("Product not found.", 404);
  }

  return ok(product);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid product data.", 400, parsed.error.flatten());
  }

  const { productId } = await params;
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...parsed.data,
      slug: slugify(parsed.data.name, { lower: true, strict: true }),
      images: {
        deleteMany: {},
        create: parsed.data.imageUrls.map((url, index) => ({
          url,
          altText: parsed.data.name,
          sortOrder: index,
        })),
      },
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  return ok(product);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const { productId } = await params;
  await prisma.product.delete({ where: { id: productId } });
  return ok({ deleted: true });
}
