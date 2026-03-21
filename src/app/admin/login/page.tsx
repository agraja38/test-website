import { LoginForm } from "@/components/forms/login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const redirectTo = typeof params.redirect === "string" ? params.redirect : undefined;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#143052,transparent_30%),linear-gradient(180deg,#0a1325_0%,#111c34_100%)]">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">LuxeCart Admin</p>
          <h1 className="text-5xl font-semibold text-white">Standalone back office access</h1>
          <p className="text-slate-300">
            This is the separate admin website shell for internal operations. Customer storefront navigation is intentionally not shown here.
          </p>
        </div>
        <LoginForm admin redirectTo={redirectTo} />
      </div>
    </div>
  );
}
