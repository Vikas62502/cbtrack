"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import BrandLogo from "@/components/BrandLogo";
import { categories, collections } from "@/data/products";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { itemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"categories" | "collections" | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[var(--cream)] border-b border-black/5">
        <div className="site-width flex items-center gap-4 py-3 md:gap-6 md:py-3.5">
          <BrandLogo priority />

          <form
            onSubmit={onSearch}
            className="hidden min-w-0 flex-1 md:block"
          >
            <label className="sr-only" htmlFor="site-search">
              Search
            </label>
            <input
              id="site-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="h-11 w-full rounded-full border border-black/10 bg-white px-4 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--navy)] focus:ring-2 focus:ring-[var(--navy)]/15"
            />
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/cart"
              className="relative rounded-full p-2 text-[var(--ink)] transition hover:bg-black/5"
              aria-label={`Cart, ${itemCount} items`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--navy)] px-1 text-[11px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/orders/track"
              className="hidden text-sm font-medium text-[var(--ink)] sm:inline hover:text-[var(--navy)]"
            >
              Track order
            </Link>

            <button
              type="button"
              className="rounded-full p-2 text-[var(--ink)] hover:bg-black/5 md:hidden"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <nav
          ref={dropdownRef}
          className="relative hidden border-t border-black/5 md:block"
        >
          <ul className="site-width flex items-center gap-6 py-2.5 text-sm font-medium text-[var(--ink)] lg:gap-8">
            <li>
              <Link href="/#cleaning-kit" className="hover:text-[var(--navy)]">
                Shop by Category
              </Link>
            </li>
            <li className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-[var(--navy)]"
                onClick={() =>
                  setOpenDropdown((d) =>
                    d === "categories" ? null : "categories",
                  )
                }
              >
                Categories
                <ChevronDown />
              </button>
              {openDropdown === "categories" && (
                <Dropdown>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/categories/${c.slug}`}
                      className="block px-4 py-2.5 text-sm hover:bg-[var(--sand)]"
                    >
                      {c.name}
                    </Link>
                  ))}
                </Dropdown>
              )}
            </li>
            <li className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-[var(--navy)]"
                onClick={() =>
                  setOpenDropdown((d) =>
                    d === "collections" ? null : "collections",
                  )
                }
              >
                Collections
                <ChevronDown />
              </button>
              {openDropdown === "collections" && (
                <Dropdown>
                  {collections.map((c) => (
                    <Link
                      key={c.id}
                      href={`/products?collection=${c.slug}`}
                      className="block px-4 py-2.5 text-sm hover:bg-[var(--sand)]"
                    >
                      {c.name}
                    </Link>
                  ))}
                </Dropdown>
              )}
            </li>
            <li>
              <Link href="/products" className="hover:text-[var(--navy)]">
                All Products
              </Link>
            </li>
          </ul>
        </nav>

        {menuOpen && (
          <div className="border-t border-black/5 bg-[var(--cream)] px-4 py-4 md:hidden">
            <form onSubmit={onSearch} className="mb-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="w-full rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm outline-none"
              />
            </form>
            <div className="flex flex-col gap-1 text-sm font-medium">
              <Link href="/#cleaning-kit" className="rounded-lg px-3 py-2.5 hover:bg-black/5">
                Shop by Category
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className="rounded-lg px-3 py-2.5 hover:bg-black/5"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/products" className="rounded-lg px-3 py-2.5 hover:bg-black/5">
                All Products
              </Link>
              <Link href="/cart" className="rounded-lg px-3 py-2.5 hover:bg-black/5">
                Cart ({itemCount})
              </Link>
              <Link href="/orders/track" className="rounded-lg px-3 py-2.5 hover:bg-black/5">
                Track order
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[var(--sand)] py-2 text-center text-[13px] font-medium leading-5 text-[var(--ink)]">
        Get 10% off on first order use{" "}
        <span className="font-semibold">&quot;CBTRACK10&quot;</span> code at
        checkout
      </div>
    </header>
  );
}

function ChevronDown() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-1/2 top-full z-50 mt-2 min-w-48 -translate-x-1/2 overflow-hidden rounded-xl border border-black/8 bg-white py-1 shadow-lg">
      {children}
    </div>
  );
}
