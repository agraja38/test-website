import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/store/product-card";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription ?? product.description.slice(0, 150),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10">
            <Image
              src={product.images[0]?.url ?? "https://placehold.co/1200x1200?text=Product"}
              alt={product.images[0]?.altText ?? product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(0, 3).map((image) => (
              <div key={image.id} className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-white/10">
                <Image src={image.url} alt={image.altText ?? product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.25em] text-[#f1d3a0]">{product.category.name}</p>
          <div>
            <h1 className="text-5xl font-semibold text-white">{product.name}</h1>
            <p className="mt-4 max-w-2xl text-lg text-stone-300">{product.shortDescription ?? product.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold text-[#f1d3a0]">{formatCurrency(product.price)}</span>
            {product.compareAtPrice ? <span className="text-lg text-stone-500 line-through">{formatCurrency(product.compareAtPrice)}</span> : null}
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-stone-300">
            <p className="mb-3 font-medium text-white">Stock status</p>
            <p>{product.stock > 0 ? `${product.stock} unit(s) available` : "Currently unavailable"}</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#f1d3a0]">Description</p>
            <p className="leading-8 text-stone-300">{product.description}</p>
          </div>
          <AddToCartButton productId={product.id} disabled={product.stock <= 0} />
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-3xl font-semibold text-white">Related Products</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
