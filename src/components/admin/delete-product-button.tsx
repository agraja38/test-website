"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function removeProduct() {
    const confirmed = window.confirm("Delete this product? This cannot be undone.");
    if (!confirmed) {
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    setLoading(false);
    if (response.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }

  return (
    <button
      onClick={removeProduct}
      disabled={loading}
      className="rounded-full border border-rose-300/40 px-5 py-3 font-medium text-rose-200 disabled:opacity-60"
      type="button"
    >
      {loading ? "Deleting..." : "Delete Product"}
    </button>
  );
}
