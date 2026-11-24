import { Suspense } from "react";
import StatusClient from "./StatusClient";

export default function CheckoutStatusPage() {
  return (
    <Suspense fallback={<div className="site-width py-16">Checking payment…</div>}>
      <StatusClient />
    </Suspense>
  );
}
