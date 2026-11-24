"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import OrderTimeline from "@/components/OrderTimeline";
import { formatINR } from "@/data/products";

type TrackedOrder = {
  id: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string | null;
  total: number;
  createdAt: string;
  address: { line1: string; city: string; state: string; pincode: string };
  items: { name: string; quantity: number; lineTotal: number }[];
};

export default function TrackClient() {
  const params = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fromQueryId = params.get("order_id") || "";
    const fromQueryPhone = params.get("phone") || "";
    const lastId = sessionStorage.getItem("cb-last-order") || "";
    const lastPhone = sessionStorage.getItem("cb-last-phone") || "";
    setOrderId(fromQueryId || lastId);
    setPhone(fromQueryPhone || lastPhone);
  }, [params]);

  async function lookup(id: string, mobile: string) {
    setBusy(true);
    setError("");
    setOrder(null);
    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, phone: mobile }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Order not found.");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not find that order.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const id = params.get("order_id");
    const mobile = params.get("phone");
    if (id && mobile) lookup(id, mobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await lookup(orderId, phone);
  }

  return (
    <div className="site-width max-w-xl py-12">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
        Track your order
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Enter the order ID from your payment confirmation and the mobile number
        used at checkout.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-3xl bg-[var(--sand)] p-6">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Order ID</span>
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 outline-none"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Mobile number</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 outline-none"
            required
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[var(--navy)] py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Looking up…" : "Track order"}
        </button>
      </form>

      {order && (
        <div className="mt-6 rounded-3xl border border-black/6 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--navy)]">
            {order.fulfillmentStatus === "none" ? order.status : order.fulfillmentStatus}
          </p>
          <h2 className="mt-1 text-xl font-semibold">{order.id}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Payment {order.paymentStatus} · {formatINR(order.total)}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.name} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatINR(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            {order.address.line1}, {order.address.city}, {order.address.state}{" "}
            {order.address.pincode}
          </p>
          <OrderTimeline
            status={order.status}
            fulfillmentStatus={order.fulfillmentStatus}
            trackingNumber={order.trackingNumber}
          />
        </div>
      )}
    </div>
  );
}
