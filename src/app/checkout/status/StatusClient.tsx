"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderTimeline from "@/components/OrderTimeline";
import { formatINR } from "@/data/products";
import { saveLastOrder } from "@/lib/checkout-details";
import { useCart } from "@/lib/cart-context";

type PublicOrder = {
  id: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string | null;
  total: number;
  discount: number;
  customerName: string;
  customerPhone: string;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: { name: string; quantity: number; lineTotal: number }[];
};

export default function StatusClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderId = params.get("order_id") || "";
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("Missing order id.");
      return;
    }
    let cancelled = false;
    (async () => {
      await fetch(`/api/orders/${orderId}/sync`, { method: "POST" });
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      if (cancelled) return;
      if (!response.ok) {
        setError(data.error || "Order not found.");
        return;
      }
      setOrder(data.order);
      saveLastOrder(data.order.id, data.order.customerPhone);
      if (data.order.status === "paid") clearCart();
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, clearCart]);

  async function retryPay() {
    if (!order) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/pay`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not restart payment.");
      if (data.mock) {
        router.push(`/checkout/mock?order_id=${order.id}`);
        return;
      }
      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({ mode: data.cashfreeMode });
      if (!cashfree) throw new Error("Payment page could not load.");
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not restart payment.");
    } finally {
      setBusy(false);
    }
  }

  if (error && !order) {
    return (
      <div className="site-width py-16 text-center">
        <h1 className="text-2xl font-semibold">Payment status</h1>
        <p className="mt-3 text-[var(--muted)]">{error}</p>
        <Link href="/orders/track" className="mt-6 inline-block text-[var(--navy)]">
          Track an order
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="site-width py-16">Checking payment…</div>;
  }

  const paid = order.status === "paid";
  const failed = order.status === "failed";
  const whatsapp = `https://wa.me/917453014747?text=${encodeURIComponent(
    `Hi, I need help with order ${order.id}`,
  )}`;

  return (
    <div className="site-width max-w-2xl py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--navy)]">
        {paid ? "Payment successful" : failed ? "Payment failed" : "Payment pending"}
      </p>
      <h1 className="mt-2 tracking-tight text-3xl font-semibold">
        {paid ? "Thank you for your order" : "We could not confirm payment yet"}
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Order{" "}
        <button
          type="button"
          className="font-semibold text-[var(--ink)] underline-offset-2 hover:underline"
          onClick={async () => {
            await navigator.clipboard.writeText(order.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {order.id}
        </button>
        {copied ? " copied" : ""} · {order.customerName} · {order.customerPhone}
      </p>
      <div className="mt-6 rounded-3xl border border-black/6 bg-white p-5">
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.name} className="flex justify-between gap-3">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatINR(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-black/10 pt-4 font-semibold">
          <span>{paid ? "Total paid" : "Order total"}</span>
          <span>{formatINR(order.total)}</span>
        </div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Ship to {order.address.line1}, {order.address.city}, {order.address.state}{" "}
          {order.address.pincode}
        </p>
        <OrderTimeline
          status={order.status}
          fulfillmentStatus={order.fulfillmentStatus}
          trackingNumber={order.trackingNumber}
        />
      </div>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        {failed || (!paid && order.status === "pending") ? (
          <button
            type="button"
            disabled={busy}
            onClick={retryPay}
            className="rounded-full bg-[var(--navy)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Restarting…" : "Retry payment"}
          </button>
        ) : (
          <Link
            href={`/orders/track?order_id=${order.id}&phone=${order.customerPhone}`}
            className="rounded-full bg-[var(--navy)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Track order
          </Link>
        )}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold"
        >
          WhatsApp help
        </a>
        <Link href="/products" className="rounded-full px-5 py-2.5 text-sm font-semibold">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
