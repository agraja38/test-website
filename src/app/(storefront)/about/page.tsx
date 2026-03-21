export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.25em] text-[#f1d3a0]">About</p>
      <h1 className="mt-3 text-5xl font-semibold text-white">Custom commerce for brands that want ownership</h1>
      <div className="mt-8 space-y-6 text-lg leading-8 text-stone-300">
        <p>This project is intentionally built without Shopify, WooCommerce, or subscription website builders. You own the codebase, the deployment, and the roadmap.</p>
        <p>The stack is optimized for production-style growth: Prisma for schema discipline, PostgreSQL for reliable commerce data, and a modular payment layer so PayHere comes first without trapping you there forever.</p>
      </div>
    </div>
  );
}
