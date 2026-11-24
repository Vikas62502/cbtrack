"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  id?: string;
};

export default function ProductRail({ title, subtitle, products, id }: Props) {
  return (
    <section id={id} className="site-width scroll-mt-28 py-8 md:py-10">
      <div className="mb-4 flex items-start justify-between gap-4 md:mb-5">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--ink)] md:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              {subtitle}
            </p>
          )}
        </div>
        {id && (
          <Link
            href={`/categories/${id}`}
            className="mt-1 shrink-0 text-sm font-medium text-[var(--navy)] hover:underline"
          >
            View all →
          </Link>
        )}
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
