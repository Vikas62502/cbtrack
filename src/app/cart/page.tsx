"use client";

import Link from "next/link";
import { formatINR } from "@/data/products";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { ready, lines, subtotal, updateQuantity, removeItem, itemCount } = useCart();

  if (!ready) {
    return <div className="site-width py-20 text-center text-[var(--muted)]">Loading cart…</div>;
  }

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
        <h1 className="text-2xl tracking-tight md:text-3xl font-semibold text-[var(--ink)]">
          Your cart is empty
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Add premium car accessories and come back to checkout.
        </p>
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
    <div className="site-width grid gap-8 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      <div>
        <h1 className="mb-6 text-2xl tracking-tight md:text-3xl font-semibold text-[var(--ink)]">
          Cart ({itemCount})
        </h1>
        <ul className="space-y-4">
          {lines.map(({ product, quantity, lineTotal }) => (
            <li
              key={product.id}
              className="flex flex-col gap-4 rounded-2xl border border-black/6 bg-white p-4 sm:flex-row sm:items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.shortName}
                className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-24"
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${product.slug}`}
                  className="line-clamp-2 font-medium text-[var(--ink)] hover:text-[var(--navy)]"
                >
                  {product.shortName}
                </Link>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {formatINR(product.price)} each
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-black/15">
                    <button
                      type="button"
                      className="px-3 py-1"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm">{quantity}</span>
                    <button
                      type="button"
                      className="px-3 py-1"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="text-sm text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-right text-lg font-semibold">
                {formatINR(lineTotal)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit rounded-3xl bg-[var(--sand)] p-6">
        <h2 className="text-lg tracking-tight md:text-xl font-semibold">
          Order Summary
        </h2>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-[var(--muted)]">Subtotal</span>
          <span className="font-semibold">{formatINR(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-[var(--muted)]">Shipping</span>
          <span className="font-semibold text-[var(--sale)]">Free</span>
        </div>
        <div className="mt-4 border-t border-black/10 pt-4 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">{formatINR(subtotal)}</span>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Use code <strong>CBTRACK10</strong> for 10% off your first order.
        </p>
        <Link
          href="/checkout"
          className="mt-5 block w-full rounded-full bg-[var(--navy)] py-3.5 text-center text-sm font-semibold text-white hover:bg-[var(--navy-deep)]"
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/products"
          className="mt-3 block text-center text-sm text-[var(--navy)] hover:underline"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
