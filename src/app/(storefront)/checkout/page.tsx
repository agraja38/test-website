import { CheckoutClient } from "@/components/store/checkout-client";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-[#f1d3a0]">Checkout</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Secure PayHere checkout</h1>
        <p className="mt-3 max-w-2xl text-stone-300">Billing, shipping, and payment happen in one smooth flow backed by real order records.</p>
      </div>
      <CheckoutClient />
    </div>
  );
}
