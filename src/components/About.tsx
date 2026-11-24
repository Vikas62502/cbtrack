import Link from "next/link";

export default function About() {
  return (
    <section className="site-width grid items-center gap-8 py-16 md:grid-cols-2">
      <div className="relative min-h-[320px] overflow-hidden rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
          alt="Premium car accessories"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--ink)] md:text-2xl">
          About US
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
          Chairbord Pvt Ltd is the company behind chairbord.in and this store.
          We sell FASTag, GPS devices, and vehicle accessories, including car
          key covers, tag holders, cleaning kits, cloths, brushes, and dusters.
          Prices are in INR, and orders are delivered across India.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--navy-deep)]"
        >
          Shop All Products
        </Link>
      </div>
    </section>
  );
}
