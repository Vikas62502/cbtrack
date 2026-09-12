import catalog from "./catalog.json";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  price: number;
  compareAt: number;
  category: string;
  collection: string;
  bestseller: boolean;
  banner: boolean;
  bannerImage?: string;
  image: string;
  images: string[];
  features: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
};

export const categories: Category[] = catalog.categories;
export const collections: Collection[] = catalog.collections;
export const products: Product[] = catalog.products;
export const testimonials: Testimonial[] = catalog.testimonials;

export function getDiscountPercent(price: number, compareAt: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export function searchProducts(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  );
}

/** Banner products from JSON — each product appears once. */
export function getBannerProducts() {
  const seen = new Set<string>();
  return products.filter((p) => {
    if (!p.banner) return false;
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export function getCategorySections() {
  return categories
    .map((category) => ({
      category,
      products: getProductsByCategory(category.slug),
    }))
    .filter((section) => section.products.length > 0);
}
