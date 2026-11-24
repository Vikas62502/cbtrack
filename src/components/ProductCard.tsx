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
      className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-black/8 bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative flex aspect-square items-center justify-center bg-white p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.shortName}
          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.03]"
        />
        {product.bestseller && (
          <span className="absolute left-2.5 top-2.5 rounded bg-[var(--navy)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Bestseller
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-black/6 px-3 py-3 md:px-3.5">
        <h3 className="line-clamp-2 min-h-[2.5em] text-[13px] font-medium leading-snug text-[var(--ink)] md:text-sm">
          {product.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-semibold tabular-nums text-[var(--ink)]">
            {formatINR(product.price)}
          </span>
          <span className="text-xs text-[var(--muted)] line-through">
            {formatINR(product.compareAt)}
          </span>
          <span className="text-xs font-semibold text-[var(--sale)]">
            {discount}% off
          </span>
        </div>
      </div>
    </Link>
  );
}
