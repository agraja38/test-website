"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  admin?: boolean;
  redirectTo?: string;
};

export function LoginForm({ admin = false, redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.message ?? "Unable to sign in.");
      return;
    }

    if (admin && result.data.role !== "ADMIN") {
      setError("This login is for administrators only.");
      return;
    }

    if (!admin && result.data.role === "ADMIN") {
      router.push("/admin");
      router.refresh();
      return;
    }

    router.push(redirectTo ?? (admin ? "/admin" : "/account"));
    router.refresh();
  }

  return (
    <form
      action={onSubmit}
      className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur"
    >
      <div>
        <label className="mb-2 block text-sm text-stone-300">Email</label>
        <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" name="email" type="email" required />
      </div>
      <div>
        <label className="mb-2 block text-sm text-stone-300">Password</label>
        <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" name="password" type="password" required />
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button className="w-full rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black disabled:opacity-60" disabled={loading} type="submit">
        {loading ? "Signing in..." : admin ? "Enter Admin Dashboard" : "Sign In"}
      </button>
    </form>
  );
}
