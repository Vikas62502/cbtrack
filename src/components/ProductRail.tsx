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
    <section id={id} className="site-width scroll-mt-28 py-12 md:py-14">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--ink)] sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-xl text-sm text-[var(--muted)] md:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {id && (
          <Link
            href={`/categories/${id}`}
            className="text-sm font-semibold text-[var(--navy)] hover:underline"
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
