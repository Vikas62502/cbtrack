import { createHmac, timingSafeEqual } from "crypto";

export const CASHFREE_API_VERSION =
  process.env.CASHFREE_API_VERSION || "2025-01-01";

export function isCashfreeMock() {
  if (process.env.CASHFREE_MOCK === "true") return true;
  if (process.env.CASHFREE_MOCK === "false") return false;
  return !process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET;
}

export function cashfreeMode(): "sandbox" | "production" {
  return process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
}

function cashfreeBaseUrl() {
  return cashfreeMode() === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function requiredCredentials() {
  const appId = process.env.CASHFREE_CLIENT_ID;
  const secret = process.env.CASHFREE_CLIENT_SECRET;
  if (!appId || !secret) {
    throw new Error(
      "Cashfree keys are missing. Add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET.",
    );
  }
  return { appId, secret };
}

async function cashfreeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { appId, secret } = requiredCredentials();
  const response = await fetch(`${cashfreeBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-version": CASHFREE_API_VERSION,
      "x-client-id": appId,
      "x-client-secret": secret,
      ...(init?.headers || {}),
    },
  });

  const text = await response.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: text };
  }

  if (!response.ok) {
    const message =
      (json as { message?: string })?.message ||
      `Cashfree request failed (${response.status})`;
    throw new Error(message);
  }

  return json as T;
}

export type CashfreeOrder = {
  order_id: string;
  payment_session_id: string;
  order_status?: string;
};

export type CashfreePayment = {
  cf_payment_id?: string | number;
  payment_status?: string;
  payment_group?: string;
  payment_amount?: number;
};

export async function createCashfreeOrder(input: {
  orderId: string;
  amount: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}) {
  const appUrl = process.env.APP_URL || "http://localhost:3001";
  return cashfreeFetch<CashfreeOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: input.customerId,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone,
      },
      order_meta: {
        return_url: `${appUrl}/checkout/status?order_id={order_id}`,
        notify_url: `${appUrl}/api/webhooks/cashfree`,
      },
      order_note: "CB Track online store",
    }),
  });
}

export async function getCashfreeOrder(orderId: string) {
  return cashfreeFetch<CashfreeOrder>(`/orders/${encodeURIComponent(orderId)}`);
}

export async function getCashfreePayments(orderId: string) {
  return cashfreeFetch<CashfreePayment[]>(
    `/orders/${encodeURIComponent(orderId)}/payments`,
  );
}

export function verifyCashfreeWebhook(
  signature: string | null,
  timestamp: string | null,
  rawBody: string,
) {
  if (!signature || !timestamp) return false;
  const secret = process.env.CASHFREE_CLIENT_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret)
    .update(timestamp + rawBody)
    .digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function mapPaymentStatus(status?: string) {
  const value = (status || "").toUpperCase();
  if (value === "SUCCESS") {
    return { status: "paid", paymentStatus: "SUCCESS" as const };
  }
  if (["FAILED", "CANCELLED", "USER_DROPPED", "VOID"].includes(value)) {
    return { status: "failed", paymentStatus: value };
  }
  return { status: "pending", paymentStatus: value || "PENDING" };
}
