"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddToCartButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function addToCart() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(result.message ?? "Unable to add product.");
      if (response.status === 401) {
        router.push("/login");
      }
      return;
    }

    setMessage("Added to cart.");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <button
        onClick={addToCart}
        disabled={disabled || loading}
        className="w-full rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Adding..." : disabled ? "Out of Stock" : "Add to Cart"}
      </button>
      {message ? <p className="text-sm text-stone-300">{message}</p> : null}
    </div>
  );
}
