import type { Order, Payment } from "@prisma/client";

export type PaymentInitiationResult = {
  gateway: string;
  url: string;
  fields: Record<string, string>;
};

export interface PaymentProvider {
  createCheckout(order: Order & { payments: Payment[] }): Promise<PaymentInitiationResult>;
  validateNotification(payload: Record<string, string>): Promise<{
    isValid: boolean;
    paymentReference?: string;
    status: "PAID" | "FAILED" | "CANCELLED";
    raw: Record<string, string>;
  }>;
}
