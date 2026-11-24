"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function MockPayClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderId = params.get("order_id") || "";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function complete(result: "success" | "failed") {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/checkout/mock-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, result }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment failed.");
      if (result === "success") clearCart();
      router.push(`/checkout/status?order_id=${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="site-width max-w-lg py-16">
      <h1 className="tracking-tight text-3xl font-semibold">
        Test payment
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Cashfree sandbox keys are not set, so this local test checkout is used.
        Add <code>CASHFREE_APP_ID</code> and{" "}
        <code>CASHFREE_SECRET_KEY</code> in <code>.env</code> and set{" "}
        <code>CASHFREE_MOCK=false</code> for live Cashfree checkout.
      </p>
      <p className="mt-4 text-sm">
        Order ID: <strong>{orderId || "missing"}</strong>
      </p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          disabled={busy || !orderId}
          onClick={() => complete("success")}
          className="rounded-full bg-[var(--navy)] py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          Simulate successful payment
        </button>
        <button
          type="button"
          disabled={busy || !orderId}
          onClick={() => complete("failed")}
          className="rounded-full border border-black/15 py-3 text-sm font-semibold disabled:opacity-60"
        >
          Simulate failed payment
        </button>
      </div>
    </div>
  );
}
