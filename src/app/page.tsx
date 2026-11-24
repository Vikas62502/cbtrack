import About from "@/components/About";
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import ProductRail from "@/components/ProductRail";
import Testimonials from "@/components/Testimonials";
import { getCategorySections } from "@/data/products";

export default function HomePage() {
  const sections = getCategorySections();

  return (
    <>
      <section className="border-b border-black/5 bg-white">
        <p className="site-width py-4 text-sm leading-relaxed text-[var(--ink)]">
          Chairbord Pvt Ltd sells FASTag, GPS devices, and vehicle accessories.
          CB Track is our store for car key covers, cleaning kits, dusters,
          brushes, microfiber cloths, sponges, and tag holders. Prices are in
          INR (₹). This is the same business as chairbord.in.
        </p>
      </section>
      <Hero />
      <Categories />
      {sections.map(({ category, products }) => (
        <ProductRail
          key={category.id}
          id={category.slug}
          title={category.name}
          subtitle={category.description}
          products={products}
        />
      ))}
      <Testimonials />
      <About />
    </>
  );
}
