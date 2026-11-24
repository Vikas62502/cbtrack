"use client";

import { useState, type FormEvent } from "react";
import { formatINR } from "@/data/products";

type AdminOrder = {
  id: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string | null;
  total: number;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

const NEXT_STATUS: Record<string, string[]> = {
  none: ["processing"],
  processing: ["packed", "shipped"],
  packed: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
};

export default function AdminOrdersPage() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState<Record<string, string>>({});

  async function loadOrders() {
    const response = await fetch("/api/admin/orders");
    if (response.status === 401) {
      setOrders(null);
      return false;
    }
    const data = await response.json();
    setOrders(data.orders || []);
    return true;
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    await loadOrders();
  }

  async function updateOrder(
    id: string,
    fulfillmentStatus: string,
    trackingNumber?: string,
  ) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fulfillmentStatus, trackingNumber }),
    });
    await loadOrders();
  }

  if (!orders) {
    return (
      <form onSubmit={onLogin} className="site-width max-w-md py-16">
        <h1 className="text-2xl tracking-tight md:text-3xl font-semibold">
          Store admin
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Enter the admin password to view and update orders.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full rounded-xl border border-black/15 px-4 py-2.5"
        />
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-[var(--navy)] py-3 text-sm font-semibold text-white"
        >
          Sign in
        </button>
      </form>
    );
  }

  return (
    <div className="site-width py-10">
      <h1 className="text-2xl tracking-tight md:text-3xl font-semibold">
        Orders
      </h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/6 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--sand)]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Shipping</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-black/5 align-top">
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">
                  {order.customerName}
                  <div className="text-xs text-[var(--muted)]">{order.customerPhone}</div>
                </td>
                <td className="px-4 py-3">
                  {order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                </td>
                <td className="px-4 py-3">{formatINR(order.total)}</td>
                <td className="px-4 py-3 uppercase">{order.status}</td>
                <td className="px-4 py-3">
                  <div className="uppercase">{order.fulfillmentStatus}</div>
                  {order.status === "paid" && (
                    <div className="mt-2 flex flex-col gap-2">
                      <input
                        value={tracking[order.id] ?? order.trackingNumber ?? ""}
                        onChange={(e) =>
                          setTracking((current) => ({
                            ...current,
                            [order.id]: e.target.value,
                          }))
                        }
                        placeholder="Tracking no."
                        className="w-36 rounded-lg border border-black/15 px-2 py-1 text-xs"
                      />
                      <div className="flex flex-wrap gap-1">
                        {(NEXT_STATUS[order.fulfillmentStatus] || ["processing"]).map(
                          (next) => (
                            <button
                              key={next}
                              type="button"
                              onClick={() =>
                                updateOrder(
                                  order.id,
                                  next,
                                  tracking[order.id] ?? order.trackingNumber ?? "",
                                )
                              }
                              className="rounded-full bg-[var(--navy)] px-2.5 py-1 text-[11px] font-semibold text-white"
                            >
                              Mark {next}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-[var(--muted)]" colSpan={6}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
