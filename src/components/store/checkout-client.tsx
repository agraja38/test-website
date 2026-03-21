"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";

type CartSummary = {
  items: Array<{
    id: string;
    quantity: number;
    product: {
      name: string;
      price: number | string;
    };
  }>;
};

export function CheckoutClient() {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/cart")
      .then((response) => response.json())
      .then((result) => setCart(result.data));
  }, []);

  const subtotal = useMemo(
    () => cart?.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0) ?? 0,
    [cart],
  );
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  async function submitOrder(formData: FormData) {
    setLoading(true);
    setError("");

    const payload = {
      billingAddress: {
        fullName: formData.get("billingFullName"),
        phone: formData.get("billingPhone"),
        line1: formData.get("billingLine1"),
        line2: formData.get("billingLine2"),
        city: formData.get("billingCity"),
        state: formData.get("billingState"),
        postalCode: formData.get("billingPostalCode"),
        country: formData.get("billingCountry"),
      },
      shippingAddress: {
        fullName: formData.get("shippingFullName"),
        phone: formData.get("shippingPhone"),
        line1: formData.get("shippingLine1"),
        line2: formData.get("shippingLine2"),
        city: formData.get("shippingCity"),
        state: formData.get("shippingState"),
        postalCode: formData.get("shippingPostalCode"),
        country: formData.get("shippingCountry"),
      },
      notes: formData.get("notes"),
    };

    const orderResponse = await fetch("/api/checkout/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const orderResult = await orderResponse.json();

    if (!orderResponse.ok) {
      setLoading(false);
      setError(orderResult.message ?? "Could not place order.");
      return;
    }

    const paymentResponse = await fetch("/api/payments/payhere/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderResult.data.id }),
    });
    const paymentResult = await paymentResponse.json();
    setLoading(false);

    if (!paymentResponse.ok) {
      setError(paymentResult.message ?? "Could not start payment.");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = paymentResult.data.url;
    Object.entries(paymentResult.data.fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <form action={submitOrder} className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Billing Details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="billingFullName" placeholder="Full name" required />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="billingPhone" placeholder="Phone" required />
            <input className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="billingLine1" placeholder="Address line 1" required />
            <input className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="billingLine2" placeholder="Address line 2" />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="billingCity" placeholder="City" required />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="billingState" placeholder="State / Province" />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="billingPostalCode" placeholder="Postal code" />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue="Sri Lanka" name="billingCountry" placeholder="Country" required />
          </div>
        </section>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Shipping Details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="shippingFullName" placeholder="Full name" required />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="shippingPhone" placeholder="Phone" required />
            <input className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="shippingLine1" placeholder="Address line 1" required />
            <input className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="shippingLine2" placeholder="Address line 2" />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="shippingCity" placeholder="City" required />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="shippingState" placeholder="State / Province" />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="shippingPostalCode" placeholder="Postal code" />
            <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue="Sri Lanka" name="shippingCountry" placeholder="Country" required />
          </div>
          <textarea className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="notes" placeholder="Order notes" />
        </section>
      </div>
      <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">Order Summary</h2>
        <div className="mt-5 space-y-3 text-sm text-stone-300">
          {cart?.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <span>{item.product.name} x {item.quantity}</span>
              <span>{formatCurrency(Number(item.product.price) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-stone-300">
          <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex items-center justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span></div>
          <div className="flex items-center justify-between text-lg font-semibold text-white"><span>Total</span><span>{formatCurrency(total)}</span></div>
        </div>
        <p className="mt-4 text-sm text-stone-400">Payments are routed through PayHere. Replace sandbox credentials in `.env` when moving live.</p>
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        <button className="mt-6 w-full rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black disabled:opacity-60" disabled={loading} type="submit">
          {loading ? "Preparing payment..." : "Pay with PayHere"}
        </button>
      </aside>
    </form>
  );
}
