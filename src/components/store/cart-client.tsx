"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type CartState = {
  id: string;
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number | string;
      slug: string;
      images: Array<{ url: string; altText: string | null }>;
    };
  }>;
};

export function CartClient() {
  const [cart, setCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadCart(showLoader = true) {
    if (showLoader) {
      setLoading(true);
    }
    const response = await fetch("/api/cart");
    const result = await response.json();
    setLoading(false);
    if (response.ok) {
      setCart(result.data);
    }
  }

  useEffect(() => {
    fetch("/api/cart")
      .then((response) => response.json())
      .then((result) => {
        setCart(result.data);
        setLoading(false);
      });
  }, []);

  const subtotal = useMemo(
    () => cart?.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0) ?? 0,
    [cart],
  );

  async function updateItem(itemId: string, quantity: number) {
    await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    await loadCart();
  }

  async function removeItem(itemId: string) {
    await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    await loadCart();
  }

  if (loading) {
    return <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-stone-300">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
        <h2 className="text-2xl font-semibold text-white">Your cart is empty</h2>
        <p className="mt-3 text-stone-300">Browse the collection and add a few pieces to continue.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr,0.8fr]">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4">
            <div className="relative h-28 w-28 overflow-hidden rounded-3xl">
              <Image
                src={item.product.images[0]?.url ?? "https://placehold.co/300x300?text=Product"}
                alt={item.product.images[0]?.altText ?? item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{item.product.name}</p>
                <p className="text-sm text-stone-300">{formatCurrency(item.product.price)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-full border border-white/10 px-3 py-1 text-white" onClick={() => updateItem(item.id, item.quantity - 1)}>-</button>
                <span className="text-stone-200">{item.quantity}</span>
                <button className="rounded-full border border-white/10 px-3 py-1 text-white" onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                <button className="text-sm text-rose-300" onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">Cart Total</h2>
        <div className="mt-6 flex items-center justify-between text-stone-300">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-stone-300">
          <span>Shipping</span>
          <span>{subtotal > 50000 ? "Free" : formatCurrency(2500)}</span>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-semibold text-white">
          <span>Total</span>
          <span>{formatCurrency(subtotal > 50000 ? subtotal : subtotal + 2500)}</span>
        </div>
        <Link href="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black">
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}
