import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  normalizePhone,
  priceCart,
  type CheckoutItemInput,
} from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: CheckoutItemInput[];
      coupon?: string;
      phone?: string;
    };
    const phone = normalizePhone(body.phone || "");
    const previousPaid = phone
      ? await prisma.order.count({
          where: { customerPhone: phone, status: "paid" },
        })
      : 0;
    const priced = priceCart(body.items || [], {
      coupon: body.coupon,
      isFirstOrder: previousPaid === 0,
    });
    return NextResponse.json({
      subtotal: priced.subtotal,
      discount: priced.discount,
      total: priced.total,
      couponCode: priced.couponCode,
      couponApplied: priced.discount > 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not price cart.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
