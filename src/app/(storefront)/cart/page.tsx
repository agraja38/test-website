import { CartClient } from "@/components/store/cart-client";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-[#f1d3a0]">Cart</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Review your selections</h1>
      </div>
      <CartClient />
    </div>
  );
}
