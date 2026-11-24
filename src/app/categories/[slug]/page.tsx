import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import {
  categories,
  getProductsByCategory,
} from "@/data/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const list = getProductsByCategory(slug);

  return (
    <div className="site-width py-10">
      <nav className="mb-6 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--ink)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--ink)]">{category.name}</span>
      </nav>

      <div className="relative mb-10 h-[240px] overflow-hidden rounded-3xl bg-[#2a2a2a] sm:h-[300px] md:h-[380px] lg:h-[440px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15" />
        <div className="relative flex h-full flex-col justify-end px-6 py-8 text-white md:px-10 md:py-12">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
            {category.description}
          </p>
        </div>
      </div>

      <div className="product-grid">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
