import { NextResponse } from "next/server";
import {
  createCashfreeOrder,
  isCashfreeMock,
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
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.status === "paid") {
    return NextResponse.json({ error: "This order is already paid." }, { status: 400 });
  }

  const mock = isCashfreeMock();
  if (mock) {
    return NextResponse.json({
      mock: true,
      paymentSessionId: `mock_${order.id}`,
      cashfreeMode: "sandbox",
      order: publicOrder(order),
    });
  }

  const retryId = `${order.id}R${Date.now().toString(36).toUpperCase()}`.slice(0, 45);
  const cfOrder = await createCashfreeOrder({
    orderId: retryId,
    amount: order.total,
    customerId: `cust_${order.customerPhone}`,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
  });

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "pending",
      paymentStatus: "PENDING",
      cashfreeOrderId: cfOrder.order_id,
      paymentSessionId: cfOrder.payment_session_id,
    },
    include: { items: true },
  });
  await recordTransaction({
    orderId: order.id,
    amount: order.total,
    status: "PENDING",
    provider: "cashfree",
    cashfreeOrderId: cfOrder.order_id,
    paymentSessionId: cfOrder.payment_session_id,
  });

  return NextResponse.json({
    mock: false,
    paymentSessionId: cfOrder.payment_session_id,
    cashfreeMode: process.env.CASHFREE_ENV === "production" ? "production" : "sandbox",
    order: publicOrder(updated),
  });
}
