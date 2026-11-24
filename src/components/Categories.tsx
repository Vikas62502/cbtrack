import Link from "next/link";
import { categories } from "@/data/products";

export default function Categories() {
  return (
    <section className="site-width py-8 md:py-10">
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-[var(--ink)] md:text-2xl">
        Shop by category
      </h2>
      <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/8 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-white px-4 sm:h-36 md:h-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.name}
                className="max-h-[6.5rem] w-auto max-w-full object-contain transition duration-300 group-hover:scale-105 md:max-h-32"
              />
            </div>
            <div className="mt-auto flex h-11 items-center justify-center border-t border-black/6 px-3">
              <h3 className="text-center text-[13px] font-medium leading-tight text-[var(--ink)] md:text-sm">
                {c.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
