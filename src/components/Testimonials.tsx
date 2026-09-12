import { testimonials } from "@/data/products";

export default function Testimonials() {
  return (
    <section className="bg-[var(--cream)] py-14">
      <div className="site-width">
        <h2 className="mb-8 text-center font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)] md:text-4xl">
          What our customers say
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <blockquote
              key={t.id}
              className="rounded-3xl border border-black/6 bg-white p-6 shadow-sm"
              style={{
                animation: `riseIn 0.6s ease ${i * 0.1}s both`,
              }}
            >
              <p className="text-sm leading-relaxed text-[var(--ink)]/85">
                “{t.quote}”
              </p>
              <footer className="mt-4 text-sm font-semibold text-[var(--navy)]">
                — {t.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
