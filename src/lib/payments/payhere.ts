import crypto from "node:crypto";
import type { Order, Payment } from "@prisma/client";
import { getBaseUrl } from "@/lib/utils";
import type { PaymentInitiationResult, PaymentProvider } from "./provider";

function getPayHereConfig() {
  return {
    merchantId: process.env.PAYHERE_MERCHANT_ID ?? "",
    merchantSecret: process.env.PAYHERE_MERCHANT_SECRET ?? "",
    sandbox: process.env.PAYHERE_SANDBOX !== "false",
    returnUrl: process.env.PAYHERE_RETURN_URL ?? `${getBaseUrl()}/api/payments/payhere/return`,
    cancelUrl: process.env.PAYHERE_CANCEL_URL ?? `${getBaseUrl()}/api/payments/payhere/cancel`,
    notifyUrl: process.env.PAYHERE_NOTIFY_URL ?? `${getBaseUrl()}/api/payments/payhere/notify`,
  };
}

function md5(input: string) {
  return crypto.createHash("md5").update(input).digest("hex").toUpperCase();
}

export class PayHereProvider implements PaymentProvider {
  async createCheckout(order: Order & { payments: Payment[] }): Promise<PaymentInitiationResult> {
    const config = getPayHereConfig();
    const payment = order.payments[0];
    const amount = Number(order.totalAmount).toFixed(2);
    const merchantSecretHash = md5(config.merchantSecret);
    const hash = md5(`${config.merchantId}${order.orderNumber}${amount}LKR${merchantSecretHash}`);
    const payhereUrl = config.sandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout";

    return {
      gateway: "PAYHERE",
      url: payhereUrl,
      fields: {
        merchant_id: config.merchantId,
        return_url: config.returnUrl,
        cancel_url: config.cancelUrl,
        notify_url: config.notifyUrl,
        order_id: order.orderNumber,
        items: `Order ${order.orderNumber}`,
        currency: "LKR",
        amount,
        first_name: "Customer",
        last_name: "Checkout",
        email: "customer@example.com",
        phone: "0000000000",
        address: "Sri Lanka",
        city: "Colombo",
        country: "Sri Lanka",
        hash,
        custom_1: order.id,
        custom_2: payment?.id ?? "",
      },
    };
  }

  async validateNotification(payload: Record<string, string>) {
    const config = getPayHereConfig();
    const merchantSecretHash = md5(config.merchantSecret);
    const amount = Number(payload.payhere_amount ?? 0).toFixed(2);
    const localHash = md5(
      `${payload.merchant_id}${payload.order_id}${amount}${payload.payhere_currency}${payload.status_code}${merchantSecretHash}`,
    );

    const status: "PAID" | "CANCELLED" | "FAILED" =
      payload.status_code === "2" ? "PAID" : payload.status_code === "-1" ? "CANCELLED" : "FAILED";

    return {
      isValid: localHash === (payload.md5sig ?? "").toUpperCase(),
      paymentReference: payload.payment_id,
      status,
      raw: payload,
    };
  }
}
