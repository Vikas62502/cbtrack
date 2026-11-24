import Link from "next/link";

const policies: Record<
  string,
  { title: string; body: string[] }
> = {
  store: {
    title: "Store Policies",
    body: [
      "All prices are inclusive of applicable taxes unless stated otherwise.",
      "Orders are processed within 24–48 hours on business days.",
      "Free shipping applies on all prepaid orders across India.",
    ],
  },
  track: {
    title: "Track your Order",
    body: [
      "Once your order ships, you will receive tracking details via SMS/WhatsApp.",
      "Typical delivery window is 3–5 business days depending on your pincode.",
      "For help, call +91 7453014747 with your order ID.",
    ],
  },
  return: {
    title: "Return Policy",
    body: [
      "Returns are accepted within 7 days of delivery for unused products in original packaging.",
      "Damaged or incorrect items will be replaced at no extra cost after verification.",
      "Refunds (if applicable) are processed to the original payment method within 5–7 days.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only information required to fulfill and support your orders.",
      "Your phone number and address are never sold to third parties.",
      "Payment details are processed securely through trusted payment partners.",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
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
      <ul className="mt-6 space-y-4">
        {policy.body.map((line) => (
          <li
            key={line}
            className="rounded-2xl bg-[var(--sand)] px-5 py-4 text-sm leading-relaxed text-[var(--ink)]/85"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
