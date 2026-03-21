import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(20),
  shortDescription: z.string().optional(),
  sku: z.string().min(3),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  isFeatured: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  imageUrls: z.array(z.string().url()).default([]),
});

export const heroSlideSchema = z.object({
  title: z.string().min(3),
  subtitle: z.string().optional(),
  imageUrl: z.string().url(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(20),
});
