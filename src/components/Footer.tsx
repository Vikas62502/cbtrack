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
            Chairbord Pvt Ltd, 13 Sapna Tower, near Marudhar Mart, Kalwar Road,
            Govindpura, Jaipur, Rajasthan 302012. FASTag, GPS, and vehicle
            accessories. Prices in INR.
          </p>
          <a
            href="mailto:connect@chairbord.com"
            className="mt-4 block text-sm text-white/90 hover:text-white"
          >
            connect@chairbord.com
          </a>
          <a
            href="tel:+919269666646"
            className="mt-1 inline-block text-sm text-white/90 hover:text-white"
          >
            +91 9269666646
          </a>
        </div>

        <div>
          <h6 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Help
          </h6>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/policies/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/policies/terms" className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/policies/refunds" className="hover:text-white">
                Refunds & Cancellations
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/orders/track" className="hover:text-white">
                Track your Order
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
        © {new Date().getFullYear()} Chairbord Pvt Ltd. All rights reserved.
      </div>
    </footer>
  );
}
