import { products } from "@/data/products";

export const FIRST_ORDER_COUPON = "CBTRACK10";
export const FIRST_ORDER_DISCOUNT = 0.1;

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

export type PricedLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type PricedCart = {
  lines: PricedLine[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
};

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function priceCart(
  items: CheckoutItemInput[],
  options: { coupon?: string; isFirstOrder: boolean },
): PricedCart {
  const lines: PricedLine[] = [];

  for (const item of items) {
    const quantity = Math.floor(Number(item.quantity));
    if (!item.productId || !Number.isFinite(quantity) || quantity < 1) {
      throw new Error("Each item needs a valid product and quantity.");
    }
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error("One of the products is no longer available.");
    }
    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.shortName,
      image: product.image,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    });
  }

  if (!lines.length) {
    throw new Error("Your cart is empty.");
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const coupon = options.coupon?.trim().toUpperCase() || "";
  const applyCoupon =
    coupon === FIRST_ORDER_COUPON && options.isFirstOrder && subtotal > 0;
  const discount = applyCoupon ? Math.round(subtotal * FIRST_ORDER_DISCOUNT) : 0;
  const total = Math.max(1, subtotal - discount);

  return {
    lines,
    subtotal,
    discount,
    total,
    couponCode: applyCoupon ? FIRST_ORDER_COUPON : coupon ? coupon : null,
  };
}

export function publicOrder(order: {
  id: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus?: string | null;
  trackingNumber?: string | null;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string | null;
  createdAt: Date;
  paidAt: Date | null;
  shippedAt?: Date | null;
  items: {
    productId: string;
    slug: string;
    name: string;
    image: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
}) {
  return {
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus || "none",
    trackingNumber: order.trackingNumber || null,
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    couponCode: order.couponCode,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    address: {
      line1: order.addressLine1,
      line2: order.addressLine2,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
    },
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt.toISOString(),
    paidAt: order.paidAt?.toISOString() ?? null,
    shippedAt: order.shippedAt?.toISOString() ?? null,
    items: order.items,
  };
}
