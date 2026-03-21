import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const redirectTo = typeof params.redirect === "string" ? params.redirect : undefined;

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#f1d3a0]">Customer Login</p>
        <h1 className="text-5xl font-semibold text-white">Welcome back to your account</h1>
        <p className="text-stone-300">Track orders, manage your profile, and return to checkout without losing momentum.</p>
        <p className="text-sm text-stone-400">
          Need an account? <Link href="/register" className="text-white underline">Create one here</Link>.
        </p>
      </div>
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
