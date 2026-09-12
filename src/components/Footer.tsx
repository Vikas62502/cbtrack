import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { categories } from "@/data/products";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[var(--ink)] text-white">
      <div className="site-width grid gap-10 py-14 md:grid-cols-3">
        <div>
          <BrandLogo inverted />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            CB Trackel, PLOT NO. 10 SHRI SHYAM VIHAR KARDHANI JAIPUR, KARDHANI,
            Rajasthan, 302012
          </p>
          <a
            href="tel:+917453014747"
            className="mt-4 inline-block text-sm text-white/90 hover:text-white"
          >
            Talk to us · +91 7453014747
          </a>
        </div>

        <div>
          <h6 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Help
          </h6>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/policies/store" className="hover:text-white">
                Store Policies
              </Link>
            </li>
            <li>
              <Link href="/policies/track" className="hover:text-white">
                Track your Order
              </Link>
            </li>
            <li>
              <Link href="/policies/return" className="hover:text-white">
                Return Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h6 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Shop
          </h6>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/40">
            We accept UPI · Cards · Net Banking
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/45">
        © {new Date().getFullYear()} CB Trackel. All rights reserved.
      </div>
    </footer>
  );
}
