import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ProductCard } from "@/components/store/product-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse products, search, filter, and discover premium goods.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = typeof params.sort === "string" ? params.sort : "latest";
  const minPrice = Number(params.minPrice ?? "0");
  const maxPrice = Number(params.maxPrice ?? "100000000");
  const take = 12;

  const [categories, products, total] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        isPublished: true,
        price: { gte: minPrice, lte: maxPrice },
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(category ? { category: { slug: category } } : {}),
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy:
        sort === "price-asc"
          ? { price: "asc" }
          : sort === "price-desc"
            ? { price: "desc" }
            : { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
    }),
    prisma.product.count({
      where: {
        isPublished: true,
        price: { gte: minPrice, lte: maxPrice },
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(category ? { category: { slug: category } } : {}),
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffb36b]">Shop</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Browse all products</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Search, sort, and filter products in a familiar marketplace-style catalog.
        </p>
      </div>

      <form className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-sm">
        <input defaultValue={search} className="min-w-[180px] flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" name="search" placeholder="Search products" />
        <select defaultValue={category} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200" name="category">
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>{item.name}</option>
          ))}
        </select>
        <input defaultValue={minPrice} className="w-24 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" min={0} name="minPrice" placeholder="Min" type="number" />
        <input defaultValue={maxPrice} className="w-24 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" min={0} name="maxPrice" placeholder="Max" type="number" />
        <div className="flex items-center gap-2">
          <select defaultValue={sort} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200" name="sort">
            <option value="latest">Latest</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </select>
          <button className="rounded-xl bg-[#ff7a1a] px-4 py-2 text-sm font-medium text-white" type="submit">Apply</button>
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          const query = new URLSearchParams({
            ...(search ? { search } : {}),
            ...(category ? { category } : {}),
            sort,
            minPrice: String(minPrice),
            maxPrice: String(maxPrice),
            page: String(pageNumber),
          });
          return (
            <Link
              key={pageNumber}
              href={`/shop?${query.toString()}`}
              className={`rounded-full px-4 py-2 text-sm ${pageNumber === page ? "bg-[#ff7a1a] text-white" : "border border-white/10 bg-white/5 text-slate-200"}`}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
