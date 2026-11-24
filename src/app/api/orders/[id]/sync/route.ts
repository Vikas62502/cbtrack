import { NextResponse } from "next/server";
import {
  getCashfreePayments,
  isCashfreeMock,
  mapPaymentStatus,
} from "@/lib/cashfree";
import { prisma } from "@/lib/db";
import { recordTransaction } from "@/lib/order-store";
import { publicOrder } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { cashfreeOrderId: id }] },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (isCashfreeMock() || order.status === "paid") {
    return NextResponse.json({ order: publicOrder(order) });
  }

  try {
    const payments = await getCashfreePayments(order.cashfreeOrderId || order.id);
    const latest = payments?.[0];
    const mapped = mapPaymentStatus(latest?.payment_status);
    const paidAt = mapped.status === "paid" ? new Date() : order.paidAt;
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: mapped.status,
        paymentStatus: mapped.paymentStatus,
        cfPaymentId: latest?.cf_payment_id ? String(latest.cf_payment_id) : order.cfPaymentId,
        paymentMethod: latest?.payment_group || order.paymentMethod,
        paidAt,
        fulfillmentStatus:
          mapped.status === "paid" && order.fulfillmentStatus === "none"
            ? "processing"
            : order.fulfillmentStatus,
      },
      include: { items: true },
    });
    await recordTransaction({
      orderId: order.id,
      amount: order.total,
      status: mapped.paymentStatus,
      provider: "cashfree",
      cashfreeOrderId: order.cashfreeOrderId,
      cfPaymentId: latest?.cf_payment_id ? String(latest.cf_payment_id) : order.cfPaymentId,
      paymentMethod: latest?.payment_group || order.paymentMethod,
      paidAt,
    });
    return NextResponse.json({ order: publicOrder(updated) });
  } catch {
    return NextResponse.json({ order: publicOrder(order) });
  }
}
