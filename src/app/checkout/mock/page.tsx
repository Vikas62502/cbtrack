import { Suspense } from "react";
import MockPayClient from "./MockPayClient";

export default function MockPayPage() {
  return (
    <Suspense fallback={<div className="site-width py-16">Loading payment…</div>}>
      <MockPayClient />
    </Suspense>
  );
}
