import slugify from "slugify";
import { Prisma, Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { productSchema } from "@/lib/validations/catalog";
import { fail, ok } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "12");
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "latest";
  const minPrice = Number(searchParams.get("minPrice") ?? "0");
  const maxPrice = Number(searchParams.get("maxPrice") ?? "100000000");
  const includeDrafts = searchParams.get("includeDrafts") === "true";

  const where: Prisma.ProductWhereInput = {
    price: {
      gte: minPrice,
      lte: maxPrice,
    },
    ...(includeDrafts ? {} : { isPublished: true }),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
  };

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return ok({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid product data.", 400, parsed.error.flatten());
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      slug: slugify(parsed.data.name, { lower: true, strict: true }),
      images: {
        create: parsed.data.imageUrls.map((url, index) => ({
          url,
          altText: parsed.data.name,
          sortOrder: index,
        })),
      },
    },
    include: {
      category: true,
      images: true,
    },
  });

  return ok(product, { status: 201 });
}
