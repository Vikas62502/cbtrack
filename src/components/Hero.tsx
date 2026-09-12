"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  formatINR,
  getBannerProducts,
  getDiscountPercent,
} from "@/data/products";

export default function Hero() {
  const slides = getBannerProducts();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback(
    (dir: number) => {
      if (count === 0) return;
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => go(1), 5500);
    return () => clearInterval(id);
  }, [count, go]);

  if (count === 0) return null;

  const slide = slides[index];
  const discount = getDiscountPercent(slide.price, slide.compareAt);
  const bannerSrc = slide.bannerImage || slide.image;

  return (
    <section
      aria-label="Product banner carousel"
      className="relative overflow-hidden bg-[var(--hero)]"
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (dx > 40) go(-1);
        if (dx < -40) go(1);
        touchStartX.current = null;
      }}
    >
      <div className="relative min-h-[440px] md:min-h-[560px] lg:min-h-[640px] xl:min-h-[72vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={slide.id}
          src={bannerSrc}
          alt={slide.shortName}
          className="absolute inset-0 h-full w-full object-cover animate-[fadeIn_0.55s_ease]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20 md:via-black/40 md:to-transparent" />

        <div className="site-width relative z-10 flex min-h-[440px] flex-col justify-end pb-16 pt-10 md:min-h-[560px] md:justify-center md:pb-20 lg:min-h-[640px] xl:min-h-[72vh]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
            Featured · {slide.category.replace(/-/g, " ")}
          </p>
          <h1 className="mt-2 max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {slide.shortName}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3 text-white">
            <span className="text-2xl font-bold md:text-3xl">
              {formatINR(slide.price)}
            </span>
            <span className="text-sm text-white/55 line-through md:text-base">
              {formatINR(slide.compareAt)}
            </span>
            <span className="rounded-full bg-[var(--brand)] px-2.5 py-1 text-xs font-semibold">
              {discount}% Off
            </span>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/products/${slide.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Shop this product
            </Link>
            <Link
              href={`/categories/${slide.category}`}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View category
            </Link>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[var(--ink)] shadow sm:left-4 md:h-12 md:w-12"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[var(--ink)] shadow sm:right-4 md:h-12 md:w-12"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to ${item.shortName}`}
                aria-current={i === index ? true : undefined}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-7 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
