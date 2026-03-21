"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrderStatusForm({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: formData.get("status"),
        paymentStatus: formData.get("paymentStatus"),
      }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.message ?? "Could not update order.");
      return;
    }
    router.refresh();
  }

  return (
    <form action={submit} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-semibold text-white">Update Status</h2>
      <div className="mt-5 grid gap-4">
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={status} name="status">
          {["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={paymentStatus} name="paymentStatus">
          {["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      <button className="mt-5 rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black disabled:opacity-60" disabled={loading} type="submit">
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
}
