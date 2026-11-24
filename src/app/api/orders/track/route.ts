import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizePhone, publicOrder } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { orderId?: string; phone?: string };
  const orderId = body.orderId?.trim().toUpperCase();
  const phone = normalizePhone(body.phone || "");

  if (!orderId || !phone) {
    return NextResponse.json(
      { error: "Enter your order ID and mobile number." },
      { status: 400 },
    );
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, customerPhone: phone },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json(
      { error: "No order found for that ID and mobile number." },
      { status: 404 },
    );
  }

  return NextResponse.json({ order: publicOrder(order) });
}
