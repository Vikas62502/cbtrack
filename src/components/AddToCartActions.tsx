"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import {
  formatINR,
  getDiscountPercent,
  type Product,
} from "@/data/products";

export default function AddToCartActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const discount = getDiscountPercent(product.price, product.compareAt);

  function handleAdd() {
    addItem(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="rounded-3xl bg-[var(--sand)] p-6 md:p-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug text-[var(--ink)] md:text-3xl">
        {product.name}
      </h1>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-bold text-[var(--ink)]">
          {formatINR(product.price)}
        </span>
        <span className="text-lg text-[var(--muted)] line-through">
          {formatINR(product.compareAt)}
        </span>
        <span className="text-lg font-semibold text-[var(--sale)]">
          {discount}% Off
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">Incl. of all taxes</p>

      <p className="mt-5 text-sm leading-relaxed text-[var(--ink)]/80">
        {product.description}
      </p>

      <ul className="mt-5 space-y-2">
        {product.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-[var(--ink)]">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--navy)]" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-3">
        <label className="text-sm font-medium" htmlFor="qty">
          Qty
        </label>
        <div className="inline-flex items-center rounded-full border border-black/15 bg-white">
          <button
            type="button"
            className="px-3 py-2 text-lg"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <input
            id="qty"
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, Number(e.target.value) || 1))
            }
            className="w-12 border-x border-black/10 bg-transparent py-2 text-center text-sm outline-none"
          />
          <button
            type="button"
            className="px-3 py-2 text-lg"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-full border-2 border-[var(--navy)] px-6 py-3.5 text-sm font-semibold text-[var(--navy)] transition hover:bg-[var(--navy)] hover:text-white"
        >
          {added ? "Added ✓" : "Add To Cart"}
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-full bg-[var(--navy)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--navy-deep)]"
        >
          Buy Now
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-xs text-[var(--muted)]">
        <span>🚚 Delivered in 3–5 Days</span>
        <span>🛒 Free shipping on all orders!</span>
      </div>
    </div>
  );
}
