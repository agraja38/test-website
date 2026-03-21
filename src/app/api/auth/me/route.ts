import { getSession } from "@/lib/auth/session";
import { fail, ok } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return fail("Not authenticated.", 401);
  }

  return ok(session);
}
