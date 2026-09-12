import ProductCard from "@/components/ProductCard";
import {
  products,
  searchProducts,
  collections,
} from "@/data/products";

type Props = {
  searchParams: Promise<{ q?: string; collection?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  let list = params.q ? searchProducts(params.q) : products;

  if (params.collection) {
    list = list.filter((p) => p.collection === params.collection);
  }

  const collectionName = collections.find(
    (c) => c.slug === params.collection,
  )?.name;

  return (
    <div className="site-width py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)] md:text-4xl">
          {collectionName || (params.q ? `Results for “${params.q}”` : "All Products")}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {list.length} product{list.length === 1 ? "" : "s"}
        </p>
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl bg-[var(--sand)] px-6 py-12 text-center text-[var(--muted)]">
          No products found. Try another search.
        </p>
      ) : (
        <div className="product-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
