import Link from "next/link";
import {
  formatINR,
  getDiscountPercent,
  type Product,
} from "@/data/products";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const discount = getDiscountPercent(product.price, product.compareAt);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-black/6 bg-white shadow-[0_8px_30px_rgba(20,16,12,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(20,16,12,0.1)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#efe8df]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.shortName}
          className="h-full w-full object-contain bg-white p-3 transition duration-500 group-hover:scale-105"
        />
        {product.bestseller && (
          <span className="absolute left-3 top-3 rounded-md bg-[var(--navy)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Bestseller
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col bg-[var(--sand)] px-4 py-4 md:px-5 md:py-5">
        <h3 className="line-clamp-2 min-h-[2.6em] text-sm font-medium leading-snug text-[var(--ink)] md:text-[15px]">
          {product.name}
        </h3>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--ink)] md:text-xl">
            {formatINR(product.price)}
          </span>
          <span className="text-sm text-[var(--muted)] line-through">
            {formatINR(product.compareAt)}
          </span>
          <span className="text-sm font-semibold text-[var(--sale)]">
            {discount}% Off
          </span>
        </div>
      </div>
    </Link>
  );
}
