"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { formatINR } from "@/data/products";
import { loadCheckoutDetails, saveCheckoutDetails } from "@/lib/checkout-details";
import { useCart } from "@/lib/cart-context";

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-[var(--ink)]">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 outline-none focus:border-[var(--navy)] focus:ring-2 focus:ring-[var(--navy)]/15"
      />
    </label>
  );
}

export default function CheckoutClient() {
  const { ready, lines, subtotal, itemCount } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const saved = loadCheckoutDetails();
    if (!saved) return;
    setName(saved.name);
    setEmail(saved.email);
    setPhone(saved.phone);
    setAddressLine1(saved.addressLine1);
    setAddressLine2(saved.addressLine2);
    setCity(saved.city);
    setState(saved.state);
    setPincode(saved.pincode);
  }, []);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const total = useMemo(
    () => Math.max(0, subtotal - discount),
    [subtotal, discount],
  );

  async function applyCoupon() {
    setCouponMessage("");
    const response = await fetch("/api/checkout/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
        coupon,
        phone,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setDiscount(0);
      setCouponMessage(data.error || "Coupon could not be applied.");
      return;
    }
    setDiscount(data.discount || 0);
    setCouponMessage(
      data.discount
        ? `Coupon ${data.couponCode} applied.`
        : "Enter CBTRACK10 for 10% off your first order.",
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.product.id,
            quantity: l.quantity,
          })),
          coupon,
          customer: {
            name,
            email,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not start payment.");
      }

      saveCheckoutDetails({
        name,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
      });
      sessionStorage.setItem("cb-last-order", data.order.id);
      sessionStorage.setItem("cb-last-phone", phone);
      if (data.mock) {
        router.push(`/checkout/mock?order_id=${data.order.id}`);
        return;
      }

      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({ mode: data.cashfreeMode });
      if (!cashfree) {
        throw new Error("Payment page could not load. Try again.");
      }
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment could not start.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return <div className="site-width py-20 text-center text-[var(--muted)]">Loading checkout…</div>;
  }

  if (itemCount === 0) {
    return (
      <div className="site-width py-20 text-center">
        <h1 className="text-2xl tracking-tight md:text-3xl font-semibold">
          Your cart is empty
        </h1>
        <p className="mt-3 text-[var(--muted)]">Add products before checkout.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="site-width grid gap-8 py-10 lg:grid-cols-[1.3fr_0.7fr]"
    >
      <div>
        <h1 className="mb-6 text-2xl tracking-tight md:text-3xl font-semibold">
          Checkout
        </h1>
        <div className="space-y-4 rounded-3xl border border-black/6 bg-white p-5 md:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" value={name} onChange={setName} required />
            <Field
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            <Field
              label="Mobile"
              name="phone"
              value={phone}
              onChange={setPhone}
              placeholder="10-digit number"
              required
            />
            <Field
              label="Pincode"
              name="pincode"
              value={pincode}
              onChange={setPincode}
              required
            />
          </div>
          <Field
            label="Address"
            name="addressLine1"
            value={addressLine1}
            onChange={setAddressLine1}
            required
          />
          <Field
            label="Apartment / landmark (optional)"
            name="addressLine2"
            value={addressLine2}
            onChange={setAddressLine2}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" name="city" value={city} onChange={setCity} required />
            <Field label="State" name="state" value={state} onChange={setState} required />
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-3xl bg-[var(--sand)] p-6">
        <h2 className="text-lg tracking-tight md:text-xl font-semibold">
          Pay securely
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map(({ product, quantity, lineTotal }) => (
            <li key={product.id} className="flex justify-between gap-3">
              <span className="line-clamp-2">
                {product.shortName} × {quantity}
              </span>
              <span className="shrink-0 font-medium">{formatINR(lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
            className="min-w-0 flex-1 rounded-full border border-black/15 bg-white px-4 py-2 text-sm outline-none"
          />
          <button
            type="button"
            onClick={applyCoupon}
            className="rounded-full border border-[var(--navy)] px-4 py-2 text-sm font-semibold text-[var(--navy)]"
          >
            Apply
          </button>
        </div>
        {couponMessage && (
          <p className="mt-2 text-xs text-[var(--muted)]">{couponMessage}</p>
        )}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Discount</span>
            <span className="text-[var(--sale)]">
              {discount ? `− ${formatINR(discount)}` : formatINR(0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Shipping</span>
            <span className="font-semibold text-[var(--sale)]">Free</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-black/10 pt-4">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">{formatINR(total)}</span>
        </div>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-[var(--navy)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--navy-deep)] disabled:opacity-60"
        >
          {busy ? "Starting payment…" : "Pay with Cashfree"}
        </button>
        <p className="mt-3 text-center text-xs text-[var(--muted)]">
          UPI · Cards · Net Banking · Wallets
        </p>
      </aside>
    </form>
  );
}
