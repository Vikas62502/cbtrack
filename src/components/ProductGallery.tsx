"use client";

import { useState } from "react";
import type { Product } from "@/data/products";

export default function ProductGallery({ product }: { product: Product }) {
  const shots = product.images.length ? product.images : [product.image];
  const [active, setActive] = useState(0);
  const current = shots[active] || product.image;

  return (
    <div className="min-w-0 w-full">
      <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-white md:rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current}
          alt={product.shortName}
          className="mx-auto h-auto max-h-[70vh] w-auto max-w-full object-contain"
        />
      </div>
      {shots.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {shots.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white md:h-20 md:w-20 ${
                i === active
                  ? "border-[var(--navy)] ring-2 ring-[var(--navy)]/20"
                  : "border-black/10"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
