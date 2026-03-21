import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-white">Profile</h1>
      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 text-stone-300">
        <p className="text-lg font-semibold text-white">{user?.firstName} {user?.lastName}</p>
        <p className="mt-3">{user?.email}</p>
        <p className="mt-2">{user?.phone ?? "No phone number saved yet"}</p>
        <p className="mt-6 text-sm text-stone-400">This starter keeps profile editing simple and can be extended with a dedicated update form later.</p>
      </div>
    </div>
  );
}
