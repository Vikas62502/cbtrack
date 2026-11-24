import { prisma } from "@/lib/db";

type PartyInput = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

export async function saveCustomerAndAddress(input: PartyInput) {
  const customer = await prisma.customer.upsert({
    where: { phone: input.phone },
    update: { name: input.name, email: input.email },
    create: {
      name: input.name,
      email: input.email,
      phone: input.phone,
    },
  });

  const address = await prisma.address.create({
    data: {
      customerId: customer.id,
      line1: input.addressLine1,
      line2: input.addressLine2,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
    },
  });

  return { customer, address };
}

type TransactionInput = {
  orderId: string;
  amount: number;
  status: string;
  provider?: string;
  cashfreeOrderId?: string | null;
  paymentSessionId?: string | null;
  cfPaymentId?: string | null;
  paymentMethod?: string | null;
  paidAt?: Date | null;
};

export async function recordTransaction(input: TransactionInput) {
  const existing = input.cashfreeOrderId
    ? await prisma.transaction.findFirst({
        where: {
          orderId: input.orderId,
          cashfreeOrderId: input.cashfreeOrderId,
        },
      })
    : await prisma.transaction.findFirst({
        where: { orderId: input.orderId },
        orderBy: { createdAt: "desc" },
      });

  const data = {
    status: input.status,
    provider: input.provider,
    cashfreeOrderId: input.cashfreeOrderId ?? undefined,
    paymentSessionId: input.paymentSessionId ?? undefined,
    cfPaymentId: input.cfPaymentId ?? undefined,
    paymentMethod: input.paymentMethod ?? undefined,
    paidAt: input.paidAt ?? undefined,
  };

  if (!existing) {
    return prisma.transaction.create({
      data: {
        orderId: input.orderId,
        amount: input.amount,
        currency: "INR",
        ...data,
      },
    });
  }

  return prisma.transaction.update({
    where: { id: existing.id },
    data,
  });
}
