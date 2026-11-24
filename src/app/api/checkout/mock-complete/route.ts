import { NextResponse } from "next/server";
import { isCashfreeMock } from "@/lib/cashfree";
import { prisma } from "@/lib/db";
import { recordTransaction } from "@/lib/order-store";
import { publicOrder } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isCashfreeMock()) {
    return NextResponse.json(
      { error: "Mock payments are disabled." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as {
    orderId?: string;
    result?: "success" | "failed";
  };
  const orderId = body.orderId?.trim();
  if (!orderId) {
    return NextResponse.json({ error: "Missing order id." }, { status: 400 });
  }

  const success = body.result !== "failed";
  const paidAt = success ? new Date() : null;
  const order = await prisma.order.update({
    where: { id: orderId },
    data: success
      ? {
          status: "paid",
          paymentStatus: "SUCCESS",
          paymentMethod: "MOCK",
          paidAt,
          fulfillmentStatus: "processing",
        }
      : {
          status: "failed",
          paymentStatus: "FAILED",
        },
    include: { items: true },
  });
  await recordTransaction({
    orderId: order.id,
    amount: order.total,
    status: success ? "SUCCESS" : "FAILED",
    provider: "mock",
    cashfreeOrderId: order.cashfreeOrderId,
    paymentMethod: success ? "MOCK" : null,
    paidAt,
  });

  return NextResponse.json({ order: publicOrder(order) });
}
