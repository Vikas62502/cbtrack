import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createCashfreeOrder,
  isCashfreeMock,
} from "@/lib/cashfree";
import { saveCustomerAndAddress } from "@/lib/order-store";
import {
  normalizePhone,
  priceCart,
  publicOrder,
  type CheckoutItemInput,
} from "@/lib/pricing";

export const runtime = "nodejs";

function generateOrderId() {
  return `CBT${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: CheckoutItemInput[];
      coupon?: string;
      customer?: {
        name?: string;
        email?: string;
        phone?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        pincode?: string;
      };
    };

    const name = body.customer?.name?.trim() || "";
    const email = body.customer?.email?.trim().toLowerCase() || "";
    const phone = normalizePhone(body.customer?.phone || "");
    const addressLine1 = body.customer?.addressLine1?.trim() || "";
    const addressLine2 = body.customer?.addressLine2?.trim() || "";
    const city = body.customer?.city?.trim() || "";
    const state = body.customer?.state?.trim() || "";
    const pincode = (body.customer?.pincode || "").replace(/\D/g, "");

    if (name.length < 2) {
      return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number." },
        { status: 400 },
      );
    }
    if (addressLine1.length < 4) {
      return NextResponse.json({ error: "Enter your delivery address." }, { status: 400 });
    }
    if (!city || !state) {
      return NextResponse.json({ error: "Enter city and state." }, { status: 400 });
    }
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Enter a valid 6-digit pincode." }, { status: 400 });
    }

    const previousPaid = await prisma.order.count({
      where: { customerPhone: phone, status: "paid" },
    });
    const priced = priceCart(body.items || [], {
      coupon: body.coupon,
      isFirstOrder: previousPaid === 0,
    });

    if (body.coupon?.trim() && !priced.discount) {
      return NextResponse.json(
        {
          error:
            previousPaid > 0
              ? "CBTRACK10 is only for your first prepaid order."
              : "This coupon code is not valid.",
        },
        { status: 400 },
      );
    }

    const orderId = generateOrderId();
    const mock = isCashfreeMock();
    let paymentSessionId: string | null = mock ? `mock_${orderId}` : null;
    let cashfreeOrderId: string | null = mock ? orderId : null;

    if (!mock) {
      const cfOrder = await createCashfreeOrder({
        orderId,
        amount: priced.total,
        customerId: `cust_${phone}`,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      });
      paymentSessionId = cfOrder.payment_session_id;
      cashfreeOrderId = cfOrder.order_id;
    }

    const { customer, address } = await saveCustomerAndAddress({
      name,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    });

    const order = await prisma.order.create({
      data: {
        id: orderId,
        customerId: customer.id,
        addressId: address.id,
        status: "pending",
        paymentStatus: "PENDING",
        subtotal: priced.subtotal,
        discount: priced.discount,
        total: priced.total,
        couponCode: priced.couponCode,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        cashfreeOrderId,
        paymentSessionId,
        transactions: {
          create: {
            amount: priced.total,
            currency: "INR",
            status: "PENDING",
            provider: mock ? "mock" : "cashfree",
            cashfreeOrderId,
            paymentSessionId,
          },
        },
        items: {
          create: priced.lines.map((line) => ({
            productId: line.productId,
            slug: line.slug,
            name: line.name,
            image: line.image,
            unitPrice: line.unitPrice,
            quantity: line.quantity,
            lineTotal: line.lineTotal,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      mock,
      paymentSessionId,
      cashfreeMode: process.env.CASHFREE_ENV === "production" ? "production" : "sandbox",
      order: publicOrder(order),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
