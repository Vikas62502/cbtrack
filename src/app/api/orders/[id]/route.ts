import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publicOrder } from "@/lib/pricing";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const phone = new URL(request.url).searchParams.get("phone") || "";
  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { cashfreeOrderId: id }] },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const digits = phone.replace(/\D/g, "");
  if (digits && !order.customerPhone.endsWith(digits.slice(-10))) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: publicOrder(order) });
}
