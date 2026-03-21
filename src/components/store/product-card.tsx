import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    shortDescription: string | null;
    price: string | number | { toString(): string };
    compareAtPrice?: string | number | { toString(): string } | null;
    stock: number;
    category: {
      name: string;
      slug: string;
    };
    images: Array<{
      url: string;
      altText: string | null;
    }>;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0]?.url ?? "https://placehold.co/800x800?text=Product";
  const soldCount = Math.max(12, 96 - product.stock);

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#0f1a2f] transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#13213b]">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-slate-900">
          <Image
            src={image}
            alt={product.images[0]?.altText ?? product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <p className="line-clamp-2 min-h-[2.75rem] text-sm leading-6 text-slate-100">{product.name}</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-semibold leading-none text-[#ff6a00]">{formatCurrency(product.price)}</span>
          {product.compareAtPrice ? (
            <span className="pb-1 text-xs text-slate-500 line-through">{formatCurrency(product.compareAtPrice)}</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{soldCount}+ bought</span>
          <span>{product.category.name}</span>
        </div>
      </div>
    </article>
  );
}
