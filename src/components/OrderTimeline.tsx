const STEPS = [
  { id: "placed", label: "Order placed" },
  { id: "paid", label: "Payment confirmed" },
  { id: "processing", label: "Packed" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
] as const;

function activeIndex(status: string, fulfillment: string) {
  if (status === "failed" || status === "pending") {
    return status === "pending" ? 0 : 0;
  }
  if (fulfillment === "delivered") return 4;
  if (fulfillment === "shipped") return 3;
  if (fulfillment === "packed" || fulfillment === "processing") return 2;
  if (status === "paid") return 1;
  return 0;
}

export default function OrderTimeline({
  status,
  fulfillmentStatus,
  trackingNumber,
}: {
  status: string;
  fulfillmentStatus: string;
  trackingNumber?: string | null;
}) {
  const current = activeIndex(status, fulfillmentStatus);

  return (
    <ol className="mt-5 space-y-2 text-sm">
      {STEPS.map((step, index) => {
        const done = index <= current && status !== "failed";
        return (
          <li key={step.id} className="flex items-center gap-3">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                done
                  ? "bg-[var(--navy)] text-white"
                  : "border border-black/15 text-[var(--muted)]"
              }`}
            >
              {index + 1}
            </span>
            <span className={done ? "text-[var(--ink)]" : "text-[var(--muted)]"}>
              {step.label}
            </span>
          </li>
        );
      })}
      {trackingNumber && (
        <li className="pt-2 text-[var(--muted)]">
          Tracking: <strong className="text-[var(--ink)]">{trackingNumber}</strong>
        </li>
      )}
    </ol>
  );
}
