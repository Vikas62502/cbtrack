import { NextResponse } from "next/server";
import { isCashfreeMock } from "@/lib/cashfree";
import { prisma } from "@/lib/db";
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
  const order = await prisma.order.update({
    where: { id: orderId },
    data: success
      ? {
          status: "paid",
          paymentStatus: "SUCCESS",
          paymentMethod: "MOCK",
          paidAt: new Date(),
          fulfillmentStatus: "processing",
        }
      : {
          status: "failed",
          paymentStatus: "FAILED",
        },
    include: { items: true },
  });

  return NextResponse.json({ order: publicOrder(order) });
}
