"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductFormProps = {
  categories: Array<{ id: string; name: string }>;
  product?: {
    id: string;
    name: string;
    description: string;
    shortDescription: string | null;
    sku: string;
    price: number | string | { toString(): string };
    compareAtPrice: number | string | { toString(): string } | null;
    stock: number;
    categoryId: string;
    isFeatured: boolean;
    isPublished: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    images: Array<{ url: string }>;
  };
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(product?.images[0]?.url ?? "");

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload/image", { method: "POST", body: formData });
    const result = await response.json();
    if (response.ok) {
      setUploadedUrl(result.data.url);
    } else {
      setError(result.message ?? "Could not upload image.");
    }
  }

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError("");
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      shortDescription: formData.get("shortDescription"),
      sku: formData.get("sku"),
      price: formData.get("price"),
      compareAtPrice: formData.get("compareAtPrice") || undefined,
      stock: formData.get("stock"),
      categoryId: formData.get("categoryId"),
      isFeatured: formData.get("isFeatured") === "on",
      isPublished: formData.get("isPublished") === "on",
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      imageUrls: [uploadedUrl || String(formData.get("imageUrl") || "")].filter(Boolean),
    };

    const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(result.message ?? "Could not save product.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={product?.name} name="name" placeholder="Product name" required />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={product?.sku} name="sku" placeholder="SKU" required />
      </div>
      <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={product?.shortDescription ?? ""} name="shortDescription" placeholder="Short description" />
      <textarea className="min-h-36 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={product?.description} name="description" placeholder="Detailed description" required />
      <div className="grid gap-4 sm:grid-cols-4">
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={String(product?.price ?? "")} name="price" placeholder="Price" required />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={String(product?.compareAtPrice ?? "")} name="compareAtPrice" placeholder="Compare at price" />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={String(product?.stock ?? "")} name="stock" placeholder="Stock" required />
        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={product?.categoryId} name="categoryId" required>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={product?.images[0]?.url ?? ""} name="imageUrl" placeholder="Image URL fallback" />
        <input
          className="w-full rounded-2xl border border-dashed border-white/20 bg-black/20 px-4 py-3 text-white"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void uploadImage(file);
            }
          }}
        />
        {uploadedUrl ? <p className="text-sm text-stone-300">Uploaded image: {uploadedUrl}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={product?.metaTitle ?? ""} name="metaTitle" placeholder="SEO title" />
        <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" defaultValue={product?.metaDescription ?? ""} name="metaDescription" placeholder="SEO description" />
      </div>
      <div className="flex flex-wrap gap-6 text-sm text-stone-300">
        <label className="flex items-center gap-2"><input defaultChecked={product?.isFeatured} name="isFeatured" type="checkbox" /> Featured</label>
        <label className="flex items-center gap-2"><input defaultChecked={product?.isPublished ?? true} name="isPublished" type="checkbox" /> Published</label>
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button className="rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black disabled:opacity-60" disabled={submitting} type="submit">
        {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
