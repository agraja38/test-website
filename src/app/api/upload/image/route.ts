import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { requireApiUser } from "@/lib/auth/session";
import { fail, ok } from "@/lib/api";

export async function POST(request: NextRequest) {
  const session = await requireApiUser(request, Role.ADMIN);
  if (!session) {
    return fail("Unauthorized.", 401);
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return fail("Image file is required.", 400);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return ok({
    url: `/uploads/${filename}`,
    fileName: filename,
  });
}
