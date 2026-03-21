import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(7),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(2).default("Sri Lanka"),
});

export const checkoutSchema = z.object({
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"]),
});
