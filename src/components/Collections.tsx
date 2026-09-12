import Link from "next/link";
import { collections } from "@/data/products";

export default function Collections() {
  return (
    <section className="bg-[var(--cream-deep)] py-14">
      <div className="site-width">
        <div className="mb-8 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)] md:text-4xl">
            Shop by Collection
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Everything you need to turn your car key cover premium.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {collections.map((c, i) => (
            <Link
              key={c.id}
              href={`/products?collection=${c.slug}`}
              className="group relative min-h-[280px] overflow-hidden rounded-3xl"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white md:text-3xl">
                  {c.name}
                </h3>
                <span className="mt-2 inline-block text-sm text-white/80 transition group-hover:translate-x-1">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
