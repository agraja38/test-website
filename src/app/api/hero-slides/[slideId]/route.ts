import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/auth/session";
import { fail, ok } from "@/lib/api";
import { heroSlideSchema } from "@/lib/validations/catalog";

type Context = {
  params: Promise<{ slideId: string }>;
};

async function updateSlide(request: NextRequest, context: Context) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const { slideId } = await context.params;
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

  const slide = await prisma.heroSlide.update({
    where: { id: slideId },
    data: parsed.data,
  });

  return ok(slide);
}

async function deleteSlide(request: NextRequest, context: Context) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const { slideId } = await context.params;
  await prisma.heroSlide.delete({
    where: { id: slideId },
  });

  return ok({ success: true });
}

export async function PATCH(request: NextRequest, context: Context) {
  return updateSlide(request, context);
}

export async function DELETE(request: NextRequest, context: Context) {
  return deleteSlide(request, context);
}

export async function POST(request: NextRequest, context: Context) {
  const formData = await request.formData();
  const method = String(formData.get("_method") ?? "").toUpperCase();
  const headers = new Headers(request.headers);
  headers.set("content-type", "application/x-www-form-urlencoded");
  const nextRequest = new NextRequest(request.url, {
    method,
    headers,
    body: new URLSearchParams(
      Array.from(formData.entries()).flatMap(([key, value]) =>
        key === "_method" ? [] : [[key, String(value)]],
      ),
    ),
  });

  if (method === "PATCH") {
    return updateSlide(nextRequest, context);
  }

  if (method === "DELETE") {
    return deleteSlide(nextRequest, context);
  }

  return fail("Unsupported method.", 405);
}
