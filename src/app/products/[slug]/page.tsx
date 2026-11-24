import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartActions from "@/components/AddToCartActions";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { getProductBySlug, products } from "@/data/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="site-width py-6 md:py-10">
      <nav className="mb-6 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--ink)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-[var(--ink)]">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--ink)]">{product.shortName}</span>
      </nav>

      <div className="grid min-w-0 gap-8 lg:grid-cols-2">
        <ProductGallery product={product} />
        <AddToCartActions product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 tracking-tight text-2xl font-semibold text-[var(--ink)] md:text-3xl">
            You may also like
          </h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
