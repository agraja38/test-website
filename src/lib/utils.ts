import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string | { toString(): string },
  currency = process.env.NEXT_PUBLIC_CURRENCY ?? "LKR",
) {
  const numericAmount = typeof amount === "number" ? amount : Number(amount.toString());
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function generateOrderNumber() {
  return `LC-${Date.now().toString().slice(-8)}`;
}

export function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}
