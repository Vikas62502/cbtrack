import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { publicOrder } from "@/lib/pricing";

export const runtime = "nodejs";

const FULFILLMENT = ["processing", "packed", "shipped", "delivered"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as {
    fulfillmentStatus?: string;
    trackingNumber?: string;
  };

  const fulfillmentStatus = body.fulfillmentStatus?.trim();
  if (
    fulfillmentStatus &&
    !FULFILLMENT.includes(fulfillmentStatus as (typeof FULFILLMENT)[number])
  ) {
    return NextResponse.json({ error: "Invalid shipping status." }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      fulfillmentStatus: fulfillmentStatus || undefined,
      trackingNumber: body.trackingNumber?.trim() || undefined,
      shippedAt:
        fulfillmentStatus === "shipped" || fulfillmentStatus === "delivered"
          ? new Date()
          : undefined,
    },
    include: { items: true },
  });

  return NextResponse.json({ order: publicOrder(order) });
}
