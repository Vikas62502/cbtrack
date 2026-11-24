import Link from "next/link";

const ADDRESS =
  "Plot No. 10, Shri Shyam Vihar, Kardhani, Jaipur, Rajasthan 302012";
const PHONE = "+91 7453014747";

type Section = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

type Policy = {
  title: string;
  updated?: string;
  intro?: string[];
  sections: Section[];
};

const policies: Record<string, Policy> = {
  store: {
    title: "Store Policies",
    sections: [
      {
        bullets: [
          "All prices are in INR (₹) and include applicable taxes unless a product says otherwise.",
          "Orders are processed within 24–48 hours on business days.",
          "Free shipping applies on all prepaid orders across India.",
        ],
      },
    ],
  },
  track: {
    title: "Track your Order",
    sections: [
      {
        bullets: [
          "Once your order ships, you will receive tracking details via SMS or WhatsApp.",
          "Typical delivery window is 3–5 business days depending on your pincode.",
          `For help, call ${PHONE} with your order ID.`,
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated 24 November 2026",
    intro: [
      "At CB Trackel (“we,” “us,” or “our”), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and buy our products. By using this website, you agree to this policy.",
    ],
    sections: [
      {
        heading: "1. Information We Collect",
        paragraphs: [
          "We collect the following when you place an order or contact us:",
        ],
        bullets: [
          "Personal information: name, delivery address, email address, and phone number.",
          "Transaction information: products ordered, the amount in INR, and the payment status. Card and UPI details are collected by our payment partner, not stored on this website.",
          "Device information: IP address, browser type, and operating system, used to keep the site working.",
        ],
      },
      {
        heading: "2. How We Use Your Information",
        bullets: [
          "To take your order, deliver it, and support you if something goes wrong.",
          "To send order updates by SMS, WhatsApp, or email.",
          "To improve the website and the products we list.",
          "To meet legal and tax requirements.",
        ],
      },
      {
        heading: "3. Data Sharing",
        paragraphs: [
          "We do not sell, trade, or rent your personal information. We share it only with:",
        ],
        bullets: [
          "Service providers who work for us, such as the payment partner that collects the INR payment and the courier that delivers the order.",
          "Legal authorities when the law requires it.",
        ],
      },
      {
        heading: "4. Data Security",
        paragraphs: [
          "We take reasonable steps to protect your information from unauthorized access. No online system is completely secure, and we cannot guarantee absolute security.",
        ],
      },
      {
        heading: "5. Your Choices",
        bullets: [
          "You can ask what personal data we hold about you.",
          "You can ask us to correct inaccurate details.",
          "You can ask us to delete your information when we no longer need it to complete an order or meet a legal duty.",
        ],
      },
      {
        heading: "6. Cookies",
        paragraphs: [
          "The website uses cookies to keep your cart and to remember a session. You can control cookies in your browser settings.",
        ],
      },
      {
        heading: "7. Third-Party Links",
        paragraphs: [
          "Product images or other pages may link to third-party sites. Their privacy practices are their own.",
        ],
      },
      {
        heading: "8. Changes",
        paragraphs: [
          "We may update this policy. The new version will be posted on this page.",
        ],
      },
      {
        heading: "9. Contact",
        paragraphs: [
          `Questions about this policy: call ${PHONE}, or write to us at ${ADDRESS}.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "Last updated 24 November 2026",
    intro: [
      `These Terms and Conditions, together with the Privacy Policy and the Refunds & Cancellations policy, are a binding agreement between CB Trackel (“we”, “us”) and you. They cover your use of this website and the purchase of goods listed here. By using the website or placing an order, you agree to these terms. We may update them, and the current version on this page applies.`,
    ],
    sections: [
      {
        heading: "Using this website",
        bullets: [
          "You agree to give true and complete information at checkout, including your name, phone number, email, and delivery address.",
          "Product descriptions and prices are listed on this website in INR (₹). You should check that a product meets your need before you pay.",
          "The photos, text, and layout of this website belong to CB Trackel. You may not copy them for your own store.",
          "You agree to pay the price shown at checkout. Payment is collected in INR by UPI, card, or net banking through our payment partner.",
          "You will not use the website for anything unlawful under Indian law.",
          "Placing an order and completing payment is a contract to buy those products from us.",
          "If we cannot supply a product, you can claim a refund under the Refunds & Cancellations policy. A claim made after that window is not eligible.",
          "We are not liable for a delay caused by an event outside our control.",
          "These terms are governed by the laws of India. Disputes are subject to the courts in Jaipur, Rajasthan.",
          `Write to us about these terms at ${ADDRESS}, or call ${PHONE}.`,
        ],
      },
      {
        heading: "Orders and delivery",
        bullets: [
          "An order is accepted when payment is confirmed.",
          "We dispatch on business days, usually within 24–48 hours, and delivery across India is usually 3–5 business days after dispatch.",
          "Prices on the product pages are in INR and include applicable taxes unless a product says otherwise.",
        ],
      },
    ],
  },
  refunds: {
    title: "Refunds & Cancellations",
    updated: "Last updated 24 November 2026",
    intro: [
      "Cancellation & Refund Policy. CB Trackel will help you cancel or return an order wherever the rules below allow.",
    ],
    sections: [
      {
        heading: "Cancellation",
        bullets: [
          "A cancellation is accepted when you ask immediately after placing the order and before the order has been handed to the courier. Call +91 7453014747 with your order ID.",
          "Once the order has been shipped, we cannot cancel it. You can refuse delivery or follow the return rules below.",
          "If a cancellation is accepted and payment was already taken, we refund the full amount in INR.",
        ],
      },
      {
        heading: "Returns and damaged items",
        bullets: [
          "Used products, and products returned without the original packaging, are not eligible for a refund.",
          "If the product is damaged, defective, or not what was shown on the site, tell us within 7 days of delivery. We check the complaint and then replace the item or refund it.",
          "A refund that we approve is sent to the original payment method. It takes 6–8 days to process after the return is confirmed.",
        ],
      },
    ],
  },
  return: {
    title: "Return Policy",
    sections: [
      {
        paragraphs: [
          "Returns, cancellations, and refunds are covered on the Refunds & Cancellations page.",
        ],
      },
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [...Object.keys(policies), "contact"].map((slug) => ({ slug }));
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "contact") {
    return <ContactPage />;
  }

  const policy = policies[slug];

  if (!policy) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link href="/" className="mt-4 inline-block text-[var(--navy)]">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
        {policy.title}
      </h1>
      {policy.updated ? (
        <p className="mt-2 text-sm text-[var(--muted)]">{policy.updated}</p>
      ) : null}
      {policy.intro?.map((paragraph) => (
        <p
          key={paragraph}
          className="mt-4 text-sm leading-relaxed text-[var(--ink)]/85"
        >
          {paragraph}
        </p>
      ))}
      <div className="mt-8 space-y-8">
        {policy.sections.map((section) => (
          <section key={section.heading || section.paragraphs?.[0]}>
            {section.heading ? (
              <h2 className="text-lg font-semibold text-[var(--ink)]">
                {section.heading}
              </h2>
            ) : null}
            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-sm leading-relaxed text-[var(--ink)]/85"
              >
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--ink)]/85">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
      {slug === "return" ? (
        <Link
          href="/policies/refunds"
          className="mt-6 inline-block text-sm font-semibold text-[var(--navy)]"
        >
          Refunds & Cancellations
        </Link>
      ) : null}
    </div>
  );
}

function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
        Contact Us
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/85">
        Want to get in touch? Call or message us about an order, a delivery, or
        a product.
      </p>
      <dl className="mt-8 space-y-6">
        <div>
          <dt className="text-sm font-semibold text-[var(--ink)]">
            Call the helpline
          </dt>
          <dd className="mt-1">
            <a href="tel:+917453014747" className="text-sm text-[var(--navy)]">
              {PHONE}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[var(--ink)]">WhatsApp</dt>
          <dd className="mt-1">
            <a
              href="https://wa.me/917453014747"
              className="text-sm text-[var(--navy)]"
            >
              {PHONE}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[var(--ink)]">Location</dt>
          <dd className="mt-1 text-sm leading-relaxed text-[var(--ink)]/85">
            CB Trackel, {ADDRESS}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[var(--ink)]">Work hours</dt>
          <dd className="mt-1 text-sm text-[var(--ink)]/85">
            Mon – Sat: 10am – 7pm
          </dd>
        </div>
      </dl>
    </div>
  );
}
