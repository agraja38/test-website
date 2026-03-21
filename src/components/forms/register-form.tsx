"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.message ?? "Unable to create account.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="firstName" placeholder="First name" required />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="lastName" placeholder="Last name" required />
      </div>
      <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="email" placeholder="Email address" type="email" required />
      <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="phone" placeholder="Phone number" />
      <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="password" placeholder="Create a password" type="password" required />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button className="w-full rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black disabled:opacity-60" disabled={loading} type="submit">
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
