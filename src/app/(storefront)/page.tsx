import Link from "next/link";
import { Tv, Shirt, HeartPulse, Car, Armchair, Plane, Gift } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { ProductCard } from "@/components/store/product-card";
import { HeroSlideshow } from "@/components/store/hero-slideshow";

export const dynamic = "force-dynamic";

const quickTabs = [
  { label: "Recommended" },
  { label: "Home Living" },
  { label: "Travel Ready" },
  { label: "Wellness" },
];

export default async function HomePage() {
  const [categories, heroSlides, featuredProducts, latestProducts] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      take: 6,
    }),
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
      take: 18,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="pb-14">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,#18345d,transparent_26%),linear-gradient(180deg,#07111f_0%,#0b172b_58%,#07111f_100%)]">
        <div className="mx-auto max-w-[1880px] px-4 py-6 sm:px-6 xl:px-8 2xl:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
            <aside className="self-start rounded-[1.8rem] border border-white/10 bg-white/5 p-4 md:w-[270px] md:flex-none lg:w-[300px]">
              <div className="space-y-1">
                {[
                  { label: categories[0]?.name ?? "Home / Living", icon: Armchair, href: `/shop?category=${categories[0]?.slug ?? ""}` },
                  { label: "Appliances / Tech", icon: Tv, href: "/shop" },
                  { label: "Fashion / Apparel", icon: Shirt, href: "/shop" },
                  { label: categories[2]?.name ?? "Travel / Bags", icon: Plane, href: `/shop?category=${categories[2]?.slug ?? ""}` },
                  { label: "Automotive / Tools", icon: Car, href: "/shop" },
                  { label: categories[1]?.name ?? "Wellness / Health", icon: HeartPulse, href: `/shop?category=${categories[1]?.slug ?? ""}` },
                  { label: "Gift Sets / Offers", icon: Gift, href: "/shop" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-[#ff9a3d]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <HeroSlideshow slides={heroSlides} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1700px] px-4 py-7 sm:px-6 xl:px-10">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {quickTabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                index === 0 ? "bg-[#ff7a1a] text-white" : "bg-white/5 text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 xl:px-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffb36b]">Recommended For You</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Dense marketplace feed</h2>
          </div>
          <Link href="/shop" className="text-sm text-slate-400">Browse all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
