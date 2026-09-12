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
