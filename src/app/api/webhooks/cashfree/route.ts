import { NextResponse } from "next/server";
import {
  mapPaymentStatus,
  verifyCashfreeWebhook,
} from "@/lib/cashfree";
import { prisma } from "@/lib/db";
import { recordTransaction } from "@/lib/order-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");
  const timestamp = request.headers.get("x-webhook-timestamp");

  if (!verifyCashfreeWebhook(signature, timestamp, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: {
    type?: string;
    data?: {
      order?: { order_id?: string };
      payment?: {
        cf_payment_id?: string | number;
        payment_status?: string;
        payment_group?: string;
      };
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = payload.data?.order?.order_id;
  if (!orderId) {
    return NextResponse.json({ ok: true });
  }

  const existing = await prisma.order.findFirst({
    where: { OR: [{ id: orderId }, { cashfreeOrderId: orderId }] },
  });
  if (!existing) {
    return NextResponse.json({ ok: true });
  }

  const mapped = mapPaymentStatus(payload.data?.payment?.payment_status);
  const paidAt = mapped.status === "paid" ? new Date() : null;
  const cfPaymentId = payload.data?.payment?.cf_payment_id
    ? String(payload.data.payment.cf_payment_id)
    : null;
  await prisma.order.update({
    where: { id: existing.id },
    data: {
      status: mapped.status,
      paymentStatus: mapped.paymentStatus,
      cfPaymentId: cfPaymentId || undefined,
      paymentMethod: payload.data?.payment?.payment_group || undefined,
      paidAt: paidAt || undefined,
      fulfillmentStatus:
        mapped.status === "paid" && existing.fulfillmentStatus === "none"
          ? "processing"
          : undefined,
    },
  });
  await recordTransaction({
    orderId: existing.id,
    amount: existing.total,
    status: mapped.paymentStatus,
    provider: "cashfree",
    cashfreeOrderId: existing.cashfreeOrderId,
    cfPaymentId,
    paymentMethod: payload.data?.payment?.payment_group,
    paidAt,
  });

  return NextResponse.json({ ok: true });
}
