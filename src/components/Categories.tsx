import Link from "next/link";
import { categories } from "@/data/products";

export default function Categories() {
  return (
    <section className="site-width py-8 md:py-10">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group overflow-hidden rounded-xl border border-black/6 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative h-28 overflow-hidden bg-white sm:h-32 md:h-36">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="border-t border-black/5 px-2 py-2 text-center">
              <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--ink)] md:text-base">
                {c.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
